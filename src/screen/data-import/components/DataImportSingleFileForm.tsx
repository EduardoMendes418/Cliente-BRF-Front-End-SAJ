import {useCallback, useEffect, useRef, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {Box, Button, Grid} from "@material-ui/core";

import UploadFileButton from "src/components/form/Upload/UploadButton";
import {Clean, Submit} from "src/components/button";
import {useTranslation} from "src/locale/i18n";

import {SINGLE_FILE_TYPE, TGetContacts} from "src/core/models/data-import";
import {getContacts, getContactsCsv, importSingleFile} from "src/core/store/modules/data-import/thunk";
import {actions} from "src/core/store";

import ImportErrors from "../components/ImportErrors";
import useEmitSnackbarStatus from "../hooks/useEmitSnackbarStatus";
import {Formik, useFormikContext} from "formik";
import {CPFOrCNPJField, DateField, SelectField} from "src/components/form";
import {TextField} from "src/components/form";
import Panel from "src/components/Panel";
import FileSaver from "file-saver";
import {convertToBlob, convertToBlobCSV} from "src/core/utils/func";
import TableComponent, {ColumnData} from "src/components/Table";
import {FormLabel} from "@mui/material";
import Pagination from "src/components/Pagination";

type TProps = {
	type: SINGLE_FILE_TYPE;
	onGenerateTemplateFile?: (values: any) => void;
	isGeneratingTemplateFile?: boolean;
};

const DataImportSingleFileForm = ({type}: TProps) => {

	const {t} = useTranslation();
	const dispatch = useDispatch();
	const inputFileRef = useRef<HTMLInputElement>(null);

	const [EntityType, setEntityType] = useState<number>(1);
	const [data, setData] = useState<any>()
	const [itemCount, setItemCount] = useState<number>(0);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [pageCount, setPageCount] = useState<number>(1);
	const [parameters, setParameters] = useState<object>();

	const onPageChange = useCallback((page: number) => setPage(page), [])
	const onPageSizeChange = useCallback((pageSize: number) => setPageSize(pageSize), [])

	const getData = async () => {
		const {payload} = await dispatch(getContacts({...parameters, Page: page, PageSize: pageSize})) as any;
		setData(payload.items)
	}

	useEffect(() => {
		if (data !== undefined)
			getData()
		
	}, [page, pageSize])

	const personsAsOption = [
		{label: 'Juridica', value: 1},
		{label: 'Física', value: 0}
	];

	useEmitSnackbarStatus();

	const handleImport = useCallback(() => {
		const file = inputFileRef.current?.files;
		if (file) {
			dispatch(importSingleFile({type, file}));
			inputFileRef.current.value = "";
		}
	}, [dispatch, type]);

	useEffect(() => dispatch(actions.dataImport.clear()), [dispatch]);

	const initialValues: any = useMemo(
		() => ({
			NameOrCorporateName: "",
			FantasyName: "",
			CpfOrCnpj: "",
			Clifor: "",
			RgOrOab: "",
			CreatedAtStart: null,
			CreatedAtEnd: null,
			EntityType: "",
		}),
		[]
	);

	const FormObserver: React.FC = () => {
		const {values}: any = useFormikContext();

		useEffect(() => {
			setEntityType(values?.EntityType);
			setParameters(values);
		}, [values]);

		return null;
	};

	const onSubmit = async (values: any) => {
		const {payload} = await dispatch(getContacts({...values, PageSize: pageSize})) as any

		setItemCount(payload.itemCount)
		setPageCount(payload.pageCount)
		setData(payload.items)
	};

	const onGenerateCsv = async (values: TGetContacts) => {
		const {payload} = await dispatch(getContactsCsv(values)) as any;

		FileSaver.saveAs(
			convertToBlob(payload) as Blob,
			"carga-contatos-template"
		);
	};

	const handleClearImportFile = useCallback(() => {
		if (inputFileRef.current) inputFileRef.current.value = "";
		setData([]);
		setItemCount(0);
		setPageCount(0);
		setPage(1);
	}, []);

	const columns: ColumnData[] = [
		{label: t("dataImport:contacts.list.name"), field: 'name'},
		{label: t("dataImport:contacts.list.identificationNumber"), field: 'identificationNumber'},
		{label: t("dataImport:contacts.list.name"), field: 'tradeName'},
		{label: t("dataImport:contacts.list.phoneNumber"), field: 'phoneNumber'},
		{label: t("dataImport:contacts.list.email"), field: 'email'},
		{label: t("dataImport:contacts.list.sapCodeCliFor"), field: 'sapCodeCliFor'},
		{label: t("dataImport:contacts.list.rgOab"), field: 'rgOab'},
		{label: t("dataImport:contacts.list.creationDate"), field: 'creationDate', type: 'date'},
	];


	const rows = useMemo(
		() =>
			data?.map((item: any) => {
				return {
					name: item.name,
					entityType: item.type === 2 ? "Jurídica" : "Física",
					identificationNumber: item.identificationNumber,
					tradeName: item.company !== null ? item.company.tradeName : '',
					phoneNumber: item.phones.length > 0 ? item.phones[0].number : '',
					email: item.emails.length > 0 ? item.emails[0].email : '',
					rgOab: item.rgOAB !== null ? item.rgOAB : '',
					sapCodeCliFor: item.sapCodeCliFor,
					creationDate: item.creationDate
				};
			}),
		[data]
	);

	return (
		<Panel title={t("dataImport:contacts.filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({handleSubmit, values, dirty}) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						<FormObserver/>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField name="NameOrCorporateName" label={t("officeManagement:requestPayment.socialReason")}/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									id="EntityType"
									label={t("legalDocs:bestowed.kindOfPerson.title")}
									options={personsAsOption}
									name="EntityType"
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<CPFOrCNPJField
									label={t("legalDocs:bestowed.cpfCnpj")}
									name="CpfOrCnpj"
									type={EntityType === 1 ? "cnpj" : "cpf"}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField name="FantasyName" label={"Nome Fantasia"}/>
							</Grid>

							<Grid item md={3} xs={12}>
								<TextField name="Clifor" label={"Clifor"}/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("legalDocs:correspondents.rgOab")}
									name="RgOrOab"
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name="CreatedAtStart"
											label={t("reports:main.form.creationDateInitial")}
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name="CreatedAtEnd"
											label={t("reports:common.form.until")}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems='center'>
							<Grid item md={6} xs={6}>
								<Clean action="dataImport" onClick={handleClearImportFile}/>
							</Grid>
							<Grid item md={6} xs={6} style={{textAlign: 'right'}}>
								<Submit
									type="search"
									disabled={!dirty}
								/>
							</Grid>
						</Grid>
						<Box display="flex" justifyContent="flex-end" mt={3}>
							<UploadFileButton
								variant="contained"
								color="primary"
								text={t("dataImport:common.importSpreadsheet")}
								onChange={handleImport}
								inputRef={inputFileRef}
								accept=".csv"
							/>
							<Button
								color='primary'
								variant='contained'
								onClick={() => onGenerateCsv(values)}
							>{t("dataImport:common.generateSpreadsheet")}</Button>
						</Box>
					</form>
				)}
			</Formik>
			<Panel title="Listagem de resultados gerados pelo filtro">
				<FormLabel style={{fontWeight: 'bold', display: 'flex', margin: '3% 3% 0 1.5%'}}>
					{t('dataImport:common.itemListCount')} {itemCount}
				</FormLabel>
				<TableComponent
					rows={rows}
					columns={columns}
				/>
				<Pagination
					page={page}
					pageSize={pageSize}
					pageCount={pageCount}
					onChangePage={onPageChange}
					onChangePageSize={onPageSizeChange}
				/>
			</Panel>
			<ImportErrors/>
		</Panel>
	);
};

export default DataImportSingleFileForm;
