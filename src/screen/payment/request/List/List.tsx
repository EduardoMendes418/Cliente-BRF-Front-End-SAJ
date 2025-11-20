import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import {
	getLoadingPayment,
	getFiltersPayment,
	getListPaymentGrid,
} from "src/core/store/modules/payment/selectors";
import {
	fetchSolicitacaoGrid,
	updateStatusPaymentRequest,
} from "src/core/store/modules/payment/thunks";
import { useTranslation } from "src/locale/i18n";
import { Modulos } from "src/core/models/modules";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import { useCurrentUser } from "src/config/permissions";
import {
	STATUS_APPROVALS_FLOW,
	approversTextFlowPayment,
	statusTextApprovalsFlow,
} from "src/core/utils/constants";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@mui/material/Checkbox";
import BackspaceIcon from 'src/components/icons/svg/iconReturned';

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "src/components/button";
import { modal } from "src/components/modals";
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import FieldColumn from "src/components/FieldColumn";
import Form, { TextField, EmailField } from "src/components/form";

const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: theme.spacing(1),
	},
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

const List = ({ pathname }: { pathname: string }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { ...history } = useHistory();
	const { idBrf } = useCurrentUser("");

	const isLawyer = pathname.includes("aprovacao-advogado-interno");
	const isRequest = pathname.includes("solicitacao");
	const isLegal = pathname.includes("aprovacao-controle-juridico");

	const { page, pageSize } = usePagination();
	const items = useSelector(getListPaymentGrid) as any;
	const loading = useSelector(getLoadingPayment);
	const { name } = useSelector(getDataCurrentUser);
	const paymentfilters = useSelector(getFiltersPayment);
	const { id: userId } = useSelector(getDataCurrentUser);
	let status = "";

	const path = window.location.pathname;
	const eSocialRestriction = path.includes("/pagamentos/solicitacao-imposto") || undefined;

	const [accountabilityArray, setAccountabilityArray] = useState<any[]>([]);

	const ids = useMemo(() => accountabilityArray.map(({ paymentId }) => paymentId), [accountabilityArray]);

	const addAccontabilityArray = (row: any) => {
		setAccountabilityArray([...accountabilityArray, row]);
	};

	const removeAccontabilityArray = (index: number) => {
		setAccountabilityArray(accountabilityArray.filter((_, i) => i !== index));
	};

	useEffect(() => {
		dispatch(
			fetchPaymentType({
				modulo: Modulos.Pagamento,
				notPaginate: true,
				eSocialRestriction
			})
		);
		dispatch(
			fetchPaymentMethod({
				moduloId: Modulos.Pagamento,
				notPaginate: true,
			})
		);
	}, [eSocialRestriction]);

	useEffect(() => {
		if (!idBrf) return;
		if (!paymentfilters[pathname]) {
			const initialParams = {
				page: page === 0 ? 1 : page,
				pageSize,
				internalLawyerId: isLawyer ? idBrf : "",
				statusFlowId: isRequest || isLegal ? "" : isLawyer ? 4 : 3,
				eSocialRestriction
			}

			dispatch(fetchSolicitacaoGrid(rejectNoValues(initialParams)));
		} else {
			const { ...filters } = paymentfilters[pathname];
			const result = rejectNoValues({
				...filters,
				page: page === 0 ? 1 : page,
				pageSize,
				eSocialRestriction
			});
			dispatch(fetchSolicitacaoGrid(result));
		}
	}, [dispatch, isLawyer, paymentfilters, page, pageSize, pathname, eSocialRestriction]);

	const columns: ColumnData[] = [
		{
			label: t("solicitacaoPagamento:numeroSolicitacao"),
			field: "id"
		},
		{
			label: t("solicitacaoPagamento:dataSolicitacao"),
			field: "requestDate",
			type: "date",
		},
		{
			label: t("solicitacaoPagamento:pastaCTG"),
			field: "folderNumber"
		},
		{
			label: t("solicitacaoPagamento:processFormData.DEJURArea"),
			field: "legalDepartmentAreaName",
		},
		{
			label: t("solicitacaoPagamento:processFormData.processNumber"),
			field: "processNumber",
		},
		{
			label: t("solicitacaoPagamento:processFormData.oppositeParty"),
			field: "oppositePartyNew",
		},
		{
			label: t("Pagamentos:tipoPagamento"),
			field: "financeChartOfAccountsCategoryName"
		},
		{
			label: t("Pagamentos:formaPagamento"),
			field: "paymentMethodDescription"
		},
		{
			label: t("solicitacaoPagamento:dadosPagamento.dataPagamento"),
			field: "paymentDate",
			type: "date",
		},
		{
			label: t("solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial"),
			field: "judicialPaymentValue",
			type: "currency",
		},
		{
			label: t("solicitacaoPagamento:dadosPagamento.advogadoInterno"),
			field: "internalLawyerName",
		},
		{
			label: t("status"),
			field: "status"
		},
		{
			label: "Status e-Social",
			field: "eSocialEventLaunchStatus"
		},
		{
			label: "Status contabilização",
			field: "statusApprovalId"
		}
	];

	columns.unshift({
		label: path === "/pagamentos/solicitacao" ? "" : "Selecionar",
		field: "action",
		component: (row: any, index: any) => {
			if (path === "/pagamentos/solicitacao") return <></>;
		
			if(row.statusFlowId === 1 && row.statusApprovalId === "Aprovado"){
				return <IconButton
				onClick={() => handleAction({...row, isReversal: true})}
			>
				<BackspaceIcon
				/>
			</IconButton>
			} 

			const isCheckboxNeeded =
				(path === "/pagamentos/aprovacao-controle-juridico" && row.statusFlowId === 3) ||
				(path === "/pagamentos/aprovacao-advogado-interno" && row.statusFlowId === 4);

			if (!isCheckboxNeeded) return <></>;
			if (row.processType === "SE" && row.statusFlowId === 4) {
				return <></>;
			}

			const isChecked = ids.findIndex((id: any) => id === row.id) !== -1;

			const toggleCheckbox = () => {
				const index = ids.findIndex((id: any) => id === row.id);
				if (index === -1) {
					dispatch(addAccontabilityArray(row));
				} else {
					dispatch(removeAccontabilityArray(index));
				}
			};

			return (
				<Grid container spacing={2} alignItems='flex-start'>
					<Checkbox
						style={{ marginLeft: "-13px" }}
						color="primary"
						icon={icon}
						checkedIcon={checkedIcon}
						checked={isChecked}
						size="small"
						onClick={toggleCheckbox}
					/>
				</Grid>
			);
		},


		type: "custom",
	});

	const handleSelectAll = () => {
		if (accountabilityArray.length === 0) {
			const selectedItems = items.filter(
				(item: any) =>
					(path === "/pagamentos/aprovacao-controle-juridico" && item.statusFlowId === 3) ||
					(path === "/pagamentos/aprovacao-advogado-interno" && item.statusFlowId === 4)
			);
			setAccountabilityArray(selectedItems);
		} else {
			setAccountabilityArray([]);
		}
	};

	const handleAprove = () => {
		status = "aproved";
		onJustify("aproved");
	};

	const handleDisaprove = () => {
		status = "reproved";
		onJustify("reproved");
	};

	const handleAction = (row: any) => {
		if(row.isReversal === true){
			history.push(`${pathname}/${row.id};reversal`);
			return
		}
		history.push(`${pathname}/${row.id}`);
	};

	const isApprovalLegalControl = pathname.startsWith(
		"/pagamentos/aprovacao-controle-juridico"
	);
	const isApprovalInternalLawyer = pathname.startsWith(
		"/pagamentos/aprovacao-advogado-interno"
	);
	
	const eSocialStatusText = (eSocialStatus: number) => {

		switch (eSocialStatus) {
			case 1:
				return "Pendente"
			case 2:
				return "Enviado SAP"
			case 3:
				return "Erro validador"
			case 4:
				return "Processado"
			case 5:
				return "Excluído"
			case 6:
				return "Cancelado"	
			default:
				return "";
		}
	
	}

	const rows = useMemo(
		() =>
			items.map(
				(item: any) => {
					let isEditButtonVisible = false;
					const {
						statusFlowId,
						statusApprovalId,
						requesterId,
						processType,
					} = item

					if (
						(isApprovalLegalControl &&
							[
								STATUS_APPROVALS_FLOW.NONE,
								STATUS_APPROVALS_FLOW.REQUESTED,
								STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE,
								STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
							].includes(statusFlowId)) ||
						(isApprovalInternalLawyer &&
							STATUS_APPROVALS_FLOW.APPROVED === statusFlowId) ||
						(!isApprovalLegalControl &&
							!isApprovalInternalLawyer &&
							(statusFlowId === STATUS_APPROVALS_FLOW.RETURNED ||
								statusApprovalId === STATUS_APPROVALS_FLOW.RETURNED) &&
							userId === requesterId)
					)
						isEditButtonVisible = true;

					if (statusFlowId === 1 && statusApprovalId === 1 && item.paymentMethodDescription === "GUIAS" && isApprovalLegalControl) {
						isEditButtonVisible = true;
					}

					let status = "";
					status = statusTextApprovalsFlow[statusFlowId];

					if (
						statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
						statusApprovalId === STATUS_APPROVALS_FLOW.NONE
					)
						status = "Aprovado Advogado Interno";

					if (
						statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
						statusApprovalId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
					)
						status = "Aprovado";

					if(statusFlowId === STATUS_APPROVALS_FLOW.REVERSAL)	
						status = "Estornado"

					if (
						(statusFlowId === STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE &&
							statusApprovalId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE) ||
						(statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
							statusApprovalId === STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE) ||
						(statusFlowId === STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE &&
							statusApprovalId === STATUS_APPROVALS_FLOW.NONE)
					)
						status = "Reprovado";

					/* if (statusFlowId === 2) {
						isEditButtonVisible = true
					} */
					if (processType === "SE" && statusFlowId === 4) {
						isEditButtonVisible = false
					}
					
					return {
						...item,
						id: item.paymentId,
						status,
						statusFlowId,
						isViewButtonHidden: isRequest === true && status === "Devolvido" ? true : statusFlowId == 2 ? (requesterId === userId) : isEditButtonVisible,
						isEditButtonHidden:  isRequest === true && status === "Devolvido" ? false : statusFlowId == 2 ? !(requesterId === userId) : !isEditButtonVisible,
						oppositePartyNew: item?.processPartiesOtherName,
						statusApprovalId: approversTextFlowPayment[statusApprovalId],
						eSocialEventLaunchStatus: eSocialStatusText(Number(item?.eventLaunchStatus))
					};
				}
			),
		[items, pathname, userId]
	).filter((rows: any) => {
		if (isApprovalInternalLawyer === true) {
			return rows.tipoProcesso !== "SE"
		} else {
			return rows
		}
	});
	
	const initialValues: {
		emails: string;
		observationOfLegalControl: string;
		justification: string;
	} = {
		emails: "",
		observationOfLegalControl: "",
		justification: "",
	};

	const onSubmit = (values: any) => {
		const createRegObject = (id: number) => {
			if (status === "aproved") {
				return {
					id,
					observation: values?.observationOfLegalControl,
					statusFlowId: path === "/pagamentos/aprovacao-advogado-interno" ? 1 : 4,
					emails: values.emails,
				};
			}
			return {
				id,
				statusFlowId: 0,
				observation: values?.justification,
			};
		};

		ids.forEach(async (id) => {
			const reg = createRegObject(id);
			await dispatch(updateStatusPaymentRequest(reg));
		});

		if (status === "aproved") {
			setTimeout(function () {
				window.location.reload();
			}, 3000);
		} else {
			window.location.reload();
		}
	};

	const onJustify = (status: "aproved" | "reproved") => {
		const component = (
			<>
				<Form
					enableReinitialize
					initialValues={initialValues}
					onSubmit={onSubmit}
				>
					{({ handleSubmit, status: statusForm, isSubmitting, setSubmitting }) => (
						<form onSubmit={handleSubmit}>
							<Typography variant="h3">
								{path === "/pagamentos/aprovacao-advogado-interno" ?
									t("approval.titleInternalLawyer") :
									t("approval.titleLegalControl")
								}
							</Typography>
							<Box mt={3} mb={4}>
								<Grid container spacing={3}>
									{status !== "reproved" && (
										<>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={t("approval.date")}
													value={new Date()} //approvalDateOfLegalControl
													type="date"
												/>
											</Grid>
											<Grid item md={9} xs={12}>
												<FieldColumn
													label={t("approval.approver")}
													value={name} //approverOfLegalControl
												/>
											</Grid>
											<Grid item md={9} xs={12}>
												<EmailField name="emails" label={"email"} />
											</Grid>
											<Grid
												item
												md={12}
												xs={12}
												className="tablecell-observation"
											>
												<TextField
													name="observationOfLegalControl"
													label={t("approval.observation")}
													rows={3}
													multiline
													required
												/>
											</Grid>
										</>
									)}
									{status === "reproved" && (
										<Grid item xs={12} md={12}>
											<TextField
												name="justification"
												label={t("goodsAndGuarantees:justification")}
												placeholder={t("form.typeHere")}
												rows={5}
												maxLength={10000}
												multiline
												required
											/>
										</Grid>
									)}
									<div style={{ margin: "2% 0 0 89%" }}>
										<Button
											className={classes.button}
											type="submit"
											onClick={() => onSubmit}
											disabled={isSubmitting}
											text={"Salvar"}
										/>
									</div>
								</Grid>
							</Box>
						</form>
					)}
				</Form>
			</>
		);

		const title = status === "aproved" ? "Aprovar Seleção" : "Reprovar Seleção";

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	return (
		<>
			<Panel title={t("solicitacaoPagamento:list")}>

				{!path.includes("/pagamentos/solicitacao") && (
					<div
						style={{
							display: "flex",
							justifyContent: "flex-start",
							marginTop: "1%",
						}}
					>
						<Button
							style={{ marginRight: "auto" }}
							className={classes.button}
							onClick={handleSelectAll}
							text={ids.length > 0 ? "Desmarcar Todos" : "Selecionar Todos"}
						/>

						<Button
							className={classes.button}
							onClick={() => {
								handleAprove();
							}}
							text={"Aprovar Seleção"}
							disabled={ids.length > 0 ? false : true}
						/>
						<Button
							className={classes.button}
							onClick={handleDisaprove}
							text={"Reprovar Seleção"}
							disabled={ids.length > 0 ? false : true}
						/>
					</div>
				)}

				<TableComponent
					columns={columns}
					rows={rows}
					isLoading={loading}
					onEdit={handleAction}
					onVisualize={handleAction}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
