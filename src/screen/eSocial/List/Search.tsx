import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import Panel from "src/components/Panel";
import { DateField, SelectField, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { useTranslation } from "src/locale/i18n";
import { getFiltersPayment } from "src/core/store/modules/inspection/selectors";
import { actions } from "src/core/store";
import { ESocial } from "src/core/models/eSocial";
import { fetchESocialEvent } from "src/core/store/modules/e-social-event/thunks";
import { useEffect } from "react";
import { getListESocialEvent } from "src/core/store/modules/e-social-event/selectors";
import { rejectNoValues } from "src/core/utils/func";
import { getListAsOptionPaymentType } from "src/core/store/modules/payment-type/selectors";
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { Modulos } from "src/core/models/modules";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";

const Search = ({ pathname }: { pathname: string }) => {
	
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const savedFilters = useSelector(getFiltersPayment);
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);


	const onSubmit = (values: any, { setSubmitting }: any) => {
		setSubmitting(true);

		dispatch(actions.eSocialEventLauch.setFilters({ ...values }));
		setSubmitting(false);
	};
	useEffect(() => {
		dispatch(fetchESocialEvent({notPaginate: true, status: true}))
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }))
		
	}, []);
	const listESocialEvent = useSelector(getListESocialEvent);
	const options = [
		{ value: ESocial.S2500, label: "S-2500" },
		{ value: ESocial.S2501, label: "S-2501" },
		{ value: ESocial.S3500, label: "S-3500" },
		// { value: ESocial.S5501, label: "S-5501" },
	]
	const codeSet = new Set(listESocialEvent?.map((item:any) => item.code));
	const filteredOptions = options.filter(option => codeSet.has(option.label));


	const initialValues = {
		accrualMonth: null,
		eventCode: "",
		folderNumber: "",
		eventLaunchStatus: "",
		status: "",
		nmTrab: "",
		paymentTypeId: "",
		dataSolicitacao: null,
		statusApprovalId: null,
		formaPagamentoId: null,
		...(savedFilters[pathname] ?? {}),
	} as any;

	return (
		<Panel title={t("inspection:resquest.filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<DateField
									name="accrualMonth"
									label={"Mês competência"}
									views={["year", "month"]}
									monthYear={true}
									format="MM-YYYY"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="eventCode"
									label={"Tipo Evento"}
									options={filteredOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField name="nmTrab" label={"Contribuinte"} />
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Tipo de pagamento"}
									name="paymentTypeId"
									options={paymentTypeOptions}
								/>
							</Grid>
							{/* <Grid item md={3} xs={12}>
								<TextField name="Contribuinte" label={"Contribuinte"} />
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField name="Empregador" label={"Empregador"} />
							</Grid> */}
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
										{ label: "Cancelado", value: 6 }
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
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean action="eSocialEventLauch" />
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit type="search" disabled={!dirty} />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
