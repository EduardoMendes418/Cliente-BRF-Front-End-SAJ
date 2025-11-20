import moment from "moment";
import { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";

import {
	TextField,
	CurrencyField,
	DateField,
	CostCenterField,
	ContactsAutocompleteFieldUnifier,
	SelectField,
	ContactsAutocompleteField,
} from "src/components/form";
import Panel from "src/components/Panel";
import { sum } from "src/core/utils/calc";
import { useTranslation } from "src/locale/i18n";
import { TContact } from "src/core/models/contacts";
import FieldColumn from "src/components/FieldColumn";
import { TPaymentFormDefault } from "src/core/models/payment";
import useFinancialTerm from "src/screen/payment/request/Form/common/useFinancialTerm";
import { useDispatch } from "react-redux";
import { actions } from "src/core/store";

const approvalFlowOptions = [
	{
		value: 1,
		label: "Barreiras Fiscais",
	},
	{
		value: 2,
		label: "Fiscalização e Suporte",
	},
	{
		value: 3,
		label: "Regularidade tributária",
	}
];

type Props = {
	submitWithoutFolder: any
};

const DefaultData = (props: Props) => {
	const { t } = useTranslation();
	const showInfoMessage = useFinancialTerm();
	const { values, setFieldValue } = useFormikContext<TPaymentFormDefault>();
    const dispatch = useDispatch();

	const onSelectContact = (contact: TContact) => {
		setFieldValue("advogadoInterno", contact.name);
		setFieldValue("advogadoInternoId", contact.id);
	};

	useEffect(() => {
        const totalGuia = values?.valorTotalGuia !== undefined ? values?.valorTotalGuia?.toString()?.slice(2) : 0;
        dispatch(actions.inspection.setValorTotalGuia(totalGuia)) 
	}, [values.valorTotalGuia])

	return (
		<Panel title="Dados do pagamento" withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("solicitacaoPagamento:dadosPagamento.dataSolicitacao")}
						value={values.dataSolicitacao}
						type="date"
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						required
						name="dataPagamento"
						label={t("solicitacaoPagamento:dadosPagamento.dataPagamento")}
						minDate={moment()}
						onChange={showInfoMessage}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						label={"Competência"}
						name="competencia"
						views={['year', 'month']}
						format="MM-YYYY"
					/>
				</Grid>
				<Grid item md={3} xs={12}>
				<TextField
						name="numberServiceNow"
						label={t("solicitacaoPagamento:dadosPagamento.numberServiceNow")}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				{
					props.submitWithoutFolder === true ? 
					<Grid item md={3} xs={12}>
						<ContactsAutocompleteField
							filter="fragment"
							name="advogadoInternoId"
							label={t("solicitacaoPagamento:dadosPagamento.internalLawyerSearch")}
							onSelectContact={onSelectContact}
							showSelectedName
					/> 
					</Grid> : 
						<ContactsAutocompleteFieldUnifier
							filter="fragment"
							name="advogadoInternoId"
							label={t("inspection:form.dadosPagamento.advogadoInternoId")}
							mainName="advogadoInterno"
							mainLabel={t("solicitacaoPagamento:dadosPagamento.internalLawyerSearch")}
							onSelectContact={onSelectContact}
							popoverDisabled
						>
					<Grid item md={3} xs={12}>
						<FieldColumn
							label={t("inspection:form.dadosPagamento.advogadoInterno")}
							value={values.advogadoInterno}
						/>
					</Grid>
					</ContactsAutocompleteFieldUnifier> 
				}
				<Grid item md={3} xs={12}>
					<SelectField
						required
						name="fluxoAprovacao"
						label={t("solicitacaoPagamento:dadosPagamento.fluxoAprovacao")}
						options={approvalFlowOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					{/** TRATAR TO NUMBER AO ENVIAR - DEVE SER DECIMAL */}
					<CurrencyField
							label={t("inspection:resquest.valorTotalGuia")}
							name="valorTotalGuia"
							required
					/>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item md={12} xs={12}>
					<TextField
						name="observacao"
						label={t("solicitacaoPagamento:dadosPagamento.observacoes")}
						multiline
						rows={4}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default DefaultData;
