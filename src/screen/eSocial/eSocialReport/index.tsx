import Panel from "src/components/Panel";
import { Formik } from 'formik';
import { Grid, Box } from '@material-ui/core';
import { DateField, SelectField, TextField} from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import { exportRequestReportESocialExcelFile } from "src/core/store/modules/report/thunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import { ESocial } from "src/core/models/eSocial";
import { getListAsOptionPaymentType } from "src/core/store/modules/payment-type/selectors";
import { useCustomFieldModal } from 'src/screen/reports/hooks/useModal';
import { useEffect, useState } from "react";
import { useReport } from 'src/screen/reports/hooks/useReport';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { Modulos } from 'src/core/models/modules';
import { TReportComponent } from 'src/core/models/reports';
import CustomFieldsButton from 'src/screen/reports/components/CustomFieldsButton';

const EsocialReport= () => {

	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const { showModal } = useCustomFieldModal();
	const [eventCode, setEventCode] = useState<number | null>(null)

	const initialValues: any = {
		eventCode: null,
		nmTrab: "",
		paymentTypeIds: [],
		folderNumber: "",
		eventLaunchStatus: null,
		paymentId: null,
		pointId: "",
		dtSentStart: null,
		dtSentEnd: null
	};

	const onSubmit = async (values: any) => {

		const customFieldsArray = customFields?.map((x) => x.fieldName)
		const { meta } = await dispatch(exportRequestReportESocialExcelFile({...values, customFields: customFieldsArray })) as any;
	
		if (meta?.requestStatus === "fulfilled") {
			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			window.open("/relatorios/gerados", "_blank")?.focus();
		} 
	};

	const {
		customFields,
		setCustomFields,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: (eventCode === null || eventCode === 1) ? TReportComponent.S2500 : TReportComponent.S2501, getReportConfiguration: true })

	const openCustomFieldModal = () => {
		showModal({
			filterTypeName: "Filtro Principal",
			onSubmitModal: setCustomFields,
			options: customFieldsDictionary,
			customFields: customFields
		})
	}

	useEffect(()=> {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento, notPaginate: true }));
	}, [dispatch])
	
	return (
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, values}) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={"Filtros do eSocial"} withPadding>
						<Grid container spacing={2}>
							{setEventCode(values.eventCode)}
								<Grid item xs={12} md={3}>
									<DateField
										name="dtSentStart"
										label={"Mês competência (de)"}
										views={["year", "month"]}
										monthYear={true}
										format="MM-YYYY"
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<DateField
										name="dtSentEnd"
										label={"Até"}
										views={["year", "month"]}
										monthYear={true}
										format="MM-YYYY"
										/>
								</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="eventCode"
									label={"Tipo Evento"}
									options={[
										{ value: ESocial.S2500, label: "S-2500" },
										{ value: ESocial.S2501, label: "S-2501" },
									]}
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField name="nmTrab" label={"Contribuinte"} />
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Tipo de pagamento"}
									name="paymentTypeIds"
									options={paymentTypeOptions}
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField name="folderNumber" label={"Pasta/CTG"} />
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="eventLaunchStatus"
									label={"Status"}
									options={[
										{ label: "Pendente", value: 1 },
										{ label: "Enviado SAP", value: 2 },
										{ label: "Erro validador", value: 3 },
										{ label: "Processado", value: 4 },
										{ label: "Excluído", value: 5 },
									]}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									type="number"
									name="paymentId"
									label="Id de pagamento"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									type="text"
									name="pointId"
									label="Matrícula"
								/>
							</Grid>
							
						</Grid>
						<Grid item xs={3} md={12}>
									<CustomFieldsButton 
										marginTop={0} 
										onClick={openCustomFieldModal}
									/>
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
	);
};

export default EsocialReport;