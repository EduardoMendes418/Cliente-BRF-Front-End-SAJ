import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useAreasResponsible, useGroupedAreas, useGroupedAreasById } from "src/hooks/fetchLists";
import ContactField from 'src/components/ContactField'
import Panel from "src/components/Panel";
import { DateField, NumericField, SelectField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
	getListFiltersOfficeManagementRequestRefund,
	getLoadingOfficeManagementRequestRefund,
} from "src/core/store/modules/office-management-request-refund/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TOfficeManagementRequestRefundParams } from "src/core/models/office-management-request-refund";
import { useEffect } from "react";
import { accountabilityStatusOptions } from 'src/screen/goods-and-guarantees/accountability/constants'
import UserSearchComponent from "../../../requisitions/components/UserSearchComponent";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";


const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { page, pageSize } = usePagination();
	const loading = useSelector(getLoadingOfficeManagementRequestRefund);
	const savedFilters = useSelector(getListFiltersOfficeManagementRequestRefund);
	const { groupedAreasAsOptions} = useGroupedAreas();
	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	
	const onSubmit = (
		{ ...values }: TOfficeManagementRequestRefundParams,
		{ setSubmitting }: FormikHelpers<TOfficeManagementRequestRefundParams>
	) => {
		const filter = rejectNoValues({ ...values, page, pageSize });
		dispatch(actions.officeManagementRequestRefund.setFilters(filter));
		setSubmitting(false);
	};

	useEffect(() => {
		dispatch(actions.officeManagementRequestRefund.setFilters());
	}, [dispatch]);

	const clearFilters = () => {
		dispatch(actions.officeManagementRequestRefund.setFilters());
	}

	const initialValues: TOfficeManagementRequestRefundParams = {
		requestDate: null,
		folderNumber: "",
		areaDejurId: "",
		processPartiesOtherId: "",
		refundSolicitationId: "",
		requesterId: null,
		statusFlowId: "",
		officeResponsible: "",
		...(savedFilters ?? {}),
	};

	return (
		<Panel title={t("officeManagement:search")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<DateField
									name="requestDate"
									label={t("officeManagement:requestPayment.requestData")}
								/>
							</Grid>
							<Grid item xs={10} md={3}>
								<NumericField
									name='refundSolicitationId'
									label={"Número da solicitação"}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={10} md={3}>
								<NumericField
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('closure:businesCombination.search.dejurArea')}
									name="areaDejurId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('field.opposingPart')}
									name="oppositePartyId"
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									label={t("officeManagement:report.officeResponsible")}
									name="officeResponsible"
									options={groupedAreasByIdAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserSearchComponent
									name="requesterId"
									label="Solicitante"
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Status"}
									name="statusFlowId"
									options={accountabilityStatusOptions}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit
									type="search"
									submitting={loading || isSubmitting}
									disabled={!dirty}
								/>
							</Grid>
						</Grid>
						<Clean onClick={clearFilters} action="officeManagementPayment" />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;

