import { Grid } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { Submit, Button } from "src/components/button";
import { RadioGroup, TextField } from "src/components/form";
import Panel from "src/components/Panel";
import { TReportDictionary } from "src/core/models/reports";
import { useTranslation } from "src/locale/i18n";

interface FormData {
	displayName: string;
	fieldName: string;
	fixedField: boolean;
}

interface FormProps {
	item?: FormData;
	onAdd: (data: TReportDictionary) => void;
	onClear: () => void;
}

const Form = (props: FormProps) => {
	const { t } = useTranslation();

	const initialValues: FormData = props.item ?? {
		displayName: "",
		fieldName: "",
		fixedField: false,
	};

	const onSubmit = (
		values: FormData,
		{ setSubmitting, resetForm }: FormikHelpers<FormData>
	) => {
		props.onAdd({
			orderColumn: 0,
			reportComponent: 0,
			...values,
		});
		setSubmitting(false);

		if (!props.item) {
			resetForm();
		}
	};

	return (
		<Panel title={t("settings:report.form.title")} withPadding>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={4}>
								<TextField
									label={t("settings:report.form.displayName")}
									name="displayName"
									required
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									label={t("settings:report.form.fieldName")}
									name="fieldName"
									required
								/>
							</Grid>
							<Grid item xs={12} md={2}>
								<RadioGroup
									label={t("settings:report.form.fixedField")}
									name="fixedField"
									required
								/>
							</Grid>
							<Grid item xs={12} md={2}>
								<Grid container spacing={2} justifyContent="flex-end" alignItems="center">
									<Grid item>
										<Submit type={props.item ? "save" : "add"} />
									</Grid>
									<Grid item>
										<Button
											variant="outlined"
											color="default"
											onClick={props.onClear}
											text={t("clear")}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Form;
