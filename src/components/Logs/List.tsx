import { useMemo } from "react";
import { Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import TableComponent, { ColumnData } from "src/components/Table";
import Accordion from "src/components/Accordion";
import { STATUSES_FLOW, TLogs } from "src/core/models";
import {
	statusTextApprovalsFlow,
	STATUS_APPROVALS_FLOW,
} from "src/core/utils/constants";
import { useTranslation } from "src/locale/i18n";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
	[-1]: {
		backgroundColor: "#BADEF6",
		color: "#004894",
	},
	0: {
		backgroundColor: "#FFEDB4",
		color: "#F04E23",
	},
	1: {
		backgroundColor: "#E8F6EA",
		color: "#1C6226",
	},
	2: {
		backgroundColor: "#F3E6F3",
		color: "#004894",
	},
	3: {
		backgroundColor: "#BADEF6",
		color: "#004894",
	},
	4: {
		backgroundColor: "#6FCF97",
		color: "#FFFFFF",
	},
	5: {
		backgroundColor: "#FDDFB4",
		color: "#DB5315",
	},
	6: {
		backgroundColor: "#BB6BD9",
		color: "#FFFFFF",
	},
	7: {
		backgroundColor: "#F2994A",
		color: "#FFFFFF",
	},
	8: {
		backgroundColor: "#e03c3c",
		color: "#FFFFFF",
	},
});

type Props = {
	items: TLogs[];
	statusOrder: ("flow" | "approvalCenter")[];
	statuses: { [key: number]: string };
	pensionLabel?: boolean;
};

const statusProp = {
	flow: "statusFlowId",
	approvalCenter: "statusApprovalId",
};

