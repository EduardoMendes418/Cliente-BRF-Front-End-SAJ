import { Grid } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { Submit } from "src/components/button";
import { SelectField } from "src/components/form";
import Panel from "src/components/Panel";
import { TReportDictionaryFilter } from "src/core/models/reports";
import { useTranslation } from "src/locale/i18n";
import useEnvironments from "./hooks/useEnvironment";
import useReportTypes from "./hooks/useReportTypes";

interface FormData {
	reportComponent?: number;
	environment: number;
}

interface FilterProps {
	onSelect: (value: TReportDictionaryFilter) => void;
}

const Filter = (props: FilterProps) => {
	const { reportTypeOptions } = useReportTypes();
	const { environmentOptions } = useEnvironments();
	const { t } = useTranslation();

	const onSubmit = (values: FormData, helper: FormikHelpers<FormData>) => {
		if (values.reportComponent) {
			props.onSelect({
				reportComponent: values.reportComponent,
				environment: values.environment
			});
		}

		helper.setSubmitting(false);
	};

	const initialValues: FormData = {
		environment: 0,
	};

	const reportOptions = reportTypeOptions?.filter(report => {
		return report.value !== 75;
	})

	return (
		<Panel title={t("settings:report.filter.title")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={8} xs={12}>
								<SelectField
									label={t("settings:report.filter.reportComponent")}
									name="reportComponent"
									options={reportOptions}
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:report.filter.environment")}
									name="environment"
									options={environmentOptions}
									required
								/>
							</Grid>
							<Grid container item md={1} xs={12} justifyContent="flex-end">
								<Submit type="search" />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Filter;
