import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import BackspaceIcon, {
	LogoIconRed,
} from "src/components/icons/svg/iconReturned";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { useTranslation } from "src/locale/i18n";
import {
	getListGuaranteeAccountability,
	getAccountabilityArray,
} from "src/core/store/modules/guarantee-accountability/selectors";
import {
	addAccontabilityArray,
	removeAccontabilityArray,
} from "src/core/store/modules/guarantee-accountability";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";

import {
	TYPE_FLOW,
	bearishReasonsOptionsList,
	requestTypesOptionsAll,
} from "../../constants";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import {
	accountabilityStatusOptionsAsObject,
	situationStatusOptionsAsObject,
} from "../../accountability/constants";
import { IconButton } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { getDataCurrentUser, getPermissionsCurrentUser } from "src/core/store/modules/currentUser/selectors";
import useFormPermission from "../hooks/useFormPermissions";
import { useSnackbar } from "notistack";
import { guaranteeAccountabilityFiles } from "src/core/store/modules/guarantee-accountability/thunks";
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import { confirm } from "src/components/modals";
import { costCenterReclassificationAccountability } from "src/core/store/modules/accountability/thunks";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"8": "Erro na contabilização",
	"20": "",
};
const AccountabilityList = ({ loading }: { loading: boolean }) => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const {
		location: { pathname },
		...history
	} = useHistory();
	const isEvaluation = pathname.includes("prestacao-de-contas-avaliacao");

	const permissions = useSelector(getPermissionsCurrentUser);
	const permition = permissions.find(
		({ name }) => name === "bens-e-garantias/prestacao-de-contas-avaliacao"
	);
	const { guaranteeModality } = useGuaranteeModality();
	const { canEdit } = useFormPermission();
	const { isAdmin } = useSelector(getDataCurrentUser);

	const list = useSelector(getListGuaranteeAccountability);
	const accontabilityArray = useSelector(getAccountabilityArray);
	const rows = useMemo(
		() =>
			list.map(
				({
					id,
					goodsGuaranteesRequest,
					folderNumber,
					statusFlowId,
					totalAmountWrittenOff,
					status,
					statusApprovalId,
					bearishReasons,
					accountabilityDate,
					goodsGuaranteesRequestId,
					guaranteeModeId,
					requestTypeId,
					guaranteeDate,
					...item
				}) => {
					
					const { description, typeFlow } =
						guaranteeModality.find(({ id }) => id === guaranteeModeId) ??
						{};

					const accountabilyStatusText =
						accountabilityStatusOptionsAsObject[statusFlowId];
					const situationText = situationStatusOptionsAsObject[status];
					const isEditButtonVisible =
						canEdit(
							statusFlowId,
							status,
							typeFlow !== TYPE_FLOW.JUDICIAL_DEPOSIT
						) && statusFlowId !== 1;

					return {
						...item,
						id,
						guaranteeDate,
						folderNumber,
						accountabilityStatusToShow: accountabilyStatusText,
						situationToShow: situationText,
						amountWrittenOff: totalAmountWrittenOff,
						isViewButtonHidden: isEditButtonVisible,
						isEditButtonHidden: !isEditButtonVisible,
						guaranteeModality: description,
						statusApprovalId: statusApprovalId,
						status: status,
						statusTextApproval:
							(statusTextApprovals as any)[statusApprovalId ?? "10"] ?? "",
						bearishReasonsText:
							bearishReasonsOptionsList.find(
								(item) => item.value === bearishReasons
							)?.label ?? "",
						bearishReasons,
						statusFlowId: statusFlowId,
						accountabilityDate,
						totalAmountWrittenOff,
						requestTypeId,
						typeFlow,
						goodsGuaranteesRequest,
						goodsGuaranteesRequestId
					};
				}
			),
		[list, guaranteeModality, canEdit]
	);

	const downloadFiles = (id: number) => {
		dispatch(guaranteeAccountabilityFiles(id))
	}

	const doReclassification = async (id: number) => {
		const isConfirmed = await confirm(`Tem certeza que deseja reclassificar esse lançamento?`, "Reclassificação")
		if (!isConfirmed) return;

		const { payload } = await dispatch(costCenterReclassificationAccountability(Number(id))) as any;

		if(payload?.status === 500){
				return enqueueSnackbar(`${payload?.detail}`, {variant: "error"})
		} else {
			return enqueueSnackbar(`Reclassificação realizada com sucesso`, {variant: "success"})
		}
	}

	const columns: ColumnData[] = [
		{
			label: "Estorno",
			field: "",
			type: "custom",
			component: ({
				status,
				statusFlowId,
				statusApprovalId,
				id,
				idLinkForAccounting,
				parentAccountabilityId,
				typeFlow,
				generatedGoodsGuaranteesId,
				goodsGuaranteesRequest,
				generatedGoodsGuarantees,
				amountWrittenOff,
				...values
			}: any) => {
				if (
					parentAccountabilityId === null &&
					((typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT &&
						status === 1 &&
						statusFlowId === 1 &&
						statusApprovalId === 1) ||
						(typeFlow !== TYPE_FLOW.JUDICIAL_DEPOSIT &&
							statusFlowId === 1 &&
							status === 1)) &&
					permition
				) {
					if (generatedGoodsGuaranteesId)
						return (
							isAdmin === true ? <> 
							<IconButton
								onClick={() => enqueueSnackbar(`Prestação de conta com vínculo em outra garantia que possui valor baixado, não permite estorno.
								Estorne primeiro a prestação de conta da garantia ID - ${generatedGoodsGuaranteesId}`, { variant: "error" })}
							>
								<LogoIconRed />
							</IconButton>
							</> : null 
						);
					return (
						isAdmin === true ? <> 
						<IconButton
							onClick={() =>
								history.push(
									!idLinkForAccounting
										? `/bens-e-garantias/prestacao-de-contas-avaliacao/${id};estorno`
										: `/bens-e-garantias/prestacao-de-contas-avaliacao/multipla;${idLinkForAccounting}`
								)
							}
						>
							<BackspaceIcon />
						</IconButton>
						</> : null 
					);
				}
			},
		},
		{
			label: t("form.attachments"),
			field: "",
			type: "custom",
			component: (row: any) => {
				if (!row.files?.length) return null;
				return (
					<IconButton
						onClick={() => downloadFiles(row.id)}
					>
						<AttachmentIcon />
					</IconButton>
				);
			},
		},
		{
			label: t("goodsAndGuarantees:requestNumber"),
			field: "id",
		},
		{   label: t("goodsAndGuarantees:accountability.parentAccountabilityId"), 
			field: "parentAccountabilityId"},
		{
			label: "Data solicitação",
			field: "accountabilityDate",
			type: "date",
		},
		{
			label: t("form.CTGFolder"),
			field: "folderNumber",
		},
		{
			label: t("goodsAndGuarantees:management.goodDate"),
			field: "guaranteeDate",
			type: "date",
		},
		{
			label: t("goodsAndGuarantees:form.guaranteeModality"),
			field: "guaranteeModality",
		},
		{
			label: t("goodsAndGuarantees:form.solicitationType"),
			field: "description",
			type: "custom",
			component: (row: TGoodsGuaranteesRequest) => {
				return requestTypesOptionsAll.find((x) => x.value === row.requestTypeId)
					?.label;
			},
		},
		{ label: "Motivo da baixa", field: "bearishReasonsText" },
		{
			label: "Total baixado",
			field: "amountWrittenOff",
			type: "currency",
		},
		{
			label: t("goodsAndGuarantees:accountability.situation"),
			field: "situationToShow",
		},
		{
			label: t("goodsAndGuarantees:accountability.accountabilityStatus"),
			field: "accountabilityStatusToShow",
		},
		{ label: "Status da contabilização", field: "statusTextApproval" },
		{
			label: "Reclassificação",
			field: "",
			type: "custom",
			component: (row: any) => {
				return (
					(row.parentAccountabilityId === null && row.statusTextApproval === "Aprovado" && row.guaranteeModality === "DEPÓSITO JUDICIAL" && row.bearishReasonsText === "Convertido em pagamento") === true ? 
					<IconButton
						onClick={() => doReclassification(row.id)}
					>
						<FlipCameraAndroidIcon/>
					</IconButton> : null
				);
			},
		}
	];
	const ids = useMemo(
		() => accontabilityArray.map(({ id }) => id),
		[accontabilityArray]
	);

	if (isEvaluation) {
		columns.unshift({
			label: "Marcar avaliação",
			field: "action",
			component: (row: TGuaranteeAccountability, index: any) => {
				if (row.accountabilityStatusToShow !== "Pendente") return null;
				if (
					!(
						row.guaranteeModality === "DEPÓSITO JUDICIAL" &&
						(row.bearishReasonsText === "Liberado à empresa" ||
							row.bearishReasonsText === "Transferência entre contas" ||
							row.bearishReasonsText === "Transferência entre processos")
					) ||
					row.creditReceiptId !== null
				)
					return null;

				if (
					accontabilityArray.length !== 0 &&
					(accontabilityArray[0].bearishReasonsText !==
						row.bearishReasonsText ||
						accontabilityArray[0].creditReceiptId !== null)
				)
					return null;

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
								if (index === -1) dispatch(addAccontabilityArray(row));
								else dispatch(removeAccontabilityArray(index));
							}}
						/>
					</>
				);
			},
			type: "custom",
		});
	}

	const handleAction = ({ id }: any) => {
		if (pathname.includes("gestao"))
			history.push(`/bens-e-garantias/prestacao-de-contas-solicitacao/${id}`);
		else history.push(`${pathname}/${id}`);
	};

	return (
		<>
			<Panel title={t("goodsAndGuarantees:accountability.listTitle")}>
				<TableComponent
					rows={rows}
					columns={columns}
					onEdit={handleAction}
					onVisualize={handleAction}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default AccountabilityList;
