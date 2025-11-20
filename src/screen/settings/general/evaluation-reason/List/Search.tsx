import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import { SelectField, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";

import { actions } from "src/core/store";
import {
	getListFiltersRejectionAndReturnReason,
	getLoadingRejectionAndReturnReason,
} from "src/core/store/modules/rejection-and-return-reason/selectors";
import { TRejectionAndReturnReasonFilters } from "src/core/models/rejection-and-return-reason";
import { rejectNoValues } from "src/core/utils/func";

import { reasonTypeOptions } from "../constants";
import { useModulos } from "src/hooks/modulo";

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingRejectionAndReturnReason);
	const savedFilters = useSelector(getListFiltersRejectionAndReturnReason);
	const { modulosAsOptions } = useModulos();

	const onSubmit = (values: TRejectionAndReturnReasonFilters) => {
		const filters = rejectNoValues(values);
		dispatch(actions.rejectionAndReturnReason.setFilters(filters));
	};

	const initialValues: TRejectionAndReturnReasonFilters = {
		reasonType: "",
		description: "",
		...(savedFilters ?? {}),
	};

	return (
		<Panel title={t("settings:evaluationReason.titleSearch")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:evaluationReason.form.modulo")}
									name="moduloId"
									options={modulosAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:evaluationReason.form.reasonType")}
									name="reasonType"
									options={reasonTypeOptions}
								/>
							</Grid>
							<Grid item md={5} xs={12}>
								<TextField
									label={t("settings:evaluationReason.form.description")}
									name="description"
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean action="rejectionAndReturnReason" />
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
