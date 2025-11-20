import {useCallback, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import {
	DateField,
	SelectField,
	NumericField,
	TextField,
} from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { useTranslation } from "src/locale/i18n";

import {
	getDataImportFilters,
	getDataImportStatus,
} from "src/core/store/modules/data-import/selectors";
import { actions } from "src/core/store";
import { TDataImportGoodsAndGuaranteesFilters } from "src/core/models/data-import";
import { fetchAreas } from "src/core/store/modules/areas/thunks";
import { accountabilityStatusOptions as asOptions } from 'src/core/utils/constants';
import { useBanks, useGroupedAreas, useGuaranteeType } from "src/hooks/fetchLists";
import { getListGuaranteeModality } from "src/core/store/modules/guarantee-modality/selectors"
import { guaranteeStatusOptions } from "./constants";
import { FormLabel } from "@mui/material";
import { getListAsOptionPaymentType } from "src/core/store/modules/payment-type/selectors";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";
import {getPagination} from "../../../core/store/modules/pagination/selectors";
import * as yup from 'yup';
import { statusFlowIdListAsOptionGuaranteeModeIdFourOrFive, statusFlowIdListAsOptionGuaranteeModeIdThree, statusFlowIdListAsOptionGuaranteeModeIdTwo, statusFlowIdListAsOptionNoGuaranteeModeId } from "src/screen/goods-and-guarantees/statusInfo";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

type Props = {
	formRef: any;
};

const validationSchema = yup.object({
	ids: yup.string().matches(
		/^\d+(?:;?\d+)*$/, "A pesquisa deve seguir o padrão de ID's separados por ponto-e-vírgula").notRequired()}); 


const Search = ({ formRef }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		location: { pathname },
	} = useHistory();

	const { banksAsOptions } = useBanks();
	const { guaranteeTypeAsOptions } = useGuaranteeType();
	const loading = useSelector(getDataImportStatus);
	const GuaranteeModality = useSelector(getListGuaranteeModality);
	const savedFilters = useSelector(getDataImportFilters);
	const { groupedAreasAsOptions} = useGroupedAreas();
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const pagination = useSelector(getPagination);
	const [statusFlowIdListAsOption, setStatusFlowListAsOptions] = useState<any>(statusFlowIdListAsOptionNoGuaranteeModeId);


	const cleanList = useCallback(() => {
		dispatch(actions.dataImport.clear())
		dispatch(actions.pagination.clear())
	}, [dispatch])
	
	useEffect(() => {
		dispatch(fetchAreas(1));
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
		cleanList()
	}, [dispatch, cleanList]);


	const onSubmit = async (
		values: TDataImportGoodsAndGuaranteesFilters,
		{ setSubmitting }: FormikHelpers<TDataImportGoodsAndGuaranteesFilters>
	) => {
		
		dispatch(actions.dataImport.setFilters({ filters: {...values, ModalitiesIds: [values.guaranteeModeId]}, page: pathname }));
		setSubmitting(false); 
	};
	
	const changeStatusFlowOption = (guaranteeModeId: any) => {
		switch (guaranteeModeId){
			case 2: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdTwo);
			break;
			case 3: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdThree);
			break;
			case 4: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdFourOrFive);
			break;
			case 5: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdFourOrFive);
			break
			default: setStatusFlowListAsOptions(statusFlowIdListAsOptionNoGuaranteeModeId);
		}
	}

	const initialValues: TDataImportGoodsAndGuaranteesFilters = {
		guaranteeModeId: "",
		originAreaId: [],
		legalDepartmentAreaId: [],
		folderNumbers: "",
		startGuaranteeDate: null,
		endGuaranteeDate: null,
		status: [1],
		guaranteesStatus: "",
		judicialAccountNumber: "",
		bankId: [],
		insuranceCompanyName: "",
		policyNumber: "",
		endorsementNumber: "",
		endorsementStartDate: null,
		endorsementEndDate: null,
		invoiceNumber: "",
		fixedAssetRegistryNumber: "",
		suretyLetterNumber: "",
		registrationNumber: "",
		paymentTypeId: [],
		guaranteeTypeId: '',
		ids: "",
		...((savedFilters as any)[pathname] ?? {}),
	};


	return (
		<Panel title={t("dataImport:goodsAndGuarantees.filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
				validationSchema={validationSchema} 
				innerRef={formRef}
			>
				{({ handleSubmit, values }) => {
					const { guaranteeModeId } = values;

					return (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<GroupedSelectFiledMultiple
										options={groupedAreasAsOptions ?? []}
										label={t("dataImport:goodsAndGuarantees.search.originAreaId")}
										name="originAreaId"
										multiple
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<GroupedSelectFiledMultiple
										label={t("dataImport:goodsAndGuarantees.search.dejurArea")}
										name="legalDepartmentAreaId"
										options={groupedAreasAsOptions ?? []}
										multiple
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<NumericField
										name="folderNumbers"
										label={t("dataImport:goodsAndGuarantees.search.CTGFolder")}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("dataImport:goodsAndGuarantees.search.status")}
										name="status"
										options={guaranteeStatusOptions}
										multiple
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												name="startGuaranteeDate"
												label={t("dataImport:goodsAndGuarantees.search.startGuaranteeDate")}
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												name="endGuaranteeDate"
												label={t("dataImport:goodsAndGuarantees.search.endGuaranteeDate")}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										name="guaranteesStatus"
										label={t("dataImport:goodsAndGuarantees.search.guaranteesStatus")}
										options={statusFlowIdListAsOption}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={"Status da contabilização"}
										name="statusApprovalId"
										options={asOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}></Grid>
								<Grid item md={3} xs={12}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<NumericField
												name="startValueGuarantee"
												label={t("dataImport:goodsAndGuarantees.search.startValueGuarantee")}
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<NumericField
												name="endValueGuarantee"
												label={t("dataImport:goodsAndGuarantees.search.endValueGuarantee")}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										name="guaranteeModeId"
										label={t("dataImport:goodsAndGuarantees.search.guaranteeModeId")}
										onChange={(e: any) => changeStatusFlowOption(e.target.value)}
										options={GuaranteeModality.map(({description, id}) => ({label:description, value: id ?? 0}))}
										required
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										options={paymentTypeOptions}
										label={t("reports:payment.form.tipoPagamentoId")}
										name="paymentTypeId"
										multiple
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("goodsAndGuarantees:form.guaranteeType")}
										name="guaranteeTypeId"
										options={guaranteeTypeAsOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
											<TextField
												name="ids"
												label={t("dataImport:goodsAndGuarantees.search.goodAndGuaranteeId")}
												helperText={t("dataImport:goodsAndGuarantees.search.idHelperText")}
											/>
										</Grid>
								{1 === guaranteeModeId && (
									<>
										<Grid item md={3} xs={12}>
											<SelectField
												name="bankId"
												label={t("dataImport:goodsAndGuarantees.search.bankId")}
												options={banksAsOptions}
												multiple
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<NumericField
												name="judicialAccountNumber"
												label={t("dataImport:goodsAndGuarantees.search.judicialAccountNumber")}
											/>
										</Grid>
									</>
								)}
								{2 === guaranteeModeId && (
									<>
										<Grid item md={3} xs={12}>
											<TextField
												name="insuranceCompanyName"
												label={t("dataImport:goodsAndGuarantees.search.insuranceCompanyName")}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<TextField
												name="policyNumber"
												label={t("dataImport:goodsAndGuarantees.search.policyNumber")}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<NumericField
												name="endorsementNumber"
												label={t("dataImport:goodsAndGuarantees.search.endorsementNumber")}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<Grid container spacing={3}>
												<Grid item xs={6} md={6}>
													<DateField
														name="endorsementStartDate"
														label={t("dataImport:goodsAndGuarantees.search.endorsementStartDate")}
													/>
												</Grid>
												<Grid item xs={6} md={6}>
													<DateField
														name="endorsementEndDate"
														label={t("dataImport:goodsAndGuarantees.search.endorsementEndDate")}
													/>
												</Grid>
											</Grid>
										</Grid>
									</>
								)}
								{3 === guaranteeModeId && (
									<>
										<Grid item md={3} xs={12}>
											<SelectField
												name="bankId"
												label={t("dataImport:goodsAndGuarantees.search.bankId")}
												options={banksAsOptions}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<NumericField
												name="suretyLetterNumber"
												label={t("dataImport:goodsAndGuarantees.search.suretyLetterNumber")}
											/>
										</Grid>
									</>
								)}
								{(4 === guaranteeModeId || 5 === guaranteeModeId) && (
									<>
										<Grid item md={3} xs={12}>
											<NumericField
												name="invoiceNumber"
												label={t("dataImport:goodsAndGuarantees.search.invoiceNumber")}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<NumericField
												name="registrationNumber"
												label={t("dataImport:goodsAndGuarantees.search.registrationNumber")}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<NumericField
												name="fixedAssetRegistryNumber"
												label={t("dataImport:goodsAndGuarantees.search.fixedAssetRegistryNumber")}
											/>
										</Grid>
									</>
								)}
							</Grid>
							<Grid container spacing={2} alignItems="center">
								<Grid item md={6} xs={6}>
									<Clean action="dataImport" page={pathname} onClick={cleanList} />
								</Grid>
								<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
									<Submit type="search" submitting={loading === "fetching"} />
								</Grid>
								<FormLabel
									style={{
										fontWeight: "bold",
										display: "flex",
										margin: "3% 3% 0 1.5%",
									}}
								>
									{t("dataImport:common.itemListCount")} {pagination.itemCount}
								</FormLabel>
							</Grid>
						</form>
					);
				}}
			</Formik>
		</Panel>
	);
};

export default Search;
