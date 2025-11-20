import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileSaver from 'file-saver';
import moment from 'moment';

import { useTranslation } from 'src/locale/i18n';
import ScreenTemplate from 'src/components/Screen';
import { importGoodsGuarantees } from 'src/core/store/modules/data-import/thunk';
import { getDataImportFilters } from 'src/core/store/modules/data-import/selectors';

import ImportErrors from '../components/ImportErrors';
import Search from './Search';
import List from "./List/List";
import {actions, AppDispatch} from 'src/core/store';
import {
	TDataImportGoodsAndGuaranteesFilters,
} from 'src/core/models/data-import';
import { fetchGoodsGuarantees, fetchGoodsGuaranteesCsv } from 'src/core/store/modules/data-import/thunk';
import { TDataImport } from "src/core/models/data-import";
import useEmitSnackbarStatus from 'src/screen/data-import/hooks/useEmitSnackbarStatus';
import { convertToBlob, convertToBlobCSV } from 'src/core/utils/func';
import Pagination from "../../../components/Pagination";
import {getPagination} from "../../../core/store/modules/pagination/selectors";
import Form from "src/screen/data-import/components/FormImportMultipleAttachments";
import { FormikHelpers } from 'formik';
import { ButtonDiv, ErrorDiv } from './style';

const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: theme.spacing(1),
	},
}));

const DataImportGoodAndGuarantees = () => {
	const classes = useStyles();
	const history = useHistory();
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const [isErrorScreen, setIsErrorScreen] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const formRef = useRef<{ values: Record<string, any> }>(null);
	const { location: { pathname } } = useHistory();
	const pagination = useSelector(getPagination)

	const filters = useSelector(getDataImportFilters);

	useEffect(() => {
		if ((filters as any)[pathname] && (filters as any)[pathname].guaranteeModeId !== undefined){
			dispatch(fetchGoodsGuarantees({...(filters as any)[pathname], page: pagination.page, pageSize: pagination.pageSize}))
		}
	}, [dispatch, filters, pathname, pagination]);
	

	const onFormSubmit = async (values: TDataImport, formikHelpers: FormikHelpers<{}>) => {
		const { meta } = await dispatch(
			await dispatch(importGoodsGuarantees({ files: values, "guaranteeModeId": 7 }))
		);

		if (meta.requestStatus === "rejected") {
			enqueueSnackbar("Algo deu errado", { variant: "error" });
			setIsErrorScreen(true)
		} else {
			enqueueSnackbar(t("dataImport:importErrors.importSuccess"), {
				variant: "success",
			});
			history.push(`/carga-de-dados/monitor-de-execucao`);
			formikHelpers.resetForm()
		}
	};

	const handleExport = useCallback(async (e) => {
		try {
			const values = formRef.current?.values as TDataImportGoodsAndGuaranteesFilters;
			if (!values.guaranteeModeId) throw new Error('errorGuaranteeModeId');
			const finalvalues = {...values}
			delete finalvalues.guaranteeModeId
			const { payload } = await dispatch(fetchGoodsGuaranteesCsv(values));
			
			FileSaver.saveAs(convertToBlob(payload), `garantia-${moment().format()}`);

			enqueueSnackbar(t('dataImport:common.exportSuccess'), { variant: 'success' });

		} catch (err: unknown) {
			if(typeof err === "object" && err && typeof (err as any)["message"] === "string")
				if ((err as any)["message"] === "errorGuaranteeModeId") return enqueueSnackbar(t('dataImport:goodsAndGuarantees.errorGuaranteeModeId'), { variant: 'error' });
			enqueueSnackbar(t('dataImport:common.exportErrors'), { variant: 'error' });
			setIsErrorScreen(true)
		}

	}, [dispatch, formRef, enqueueSnackbar, t]);

	useEmitSnackbarStatus();
	useEffect(() => () => dispatch(actions.dataImport.clear()), [dispatch]);

	return (
		<ScreenTemplate>
			{!isErrorScreen && <>
				<Search
					formRef={formRef}
				/>
				<List />
				<Pagination />
				<Form
					accept='.xlsx'
					labelFormFile={"Importação de bens e garantia"}
					labelFileAttachments={"Anexo de bens e garantias"}
					onSubmit={onFormSubmit}
				/>
				<ButtonDiv>
					<Button
						className={classes.button}
						color='primary'
						variant='contained'
						onClick={handleExport}
						style={{
							transform: "translate(-195px, -36px)"
						}}
					>
						{t('dataImport:goodsAndGuarantees.export')}
					</Button>
				</ButtonDiv>

			</>}
			{isErrorScreen && <>
				<ImportErrors />

					<ErrorDiv>
						<Button
							className={classes.button}
							color='primary'
							variant='contained'
							onClick={() => setIsErrorScreen(false)}
						>
							{t("dataImport:goBack")}
						</Button>
					</ErrorDiv>

			</>}
		</ScreenTemplate>
	);
}

export default DataImportGoodAndGuarantees;