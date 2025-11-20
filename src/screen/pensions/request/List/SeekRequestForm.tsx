import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers } from "formik";
import { Grid } from "@material-ui/core";

import Panel from "src/components/Panel";
import { Clean, Submit } from "src/components/button";
import { SelectField, TextField, DateField } from "src/components/form";

import { useTranslation } from "src/locale/i18n";
import { useGroupedAreas } from "src/hooks/fetchLists";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import { TRequestPensionFilters } from "src/core/models/pensions";
import { actions } from "src/core/store";
import {
	getPensionRequestIsFetching,
	getPensionRequestListFilters,
} from "src/core/store/modules/pensions/request-pensions/selectors";
import {
	requestStatusAsOptions,
	requestStatusFlowAsOptions,
} from "../constants";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const SeekRequestForm = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { pageSize } = usePagination();

	const { groupedAreasAsOptions} = useGroupedAreas();
	const loading = useSelector(getPensionRequestIsFetching);
	const savedFilters = useSelector(getPensionRequestListFilters);

	const onSubmit = (
		values: TRequestPensionFilters,
		{ setSubmitting }: FormikHelpers<TRequestPensionFilters>
	) => {
		const result = rejectNoValues({ ...values, page: 1, pageSize });
		dispatch(actions.pensions.requestPensions.setFilters(result));
		setSubmitting(false);
	};

	const initialValues: TRequestPensionFilters = {
		id: "",
		areaId: "",
		folderNumber: "",
		requestDate: null,
		flowId: "",
		requestStatus: "",
		...(savedFilters ?? {}),
	};

	return (
		<Panel title={t("pension:request.filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField
									name="id"
									label={t("pension:request.requestNumber")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField name="folderNumber" label={t("form.CTGFolder")} />
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									name="areaId"
									label={t("form.area")}
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									name="requestDate"
									label={t("pension:request.requestDate")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="flowId"
									label={t("pension:request.form.flowId")}
									options={requestStatusFlowAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="requestStatus"
									label={t("pension:request.form.requestStatus")}
									options={requestStatusAsOptions}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean action="pensions.requestPensions" />
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit
									type="search"
									submitting={loading || isSubmitting}
									disabled={loading}
								/>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default SeekRequestForm;
