import { Box, Grid } from "@material-ui/core";
import { IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect } from "react";
import { TextField } from "src/components/form";
import { LegalDocumentPrepositionLetterProcess } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";
import AddIcon from "@material-ui/icons/Add";
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
			observation: "",
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			setSubmitting(false)
			props.onAdd(values)
			resetForm()
		}
	})

	useEffect(() => {
		if (props.data) {
			formik.setValues(props.data)
		}
		
	}, [props.data])

	return (
		<FormikProvider value={formik}>
			<Form>
				<Box padding={3}>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.processNumber")}
								name="processNumber"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.vara")}
								name="legalCourt"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.comarca")}
								name="district"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:process.action")}
								name="actionType"
								required
							/>
						</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								label={t("legalDocs:process.observation")}
								name="observation"
								multiline
								rows={3}
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