const ListLogs = ({ items, statuses, statusOrder, pensionLabel }: Props) => {
	const styles = useStyles() as { [key: string]: string };
	const { t } = useTranslation();
	const { pathname } = useLocation();

	const isRequest = pathname.includes("/pagamentos/solicitacao");
	const rows = useMemo(() => {
		let secondApproval = false;

		const propType1 = statusOrder[0];
		const propType2 = statusOrder[1];
		const prop1 = statusProp[propType1]; // statusFlowId
		const prop2 = statusProp[propType2]; // statusApprovalId
		const ifFlowFirst = statusOrder[0] === "flow";

		return items
			.map((item, i) => {
				/// DEFAULT
				let status: STATUSES_FLOW | STATUS_APPROVALS_FLOW = (item as any)[prop1];
				let statusText: string = ifFlowFirst
					? statuses[status]
					: (statusTextApprovalsFlow as any)[status];
				let className = styles[status];

				/// SECOND APPROVAL
				if (secondApproval) {
					status = (item as any)[prop2];
					statusText = ifFlowFirst
						? ((item as any)[prop1] === 5 && (item as any)[prop2] === 8 && isRequest ? 'Cancelado ' : (statusTextApprovalsFlow as any)[status])
						: statuses[status];
				} else if (
					(item as any)[prop1] === 1 &&
					propType2 &&
					(items as any)[i + 1] &&
					(items as any)[i + 1][prop2] !== -1
				) {
					secondApproval = true;
				}

				/// EXCEPTIONS
				if ((item as any)[prop1] === 3 && (item as any)[prop2] === -1) {
					statusText = "Solicitado";
				}
				if ((item as any)[prop1] === 4 && (item as any)[prop2] === -1) {
					statusText = "Validado Controles Jurídicos";
				}
				if ((item as any)[prop1] === 1 && (item as any)[prop2] === -1) {
					statusText = "Aprovado Advogado Interno";
				}
				if ((item as any)[prop1] === 1 && (item as any)[prop2] === 1) {
					statusText = pensionLabel === true ? "Aprovado Gestor Jurídico" : "Aprovado";
				}
				if ((item as any)[prop1] === 1 && (item as any)[prop2] === 0) {
					className = styles[8];
					statusText = "Reprovado pela central";
				}
				if ((item as any)[prop2] === 8) {
					className = styles[0];
				}
				if(item.logDataFromId === 1 && item.statusApprovalId === -1 && item.statusFlowId === 11){
					statusText = "Estornado"
					className = styles[3]
				}
				if(item.logDataFromId === 1 && item.statusApprovalId === 1 && item.statusFlowId === 27){
					statusText = "Reclassificação"
					className = styles[3]
				}
				if(item.logDataFromId === 1 && item.statusApprovalId === 0 && item.statusFlowId === 11){
					statusText = "Reprovado"
					className = styles[8]
				}
				if(item.logDataFromId === 1 && item.statusApprovalId === 1 && item.statusFlowId === 11){
					statusText = "Aprovado"
					className = styles[1]
				}
				if(item.logDataFromId === 70 && item.statusApprovalId === -1 &&  (item.statusFlowId === 3 || item.statusFlowId === 7 || item.statusFlowId === 10)){
					statusText = "Criado"
					className = styles[4]
				}
				if(item.logDataFromId === 70 && item.statusApprovalId === -1 && item.statusFlowId === 1){
					statusText = "Pendente Escritório"
					className = styles[3]
				}
				if(item.logDataFromId === 71 && item.statusApprovalId === -1 && item.statusFlowId === 1){
					statusText = "Validado pelo Escritório"
					className = styles[5]
				}
				if(item.logDataFromId === 71 && item.statusApprovalId === -1 && item.statusFlowId === 0){
					statusText = "Alterado pelo Escritório"
					className = styles[6]
				}
				if(item.logDataFromId === 72 && item.statusApprovalId === -1 && item.statusFlowId === 2){
					statusText = "Devolvido pelo Jurídico"
					className = styles[7]
				}if(item.logDataFromId === 72 && item.statusApprovalId === -1 && item.statusFlowId === 1){
					statusText = "Conciliado pelo Jurídico"
					className = styles[8]
				}
				if (item.logDataFromId === 2) {
					if (item.statusApprovalId === -1) {
						switch (item.statusFlowId) {
							case 1:
								statusText = "Aprovado Advogado Interno";
							break;
							case 3:
								statusText = "Adição de registro";
							break;
							case 4:
								statusText = "Validade Controle Jurídico";
							break;
							default:
						}
					}
					if (item.statusApprovalId === 1) {
						switch (item.statusFlowId) {
							case -1:
								statusText = "Aprovado";
							break;
							case 1:
								statusText = "Minuta final aprovada";
							break;
							case 3:
								statusText = "Minuta solicitada";
							break;
							case 4:
								statusText = "Minuta disponibilizada";
							break;
							case 5:
								statusText = "Aguardando minuta final";
							break;
							case 7:
								statusText = "Minuta final em análise";
							break;
							default:
						}
					}
				} 
				if (item.logDataFromId === 4) {
					if ((item.statusFlowId === 1 || item.statusFlowId === 3) && item.statusApprovalId === 1) {
						statusText = "Aprovado";
						className = styles[1];
					}
					if ((item.statusFlowId === 1 || item.statusFlowId === 3) && item.statusApprovalId === 0) {
						statusText = "Reprovado";
						className = styles[0];
					}
					if (item.statusFlowId === 27  && item.statusApprovalId === 1) {
						statusText = "Reclassificação";
						className = styles[3]
					}
					if (item.statusFlowId === -1  && item.statusApprovalId === 1) {
						statusText = "Aprovado";
						className = styles[1]
					}
				} 
				if (item.logDataFromId === 11) {
					if (item.statusApprovalId === 0) {
						statusText = "Reprovado";
						className = styles[0];
					}
					if (item.statusApprovalId === 1) {
						statusText = "Aprovado";
						className = styles[4];
					}
				}
				if (item.logDataFromId === 19) {
					if ((item.statusFlowId === 10 || item.statusFlowId === 11) && item.statusApprovalId === 1) {
						statusText = "Aprovado";
						className = styles[1];
					}
					if ((item.statusFlowId === 10 || item.statusFlowId === 11) && item.statusApprovalId === 0) {
						statusText = "Reprovado";
					}
				}
				if (item.statusFlowId === 21) {
					statusText = "Anexo";
					className = styles[0];
				}
				if (item.statusFlowId === 22) {
					className = styles[1];
					statusText = "Comprovante Disponibilizado";
				}

				return {
					...item,
					observation: (
						<div className="tablecell-observation-log">{item.observation}</div>
					),
					status: <Chip label={statusText} className={className} />,
				};
			})
			.sort(
				(item1, item2) =>
					new Date(item1.occurrenceDate).getTime() -
					new Date(item2.occurrenceDate).getTime()
			)
			.reverse();
		
	}, [items, styles, statusOrder, statuses]);

	const columns: ColumnData[] = [
		{ label: t("userName"), field: "userName" },
		{
			label: t("Pagamentos:logs.date"),
			field: "occurrenceDate",
			type: "dateHour",
		},
		{ label: t("status"), field: "status" },
		{ label: t("Pagamentos:logs.obs"), field: "observation" },
	];

	return !items.length ? null : (
		<div className="margin-top-16 form-accordion">
			<Accordion title={t("Pagamentos:logs.titleList")}>
				<TableComponent columns={columns} rows={rows} />
			</Accordion>
		</div>
	);
};

export default ListLogs;
