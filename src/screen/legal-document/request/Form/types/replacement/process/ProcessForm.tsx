import { Box, Grid } from "@material-ui/core";
import { IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { TextField } from "src/components/form";
import { LegalDocumentPrepositionLetterProcess } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";
import AddIcon from "@material-ui/icons/Add";
import { useEffect } from "react";
import Clean from "src/components/button/Clean";

type ProcessFormProps = {
	onAdd: (data: LegalDocumentPrepositionLetterProcess) => void;
	data?: LegalDocumentPrepositionLetterProcess
}

const ProcessForm = (props: ProcessFormProps) => {
	const { t } = useTranslation()

	const formik = useFormik<LegalDocumentPrepositionLetterProcess>({
		initialValues: {
			district: "",
			actionType: "",
			legalCourt: "",
			processNumber: "",
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			setSubmitting(false)
			props.onAdd(values)
			resetForm()
		}
	})

	const { setValues } = formik

	useEffect(() => {
		if (props.data) {
			setValues(props.data)
		}
	}, [props.data, setValues])

	return (
		<FormikProvider value={formik}>
			<Form>
				<Box padding={3}>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.processNumber")}
								name="processNumber"
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.vara")}
								name="legalCourt"
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.comarca")}
								name="district"
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.action")}
								name="actionType"
							/>
						</Grid>
						<Grid item md={12} xs={12}>
							<Box display="flex" justifyContent="flex-end">
								<IconButton
									color="primary"
									type="submit"
								>
									<AddIcon />
								</IconButton>
							</Box>
						</Grid>
					</Grid>
					<Clean/>
				</Box>
			</Form>
		</FormikProvider>
	)
}

export default ProcessForm;