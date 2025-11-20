import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { useTranslation } from "src/locale/i18n";
import { getListCreditReceipt } from "src/core/store/modules/credit-receipt/selectors";
import { useCurrentUser } from "src/config/permissions";
import { getOptionsAsObject } from "src/core/utils/func";
import { getListAsOptionPaymentTypeAllStatus } from "src/core/store/modules/payment-type/selectors";
import { TCreditReceipt } from 'src/core/models/credit-receipt';
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import { IconButton } from "@material-ui/core";
import BackspaceIcon from 'src/components/icons/svg/iconReturned';
import {
	getCreditReceipt,
} from "src/core/store/modules/guarantee-accountability/selectors";
import {
	RETURNED_STATUS,
	statusText,
	STATUS_CREDIT_RECEIPT,
} from "../constants";
import {
	addCreditReceipt,
	removeCreditReceipt,
} from "src/core/store/modules/guarantee-accountability";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"20": "",
};

const List = ({
	loading,
	isRequest,
	pathname,
}: {
	loading: boolean;
	isRequest: boolean;
	pathname: string;
}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const history = useHistory();

	const items = useSelector(getListCreditReceipt);
	const creditReceipt = useSelector(getCreditReceipt);

	const isEvaluation = pathname.includes("avaliacao");

	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentTypeAllStatus);

	const { currentScreenPermissions } = useCurrentUser("");

	const paymentTypeAsObject = useMemo(
		() => getOptionsAsObject(paymentTypeAsOptions),
		[paymentTypeAsOptions]
	);

	const rows = useMemo(
		() =>
			items.map((item) => {
				const userCanEdit =
					currentScreenPermissions.edit &&
					item.statusApprovalId !== -1 &&
					((isRequest && RETURNED_STATUS.includes(item.statusFlowId)) ||
						(!isRequest &&
							![...RETURNED_STATUS, STATUS_CREDIT_RECEIPT.REJECTED, STATUS_CREDIT_RECEIPT.REVERSED, STATUS_CREDIT_RECEIPT.DEAD].includes(
								item.statusFlowId
							)));

				return {
					...item,
					status: statusText[item.statusFlowId],
					paymentType: (paymentTypeAsObject as any)[item.paymentTypeId] ?? "",
					statusTextApproval:
						(statusTextApprovals as any)[item.statusApprovalId ?? "10"] ?? "",
					isEditButtonHidden: !userCanEdit,
					isViewButtonHidden: userCanEdit,
					sapReleaseDate: item.sapResponses && item.sapResponses.length > 0 
						? item.sapResponses?.[0].releaseDate
						: "-"
				};
			}),
		[items, currentScreenPermissions, isRequest, paymentTypeAsObject]
	);
	const columns: ColumnData[] = [
		{
			label: "Estorno",
			field: "",
			type: "custom",
			component: ({statusFlowId, statusApprovalId, id, idLinkForAccounting, parentCreditReceiptsId}: any) => {
				if (statusFlowId === STATUS_CREDIT_RECEIPT.DEAD && statusApprovalId === 1 && parentCreditReceiptsId === null)
				return (
					<IconButton
						
						onClick={() => history.push(!idLinkForAccounting ?`/recebimento-credito/avaliacao/${id};estorno` : `/recebimento-credito/avaliacao/multipla;${idLinkForAccounting}`)}
					>
						<BackspaceIcon />
					</IconButton>
				);
			},
		},
		{ label: t("creditReceipt:list.requestNumber"), field: "id" },
		{ label: t("goodsAndGuarantees:accountability.parentAccountabilityId"), field: "parentCreditReceiptsId"},
		{ label: t("form.CTGFolder"), field: "folderNumber" },
		{
			label: t("creditReceipt:form.requestDate"),
			field: "requestDate",
			type: "date",
		},
		{ label: t("creditReceipt:form.paymentType"), field: "paymentType" },
		{
			label: t("creditReceipt:form.value"),
			field: "creditValue",
			type: "currency",
		},
		{ label: t("status"), field: "status" },
		{ label: "Status da contabilização", field: "statusTextApproval" },
		{ 
			label: t("creditReceipt:list.evaluatorDateStart"), 
			field: "evaluatorDate",
			type: "dateHour"
		},
		{ 
			label: t("creditReceipt:list.sapRequestDateStart"), 
			field: "sapReleaseDate",
			type: "date"
		},
	];

	const handleAction = ({ id }: any) => {
		history.push(`${pathname}/${id}`);
	};
	const ids = useMemo(
		() => creditReceipt.map(({ id }) => id),
		[creditReceipt]
	);
	if (isEvaluation) {
		columns.unshift({
			label: "Marcar avaliação",
			field: "action",
			component: (row: TCreditReceipt, index: number) => {
				if (row.status !== "Pendente") return null
				return (
					<>
						<Checkbox
							color="primary"
							icon={icon}
							checkedIcon={checkedIcon}
							checked={ids.findIndex((id) => id === row.id) !== -1}
							size="small"
							onClick={() => {
								const index = ids.findIndex((id) => id === row.id);
								if (index === -1) dispatch(addCreditReceipt(row));
								else dispatch(removeCreditReceipt(index));
							}}
						/>
					</>
				);
			},
			type: "custom",
		});
	}

	return (
		<>
			<Panel title={t("creditReceipt:list.title")}>
				<TableComponent
					rows={rows}
					columns={columns}
					isLoading={loading}
					onVisualize={handleAction}
					onEdit={handleAction}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;

