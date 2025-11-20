import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { Formik } from "formik";

import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";
import { AppDispatch } from "src/core/store";
import { Box, Grid } from "@material-ui/core";
import { DateField, NumericField, SelectField, TextField, UserField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { fetchLogDataFromReport, getReport } from "src/core/store/modules/request-log/thunk";
import UserFieldMultiple from "src/components/form/UserFieldMultiple";
import { useSnackbar } from "notistack";
import FoldersMultipleItems from "src/screen/Integrations/components/FoldersMultipleItems";


const LogsReport = () => {

	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const [logDataAsOptions, setLogDataAsOptions] = useState<any[]>([]);
	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = useCallback(
		async (values: any, { setSubmitting }) => {

			const valuesToSend = {
				...values,
				requestIds: values?.requestIds.length > 0 ? [Number(values?.requestIds)] : null
			}

			const { meta } = await dispatch(getReport(valuesToSend)) as any;

			if (meta?.requestStatus === "fulfilled") {
				enqueueSnackbar(`Relatorio gerado com sucesso!`,
				{ variant: "success" })
				window.open("/relatorios/gerados", "_blank")?.focus();
			}
		},

		[dispatch]
	);

	const initialValues: any = useMemo(
		() => ({
			folderNumbers: [],
			logDataFromIds: [],
			requestIds: "",
			occurrenceDateStart: null,
			occurrenceDateEnd: null,
			userIds: []
		}),
		[]
	);

	const getLogDataOptions = async () => {
		const {payload} = await dispatch(fetchLogDataFromReport()) as any;
		setLogDataAsOptions(payload.map((item: { description: string; id: number; }) => ({ label: item.description, value: item.id })))
	}

	useEffect(() => {
		getLogDataOptions();
	}, [])

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						<Panel title={"Logs"} withPadding>
						<Grid container spacing={3}>
							<FoldersMultipleItems />
							<Grid item md={3} xs={12}>
								<SelectField
										label="Módulo"
										options={logDataAsOptions} 
										name="logDataFromIds"
										multiple								
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<NumericField
									name='requestIds'
									label={"Solicitação"}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<UserFieldMultiple
									label={"Usuários"}
									name='userIds'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
										<DateField
										label={"Data da ocorrência (de)"}
										name="occurrenceDateStart"
										/>
								</Grid>
								<Grid item md={3} xs={12}>
										<DateField
										label={t("reports:common.form.until")}
										name="occurrenceDateEnd"
										/>
								</Grid>
							</Grid>
						</Panel>
						<Box
							display="flex"
							justifyContent="flex-end"
							alignItems="center"
							mt={2}
						>
							<Clean/>
							<Submit
								style={{ marginLeft: "30px" }}
								text={"Gerar relatório"}
								submitting={isSubmitting}
							/>
						</Box>
					</form>
				)}
			</Formik>
		</ScreenTemplate>		
	);
};

export default LogsReport;
