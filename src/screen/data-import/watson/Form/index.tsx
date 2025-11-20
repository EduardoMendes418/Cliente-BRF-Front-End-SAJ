import { useTranslation } from "src/locale/i18n";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Box, FormControl, MenuItem, Select } from "@material-ui/core";

import { useSnackbar } from "notistack";
import { TWatson } from "src/core/models/watson";
import { Submit } from "src/components/button";

import { fetchWatsonCsv } from "src/core/store/modules/watson-export/thunks";
import { getStatusWatson } from "src/core/store/modules/watson/selector";
import Fields from "src/screen/data-import/watson/Form/Fields";
import ScreenTemplate from "src/components/Screen";
import useEmitSnackbarStatus from "src/screen/data-import/hooks/useEmitSnackbarStatus";
import {
	fetchWatsonList,
	getWatsonItem,
} from "src/core/store/modules/watson/thunks";
import { usePagination } from "src/hooks/pagination";
import { ChangeEvent, useEffect, useState } from "react";
import Panel from "src/components/Panel";

const Form = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const [watsonData, setWatsonData] = useState<any[]>([]);
	const [filterId, setFilterId] = useState<number | undefined>();
	const [item, setItem] = useState<any>();
	const history = useHistory();

	const loading = useSelector(getStatusWatson);
	const { enqueueSnackbar } = useSnackbar();

	useEmitSnackbarStatus();

	const getWatsonList = async () => {
		const { payload } = (await dispatch(
			fetchWatsonList({ page, pageSize })
		)) as any;
		setWatsonData(
			payload.items
				.filter((watson: any) => watson.statusFilter === true)
				.map((x: any) => {
					return {
						label: x.nameFilter,
						value: x.id,
					};
				})
		);
	};

	const getWatsonFilter = async () => {
		const { payload } = (await dispatch(
			getWatsonItem({ id: filterId })
		)) as any;
		setItem(payload);
	};

	useEffect(() => {
		getWatsonList();
		
	}, []);

	useEffect(() => {
		if (typeof filterId === "number") {
			getWatsonFilter();
		}
		
	}, [filterId]);

	const handleExport = async (values: TWatson) => {
		let folderNumberArray: string[] = [];
		if (typeof values?.folderNumber === "string")
			folderNumberArray = values?.folderNumber?.split(";");
		try {
			(await dispatch(
				fetchWatsonCsv({
					...values,
					folderNumber: folderNumberArray,
					WatsonSearchFilterId: filterId,
				})
			)) as any;
			enqueueSnackbar(t("dataImport:common.exportSuccess"), {
				variant: "success",
			});
			history.push("/carga-de-dados/carga-watson");
		} catch ({ message }: any) {
			enqueueSnackbar(t("dataImport:common.exportErrors"), {
				variant: "error",
			});
		}
	};
	const initialValues: TWatson = {
		legalDepartamentArea: [item?.legalDepartamentArea][0] ?? [],
		folderNumber:
			(item?.folderNumber !== null ? item?.folderNumber[0] : "") ?? "",
		litigationRelationship: item?.litigationRelationship ?? "",
		areaDejur: item?.areaDejur,

		filterBaseGeralContingencyEnum:
			[item?.filterBaseGeralContingencyEnum][0] ?? [],
		filterBaseGeralStatusEnum: [item?.filterBaseGeralStatusEnum][0] ?? [],
		filterBaseGeralSphere: [item?.filterBaseGeralSphere][0] ?? [],
		filterBaseGeralCreationDateStart: item?.filterBaseGeralCreationDateStart,
		filterBaseGeralCreationDateEnd: item?.filterBaseGeralCreationDateEnd,
		filterBaseGeralProvisionClass:
			[item?.filterBaseGeralProvisionClass][0] ?? [],

		filterBaseGeralDeadContingencyEnum:
			[item?.filterBaseGeralDeadContingencyEnum][0] ?? [],
		filterBaseGeralDeadStatusEnum:
			[item?.filterBaseGeralDeadStatusEnum][0] ?? [],
		filterBaseGeralDeadSphere: [item?.filterBaseGeralDeadSphere][0] ?? [],
		filterBaseGeralDeadTerminationDateStart:
			item?.filterBaseGeralDeadTerminationDateStart,
		filterBaseGeralDeadTerminationDateEnd:
			item?.filterBaseGeralDeadTerminationDateEnd,
		filterBaseGeralDeadProvisionClass:
			[item?.filterBaseGeralDeadProvisionClass][0] ?? [],

		filterGoodsGuarantesGuaranteeModeId:
			[item?.filterGoodsGuarantesGuaranteeModeId][0] ?? [],
		filterGoodsGuarantesPaymentType:
			[item?.filterGoodsGuarantesPaymentType][0] ?? [],
		filterGoodsGuarantesStatusEnum:
			[item?.filterGoodsGuarantesStatusEnum][0] ?? [],
		filterGoodsGuarantesBearishReasons:
			[item?.filterGoodsGuarantesBearishReasons][0] ?? [],

		filterConvertedDepositGuaranteeModeId:
			[item?.filterConvertedDepositGuaranteeModeId][0] ?? [],
		filterConvertedDepositPaymentType:
			[item?.filterConvertedDepositPaymentType][0] ?? [],
		filterConvertedDepositSituationAccountability:
			[item?.filterConvertedDepositSituationAccountability][0] ?? [],
		filterConvertedDepositBearishReasons:
			[item?.filterConvertedDepositBearishReasons][0] ?? [],
		filterConvertedStatus: [item?.filterConvertedStatus][0] ?? [],
		filterConvertedDepositApprovalDateStart:
			item?.filterConvertedDepositApprovalDateStart,
		filterConvertedDepositApprovalDateEnd:
			item?.filterConvertedDepositApprovalDateEnd,

		filterPaymentStatusApprovalId:
			[item?.filterPaymentStatusApprovalId][0] ?? [],
		filterPaymentPaymentType: [item?.filterPaymentPaymentType][0] ?? [],
		filterPaymentSapEntryDateStart: item?.filterPaymentSapEntryDateStart,
		filterPaymentSapEntryDateEnd: item?.filterPaymentSapEntryDateEnd,

		indexSelic: item?.indexSelic ?? "",
		indexLegalInterest: item?.indexLegalInterest ?? "", 
		
		baseRevision: false,
		simulation: false
	};

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={handleExport}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={"Selecione um filtro para ser executado"} withPadding>
							<Box maxWidth="30%">
								<FormControl variant="outlined">
									<Select
										value={filterId}
										onChange={(event: ChangeEvent<{ value: unknown }>) => {
											setFilterId(Number(event.target.value));
										}}
									>
										{watsonData.map(({ value, label }) => (
											<MenuItem value={value}>{label}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Panel>

						{filterId !== undefined && item !== undefined ? (
							<>
								{" "}
								<Fields />{" "}
								<Box mt="20px" textAlign="right">
									<Submit
										disabled={loading === "saving"}
										submitting={loading === "saving" || isSubmitting}
										text={t("dataImport:smartswap.filter.generateList")}
									/>
								</Box>{" "}
							</>
						) : null}
					</form>
				)}
			</Formik>
		</ScreenTemplate>
	);
};
export default Form;
