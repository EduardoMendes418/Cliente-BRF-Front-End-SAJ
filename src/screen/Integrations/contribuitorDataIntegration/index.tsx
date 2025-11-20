import { useDispatch } from "react-redux";
import { Formik } from "formik";
import ScreenTemplate from "src/components/Screen";
import { TIntegrationContribuitorData } from "src/core/models/integrations";
import { useCallback } from "react";
import { t } from "src/locale/i18n";
import Panel from "src/components/Panel";
import { Box, Grid } from "@material-ui/core";
import FoldersMultipleItems from "../components/FoldersMultipleItems";
import { CPFOrCNPJField, NumericField } from "src/components/form";

import { Submit } from "src/components/button";
import { integrateEmployeeData } from "src/core/store/modules/integrations/thunks";

import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";


const ContribuitorDataIntegration = () => {

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues: TIntegrationContribuitorData = {
		folderNumbers: [],
		cpf: "",
		id: ""
	};

	const submitHandler = useCallback(
		async (values: TIntegrationContribuitorData) => {
			const { meta, payload} = await dispatch(integrateEmployeeData(values)) as any;

			if(payload?.data?.length !== 0){
				return enqueueSnackbar(`${payload?.data[0]}`, {
					variant: "error",
				});
			}

			if(meta?.requestStatus === 'fulfilled'){
				history.push('/carga-de-dados/monitor-de-execucao');
				return enqueueSnackbar("Integração solicitada com sucesso", {
					variant: "success",
				});
			}
		},
		[dispatch]
	);

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={submitHandler}
				enableReinitialize
			>
				{({ handleSubmit, isValid, dirty, isSubmitting }) => (
					<form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Panel title={t("integrations:request.pageName")} withPadding>
						<Grid container spacing={3}>
							<FoldersMultipleItems /> 
						<Grid item xs={12} md={3}>
							<CPFOrCNPJField 
								label={t("integrations:request.form.cpf")}
								name="cpf"
								type="cpf"
								required
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<NumericField
									name="id"
									label={"Id"}
								/>
						</Grid>
						</Grid>
						<Box display="flex" justifyContent="flex-end" mt={3}>			
								<Submit
									submitting={isSubmitting}
									disabled={!isValid || !dirty}
									text={t("integrations:request.form.submitButton")}
								/>
							</Box>
						</Panel>
					</form>
				)}	
				</Formik>
				</ScreenTemplate>
	)
}

export default ContribuitorDataIntegration