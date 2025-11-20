import { Grid } from "@material-ui/core";
import { TPaymentFormDefault } from "src/core/models/payment";
import { TextField, CurrencyField, DateField } from "src/components/form";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { useTranslation } from "src/locale/i18n";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import moment from "moment";
import { sum } from "src/core/utils/calc";
import useFinancialTerm from "../../common/useFinancialTerm";
import InternalLawyerField from "../../common/InternalLawyerField";
import StatusFlow from "../../common/StatusFlow";

import {HandleOnBlurProvision} from "src/screen/payment/request/Form/common/handleOnBlurProvision"
import { useSelector } from "react-redux";
import { usePaymentType } from "src/hooks/fetchLists";
import { getPaymentSearch } from "src/core/store/modules/payment/selectors";
import { Modulos } from "src/core/models/modules";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";

type DefaultDataProps = {
	editable?: boolean;
};

const DefaultData = (props: DefaultDataProps) => {
	const { t } = useTranslation();
	const showInfoMessage = useFinancialTerm();
	const { values, setFieldValue } = useFormikContext<TPaymentFormDefault>();
	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const { paymentType } = usePaymentType(Modulos.Pagamento);
	const dejurAreaName = useSelector(getListESocialAreas);

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	const { handleOnBlur } = HandleOnBlurProvision();

	const isRequired = dejurAreaName?.length === 0;

	const {
		valorPrincipal,
		valorMulta,
		valorJuros,
		encargo,
		sucumbencia,
		valorJurosHistorico,
	} = values;

	useEffect(() => {
		setFieldValue(
			"valorPagamentoJudicial",
			sum([
				valorPrincipal,
				valorMulta,
				valorJuros,
				encargo,
				sucumbencia,
				valorJurosHistorico,
			])
		);
	}, [
		setFieldValue,
		valorPrincipal,
		valorMulta,
		valorJuros,
		encargo,
		sucumbencia,
		valorJurosHistorico,
	]);

	return (

		tipoPagamento?.retificacaoESocial === true ? null : 

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
						name="dataCienciaDecisao"
						label={t("solicitacaoPagamento:dadosPagamento.dataCienciaDecisao")}
						readOnly={!props.editable}
						required={!isRequired}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						name="safeDate"
						label={t("goodsAndGuarantees:form.safeDate")}
						readOnly={!props.editable}
						required={!isRequired}

					/>
				</Grid><Grid item md={3} xs={12}>
					<DateField
						name="finalDate"
						label={t("goodsAndGuarantees:form.finalDate")}
						readOnly={!props.editable}
						required={!isRequired}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						required
						name="dataPagamento"
						label={t("solicitacaoPagamento:dadosPagamento.dataPagamento")}
						minDate={moment()}
						onChange={showInfoMessage}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name="valorPrincipal"
						label={t("solicitacaoPagamento:dadosPagamento.valorPrincipal")}
						min={0.01}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 1)}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="valorMulta"
						label={t("solicitacaoPagamento:dadosPagamento.valorMulta")}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 2)}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="valorJurosHistorico"
						label={t("solicitacaoPagamento:dadosPagamento.valorJurosHistorico")}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 3)}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="encargo"
						label={t("solicitacaoPagamento:dadosPagamento.encargos")}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 4)}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="sucumbencia"
						label={t("solicitacaoPagamento:dadosPagamento.sucumbencia")}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 5)}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t(
							"solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial"
						)}
						value={values.valorPagamentoJudicial}
						type="currency"
						testid="pagamento-valorPagamentoJudicial"
					/>
				</Grid>
				<InternalLawyerField 
					readonly={!props.editable}
				/>
				{ !props.editable && 
					<StatusFlow />
        }
				<Grid item md={6} xs={12}>
					<TextField
						name="observacao"
						label={t("solicitacaoPagamento:dadosPagamento.observacoes")}
						size="medium"
						readOnly={!props.editable}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default DefaultData;
