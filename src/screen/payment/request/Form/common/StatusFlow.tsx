import { Grid } from "@material-ui/core";
import { useMemo } from "react";
import { SelectField } from "src/components/form";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { textToOptions } from "src/core/utils/func";
import { useTranslation } from "src/locale/i18n";
import { useLocation } from "react-router-dom";

const StatusFlow = () => {
	const { t } = useTranslation()
	const { pathname } = useLocation();

	const isApprovalLegalControl = pathname.startsWith(
		"/pagamentos/aprovacao-controle-juridico"
	);
	
	const statusTextApprovalsFlow = useMemo(() => {
		let statusApprovalsFlow = {
			[STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE]: "Reprovado",
			[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE]: "Aprovado",
			[STATUS_APPROVALS_FLOW.RETURNED]: "Devolvido",
			[STATUS_APPROVALS_FLOW.REQUESTED]: "Solicitado",
			[STATUS_APPROVALS_FLOW.APPROVED]: "Validado Controles Jurídicos",
			[STATUS_APPROVALS_FLOW.CANCELLED]: "Cancelado",
			[STATUS_APPROVALS_FLOW.CONTABILIZATION_ERROR]: "Erro na contabilização",
			[STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE]: "Comprovante Disponibilizado"
		} as any
		if (isApprovalLegalControl) {
			statusApprovalsFlow = {
				[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE]: "Aprovado",
				[STATUS_APPROVALS_FLOW.CANCELLED]: "Cancelado",
				[STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE]: "Comprovante Disponibilizado",
			}
		}
		return textToOptions(statusApprovalsFlow)
	}, [isApprovalLegalControl])

	return (
		<Grid item md={3} xs={12}>
			<SelectField
				label={t("Pagamentos:tipoPagamentoForm.status")}
				name="newStatusFlowId"
				options={statusTextApprovalsFlow}
				readOnly={false}
			/>
		</Grid>
	);
};

export default StatusFlow;
