import { useState, useEffect, useCallback } from "react";
import paymentMethodAPI from "src/core/api/payment";
import AccountabilityModal from "src/components/AccountabilityModal";
import { TpaymentOrders } from "src/core/models/provision-order";
import TableComponent, { ColumnData } from "src/components/Table";
import paymentTypeAPI from "src/core/api/payment-type";
import AccordionPanel from "src/components/AccordionPanel";
import { STATUS_APPROVALS_FLOW, statusTextApprovalsFlow, } from "src/core/utils/constants";

type Props = {
	folderNumber: string;
	handleSubmitModal?: (accountabilityOrders: TpaymentOrders[]) => void;
	paymentTypeId?: number | "";
	paymentMethodId?: number | "";
	isEditable?: boolean;
	form?: any
	isSpecialSetFormValues?: boolean
	dictionary?: any
};

const paymentPendingCollumns: ColumnData[] = [
	{ label: "Numero da solicitação", field: "id" },
	{ label: "Data da Solicitação", field: "dataSolicitacao", type: "date" },
	{ label: "Status", field: "statusApprovalId" },
	{ label: "Tipo de pagamento", field: "paymendKind" },
	{
		label: "Valor Pagamento Judicial",
		field: "valorPagamentoJudicial",
		type: "currency",
	},
];

const AccountabilityModalPayment = ({
	folderNumber,
	handleSubmitModal,
	paymentTypeId,
	paymentMethodId,
	isEditable,
	form,
	isSpecialSetFormValues,
	dictionary
}: Props) => {
	const [paymentList, setPaymentList] = useState<[]>([]);

	const showProvisionModal = useCallback(async () => {
		const { data: paymentsData } = await paymentMethodAPI.list({
			folderNumber,
			paymentTypeId,
			page: 1,
			pageSize: 20,
			paymentMethodId,
		});

		const { data: dataPaymentType } = await paymentTypeAPI.list({
			modulo: 6,
			notPaginate: true,
		});

		setPaymentList(
			paymentsData?.items?.map(({statusApprovalId, statusFlowId, ...item}: any) => {
				let status = "";
					statusApprovalId === 8
						? (status = statusTextApprovalsFlow[8])
						: (status = statusTextApprovalsFlow[statusFlowId]);

					// gambiarra filtro status pagamento. task 93850
					// requer refactore back e front no futuro
					if (
						statusFlowId ===
						STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
						statusApprovalId === STATUS_APPROVALS_FLOW.NONE
					)
						status = "Aprovado Advogado Interno";

					if (
						statusFlowId ===
						STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
						statusApprovalId ===
						STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
					)
						status = "Aprovado";

					if (
						statusFlowId ===
						STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE &&
						statusApprovalId ===
						STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
					)
						status = "Reprovado"
				return {
					...item,
					paymendKind: dataPaymentType.items.find(
						(payType: any) => payType.id === item.tipoPagamentoId
					)?.financeChartOfAccountsCategory?.name,
					statusApprovalId: status,
				}
			}) ?? []
		);
	}, [folderNumber, paymentMethodId, paymentTypeId]);

	useEffect(() => {
		showProvisionModal();
	}, [showProvisionModal]);
	
	const fitredPaymentList = paymentList.filter(
		({statusApprovalId }) => statusApprovalId !== "Aprovado" && statusApprovalId !== "Reprovado"
	);

	return (
		<>
		{
			<AccordionPanel title={"Pedidos de provisão"}>
				<AccordionPanel title={"Listagem de Pagamento Pendente de Aprovação"}>
					<TableComponent columns={paymentPendingCollumns} rows={fitredPaymentList} />
				</AccordionPanel>
				<AccountabilityModal
					folderNumber={folderNumber}
					handleSubmitModal={handleSubmitModal}
					isEditable={isEditable ?? false}
					form={form}
					isSpecialSetFormValues={isSpecialSetFormValues}
					dictionary={dictionary}
				/>
			</AccordionPanel>
		}	
		</>
	);
};

export default AccountabilityModalPayment;

