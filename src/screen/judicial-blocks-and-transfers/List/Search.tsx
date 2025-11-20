import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Panel from "src/components/Panel";
import { DateField, NumericField, SelectField } from "src/components/form";

import { useTranslation } from "src/locale/i18n";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TJudicialBlocksAndTransfersFilters } from "src/core/models/judicial-blocks-and-transfers";
import { getFiltersJudicialBlocksAndTransfers } from "src/core/store/modules/judicial-blocks-and-transfers/selectors";

import { usePagination } from "src/hooks/pagination";
import { Clean, Submit } from "src/components/button";
import { occurrenceTypesOptions, allStatusOptions } from "../constants";
import { CONTACT_SEARCH, CONTACT_TYPE, accountabilityStatusOptions } from "src/core/utils/constants";
import { useHistory } from "react-router-dom";
import { usePaymentType } from "src/hooks/fetchLists";
import { Modulos } from "src/core/models/modules";
import { useBanks } from "src/hooks/fetchLists";
import ContactField from "src/components/ContactField";

const Search = ({ loading }: { loading: boolean }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		location: { pathname },
	} = useHistory();
	const { banksAsOptions } = useBanks();

	const { pageSize } = usePagination();
	const filters = useSelector(getFiltersJudicialBlocksAndTransfers);
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);

	const onSubmit = (
		values: TJudicialBlocksAndTransfersFilters,
		{ setSubmitting }: any
	) => {
		const result = rejectNoValues({ ...values, page: 1, pageSize });
		dispatch(
			actions.judicialBlocksAndTransfers.setFilters({
				filters: result,
				page: pathname,
			})
		);
		setSubmitting(false);
	};

	const initialValues: TJudicialBlocksAndTransfersFilters = {
		folderNumber: "",
		id: "",
		occurrenceType: "",
		statusFlowId: "",
		blockOrTransfDateStart: null,
		blockOrTransfDateEnd: null,
		statusApprovalId: "",
		validationDateStart: null,
		validationDateEnd: null,
		registrationDateStart: null,
		registrationDateEnd: null,
		occurrenceReasons: [],
		bankId: "",
		intLawIds: null,
		...(filters ?? {}),
	};

	return (
		<Panel title={t("judicialBlocksAndTransfers:searchTitle")} withPadding>
			<Formik initialValues={initialValues} onSubmit={onSubmit}>
				{({ handleSubmit, isValid, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3} alignItems="flex-start">
							<Grid item xs={12} md={3}>
								<NumericField
									name="folderNumber"
									label={t("form.CTGFolder")}
									placeholder={t("form.typeHere")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<NumericField
									name="id"
									label={t("goodsAndGuarantees:requestNumber")}
									placeholder={t("form.typeHere")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("judicialBlocksAndTransfers:form.occurrenceType")}
									name="occurrenceType"
									options={occurrenceTypesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("status")}
									name="statusFlowId"
									options={allStatusOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name="blockOrTransfDateStart"
											label={"Data do bloq/transf de"}
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name="blockOrTransfDateEnd"
											label={"Data do bloq/transf até"}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.occurrenceReasonDescription')}
									name="occurrenceReasons"
									options={paymentTypeAsOptions}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="bankId"
									label={t("dataImport:goodsAndGuarantees.search.bankId")}
									options={banksAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("judicialBlocksAndTransfers:form.statusApprovalId")}
									name="statusApprovalId"
									options={accountabilityStatusOptions}
								/>
							</Grid>
							<Grid item xs={6} md={3}>
								<DateField
									name="registrationDateStart"
									label="Data do Registro (de)"
								/>
							</Grid>
							<Grid item xs={6} md={3}>
								<DateField name="registrationDateEnd" label="Até" />
							</Grid>
							<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.internalLawyer')}
										name="intLawIds"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.InternalLawyer}
									/>
							</Grid>
							<Grid container spacing={2} alignItems="center">
								<Grid item md={6} xs={6}>
									<Clean action="judicialBlocksAndTransfers" />
								</Grid>

								<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
									<Submit
										type="search"
										submitting={loading || isSubmitting}
										disabled={!isValid || loading}
									/>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
