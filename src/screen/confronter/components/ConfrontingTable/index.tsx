import { useState, Fragment, useCallback, useEffect } from "react";
import {
	Box,
	Checkbox,
	Grid,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { Skeleton } from "@mui/material";
import { format } from "date-fns";

import Panel from "src/components/Panel";
import { Button } from "src/components/button";
import { modal } from "src/components/modals";
import Pagination from "src/components/Pagination";
import { toCurrency } from "src/core/utils/func";
import { t } from "src/locale/i18n";

import StatusChip from "../StatusChip";
import AssesmentButtons from "../AssesmentButtons";
import useManageList from "../../hooks/useManageList";
import { checkIsPending } from "../../utils/confronter-status-functions";
import JustificationModal from "../JustificationModal";
import useStyles from "./confronting-table.style";
import { useDispatch, useSelector } from "react-redux";
import { getConfrontingReport } from "src/core/store/modules/confronting-orders/thunks";
import { AppDispatch } from "src/core/store";
import FileSaver from "file-saver";
import moment from "moment";
import { getConfrontingOrdersFilters } from "src/core/store/modules/confronting-orders/selectors";
import { useSnackbar } from "notistack";
import { fetchClosuresResultList } from "src/core/store/modules/closures/thunks";
import { getListClosures } from 'src/core/store/modules/closures/selectors';

const TOTAL_FIXED_COLUMNS = 25;

type ConfrontingTableProps = {
	isLoading: boolean;
};

export default function ConfrontingTable({ isLoading }: ConfrontingTableProps) {
	const {
		rows,
		totalLoadingRows,
		dynamicColumns,
		handleSelect,
		handleSelectAll,
		handleSingleRowAssessment,
		handleMultipleRowAssessment,
	} = useManageList();

	const [checkbox, setCheckbox] = useState(false);
	const [isSubmitting, setSubmiting] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();
	const filters = useSelector(getConfrontingOrdersFilters);
	const listClosures = useSelector(getListClosures);
	const snackbar = useSnackbar();

	useEffect(() => {
		dispatch(fetchClosuresResultList({notPaginate: true, status: 1}))
	}, [dispatch])

	const hasRows = rows.length > 0;
	const hasCheckedRows = rows.filter((row) => row.check).length > 0;
	const classes = useStyles();

	useEffect(() => {
		if (listClosures.length !== 0 ) snackbar.enqueueSnackbar("Mês de fechamento em competência confrontador bloqueado", {
			variant: "warning",
		});
	
	}, [listClosures.length])
	
	const getReport = useCallback(async () => {
		setSubmiting(true);
		const reportFilters = { ...filters, page: undefined, pageSize: undefined };
		const { payload, type } = await dispatch(
			getConfrontingReport(reportFilters)
		);

		if (type === "confrontingOrders/fetchConfrontingReport/rejected"){
			setSubmiting(false);
			return snackbar.enqueueSnackbar("Erro ao gerar relatório", {
				variant: "error",
			})}

		FileSaver.saveAs(
			payload as Blob,
			`ConfrontingReport-${moment().format()}.xlsx`
		);
		setSubmiting(false);
	}, [dispatch, filters, snackbar]);

	return (
		<>
			<Panel title={t("confronter:listTitle")}>
				<Grid container justifyContent="space-between">
					<Grid item xs={6}>
						<Box p={2} textAlign="left" display="flex" gridGap="1rem">
							<Button
								color="default"
								variant="outlined"
								onClick={() => {
									setCheckbox((state) => !state);
									handleSelectAll(!checkbox);
								}}
								text={checkbox ? "Desfazer seleção" : "Selecionar todos"}
							/>
							<Button
								submitting={isSubmitting}
								color="primary"
								variant="contained"
								onClick={getReport}
								text={t("confronter:button.generateReport")}
							/>
						</Box>
					</Grid>
					<Grid item xs={6}>
						<Box p={2} textAlign="right">
							<Button
								text="Reprovar seleção"
								disabled={!hasCheckedRows}
								onClick={() =>
									modal({
										title: "Motivo",
										component: (
											<JustificationModal
												assessmentStatus={false}
												onSubmit={handleMultipleRowAssessment}
											/>
										),
										buttons: [],
										dialogProps: {
											maxWidth: "sm",
											showCloseButton: true,
											fullWidth: true,
										},
									})
								}
								className={classes.disapproveAll}
								disableElevation
							/>
							<Button
								text="Aprovar seleção"
								disabled={!hasCheckedRows}
								onClick={() =>
									modal({
										title: "Motivo",
										component: (
											<JustificationModal
												assessmentStatus={true}
												onSubmit={handleMultipleRowAssessment}
											/>
										),
										buttons: [],
										dialogProps: {
											maxWidth: "sm",
											showCloseButton: true,
											fullWidth: true,
										},
									})
								}
								className={classes.approveAll}
								disableElevation
							/>
						</Box>
					</Grid>
				</Grid>

				<TableContainer>
					<Table>
						<TableHead className={classes.head}>
							<TableRow>
								<TableCell rowSpan={2}>
									<Checkbox
										color="primary"
										checked={checkbox}
										onChange={() => {
											setCheckbox((state) => !state);
											handleSelectAll(!checkbox);
										}}
									/>
								</TableCell>
								<TableCell rowSpan={2}>{t("acoes")}</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.confronterStatus")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.confronterNumber")}
								</TableCell>
								<TableCell rowSpan={2}>
									Data solicitação
								</TableCell>
								<TableCell rowSpan={2}>
									Solicitante
								</TableCell>
								<TableCell rowSpan={2}>{t("field.dejurArea")}</TableCell>
								<TableCell rowSpan={2}>{t("field.processStatus")}</TableCell>
								<TableCell rowSpan={2}>{t("field.process")}</TableCell>
								<TableCell rowSpan={2}>{t("field.opposingPart")}</TableCell>
								<TableCell rowSpan={2}>{t("field.ctgFolder")}</TableCell>
								<TableCell rowSpan={2}>{t("confronter:table.contingency")}</TableCell>
								<TableCell rowSpan={2}>{t("field.office")}</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.internalLawyer")}
								</TableCell>
								<TableCell rowSpan={2}>{t("field.legalResponsible")}</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.confronterPhase")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.approvalStatus1")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.approver1")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.opinion1")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.approvalStatus2")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.approver2")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.opinion2")}
								</TableCell>
								<TableCell rowSpan={2}>
									{t("confronter:table.orderDescription")}
								</TableCell>
								<TableCell rowSpan={2}>{t("form.attachments")}</TableCell>
								<TableCell colSpan={2}>
									{t("confronter:table.enableDisable")}
								</TableCell>
								<TableCell colSpan={2}>{t("field.expectation")}</TableCell>
								{dynamicColumns.map(
									(
										{ orderRatingDescriptionId, orderRatingDescriptionName },
										index
									) => (
										<Fragment
											key={`head_head_cell_${orderRatingDescriptionId}_${index}`}
										>
											<TableCell colSpan={2}>
												Valor {orderRatingDescriptionName.toLowerCase()}{" "}
												provável
											</TableCell>
											<TableCell colSpan={2}>
												Valor {orderRatingDescriptionName.toLowerCase()}{" "}
												possível
											</TableCell>
											<TableCell colSpan={2}>
												Valor {orderRatingDescriptionName.toLowerCase()} remoto
											</TableCell>
											<TableCell colSpan={2}>
												Índice de correção{" "}
												{orderRatingDescriptionName.toLowerCase()}
											</TableCell>
											<TableCell colSpan={2}>
												Data base {orderRatingDescriptionName.toLowerCase()}
											</TableCell>
										</Fragment>
									)
								)}
							</TableRow>
							<TableRow>
								{/* enable/disable */}
								<TableCell>{t("confronter:table.from")}</TableCell>
								<TableCell>{t("confronter:table.to")}</TableCell>
								{/* expectation */}
								<TableCell>{t("confronter:table.from")}</TableCell>
								<TableCell>{t("confronter:table.to")}</TableCell>
								{dynamicColumns.map(({ orderRatingDescriptionId }, index) => (
									<Fragment
										key={`head_data_cell_${orderRatingDescriptionId}_${index}`}
									>
										{/* probable */}
										<TableCell>{t("confronter:table.from")}</TableCell>
										<TableCell>{t("confronter:table.to")}</TableCell>
										{/* possible */}
										<TableCell>{t("confronter:table.from")}</TableCell>
										<TableCell>{t("confronter:table.to")}</TableCell>
										{/* remote */}
										<TableCell>{t("confronter:table.from")}</TableCell>
										<TableCell>{t("confronter:table.to")}</TableCell>
										{/* correction index */}
										<TableCell>{t("confronter:table.from")}</TableCell>
										<TableCell>{t("confronter:table.to")}</TableCell>
										{/* base date */}
										<TableCell>{t("confronter:table.from")}</TableCell>
										<TableCell>{t("confronter:table.to")}</TableCell>
									</Fragment>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{isLoading &&
								Array(totalLoadingRows)
									.fill(null)
									.map((_, indexRow) => (
										<TableRow key={`row_${indexRow}`}>
											{Array(TOTAL_FIXED_COLUMNS)
												.fill(null)
												.map((_, indexCol) => (
													<TableCell key={`cell_${indexCol}`}>
														<Skeleton />
													</TableCell>
												))}
										</TableRow>
									))}
							{!isLoading && !hasRows && (
								<TableRow>
									<TableCell colSpan={TOTAL_FIXED_COLUMNS}>
										Nenhum registro encontrado
									</TableCell>
								</TableRow>
							)}
							{!isLoading &&
								hasRows &&
								rows.map((row, indexRow) => {
									const isPending = checkIsPending(row.statusFlowId);

									return (
										<TableRow className={classes.row} key={`row_${indexRow}`}>
											<TableCell>
												<Checkbox
													color="primary"
													checked={row.check}
													disabled={!isPending || !row.approver}
													onChange={() => handleSelect(row.id)}
												/>
											</TableCell>
											<TableCell>
												<Box display="flex" justifyContent="center">
													{listClosures.length === 0 && (
														<AssesmentButtons
															row={row}
															handleSingleRowAssessment={
																handleSingleRowAssessment
															}
														/>
													)}
													
												</Box>
											</TableCell>
											<TableCell>
												<StatusChip status={row.statusFlowId} />
											</TableCell>
											<TableCell>{row.id}</TableCell>
											<TableCell>{moment(row.createdDate).format("DD/MM/YYYY")}</TableCell>
											<TableCell>{row.createdBy || "-"}</TableCell>
											<TableCell>{row.legalDepartmentAreaName}</TableCell>
											<TableCell>{row.statusProcessoName || "-"}</TableCell>
											<TableCell>{row.processNumber || "-"}</TableCell>
											<TableCell>{row.oppositeParty || "-"}</TableCell>
											<TableCell>{row.folderNumber || "-"}</TableCell>
											<TableCell>{row.contingency || "-"}</TableCell>
											<TableCell>{row.responsibleAreaName || "-"}</TableCell>
											<TableCell>{row.internalLawyer || "-"}</TableCell>
											<TableCell>{row.legalResponsible || "-"}</TableCell>
											<TableCell>{row.confrontationalPhase || "-"}</TableCell>
											<TableCell>{row.statusFlowIdLevel1 || "-"}</TableCell>
											<TableCell>{row.approverLevel1 || "-"}</TableCell>
											<TableCell>{row.opinionLevel1 || "-"}</TableCell>
											<TableCell>{row.statusFlowIdLevel2 || "-"}</TableCell>
											<TableCell>{row.approverLevel2 || "-"}</TableCell>
											<TableCell>{row.opinionLevel2 || "-"}</TableCell>
											<TableCell>{row.toOrderDescriptionName || "-"}</TableCell>
											<TableCell>
												{row.confrontingOrderFiles?.length > 0 && (
													<IconButton
														onClick={() => {
															const paths = row.confrontingOrderFiles.map(
																(file) => file.path
															);
															paths.forEach((path) => window.open(path));
														}}
													>
														<AttachmentIcon />
													</IconButton>
												)}
											</TableCell>
											<TableCell
												className={
													row.fromIsActive !== row.toIsActive ? "changed" : ""
												}
											>
												{row.fromIsActive == null
													? "-"
													: row.fromIsActive
													? "Ativo"
													: "Inativo"}
											</TableCell>
											<TableCell
												className={
													row.fromIsActive !== row.toIsActive ? "changed" : ""
												}
											>
												{row.toIsActive ? "Ativo" : "Inativo"}
											</TableCell>
											<TableCell
												className={
													row.fromOrderExpectationName !==
													row.toOrderExpectationName
														? "changed"
														: ""
												}
											>
												{row.fromOrderExpectationName || "-"}
											</TableCell>
											<TableCell
												className={
													row.fromOrderExpectationName !==
													row.toOrderExpectationName
														? "changed"
														: ""
												}
											>
												{row.toOrderExpectationName || "-"}
											</TableCell>
											{dynamicColumns.map(
												({ orderRatingDescriptionId }, index) => {
													const orderRating =
														row.ratingsByDescription[
															orderRatingDescriptionId
														] || {};
													return (
														<Fragment
															key={`data_cell_${orderRatingDescriptionId}_${index}`}
														>
															{/* probable */}
															<TableCell
																className={
																	orderRating.hasProbableValueChanged
																		? "changed"
																		: ""
																}
															>
																{toCurrency(orderRating.fromProbableValue)}
															</TableCell>
															<TableCell
																className={
																	orderRating.hasProbableValueChanged
																		? "changed"
																		: ""
																}
															>
																{toCurrency(orderRating.toProbableValue)}
															</TableCell>
															{/* possible */}
															<TableCell
																className={
																	orderRating.hasPossibleValueChanged
																		? "changed"
																		: ""
																}
															>
																{toCurrency(orderRating.fromPossibleValue)}
															</TableCell>
															<TableCell
																className={
																	orderRating.hasPossibleValueChanged
																		? "changed"
																		: ""
																}
															>
																{toCurrency(orderRating.toPossibleValue)}
															</TableCell>
															{/* remote */}
															<TableCell
																className={
																	orderRating.hasRemoteValueChanged
																		? "changed"
																		: ""
																}
															>
																{toCurrency(orderRating.fromRemoteValue)}
															</TableCell>
															<TableCell
																className={
																	orderRating.hasRemoteValueChanged
																		? "changed"
																		: ""
																}
															>
																{toCurrency(orderRating.toRemoteValue)}
															</TableCell>
															{/* correction index */}
															<TableCell
																className={
																	orderRating.hasFormulaCorrectionRuleNameChanged
																		? "changed"
																		: ""
																}
															>
																{orderRating.fromFormulaCorrectionRuleName ||
																	"-"}
															</TableCell>
															<TableCell
																className={
																	orderRating.hasFormulaCorrectionRuleNameChanged
																		? "changed"
																		: ""
																}
															>
																{orderRating.toFormulaCorrectionRuleName || "-"}
															</TableCell>
															{/* base date */}
															<TableCell
																className={
																	orderRating.hasDatabaseChanged
																		? "changed"
																		: ""
																}
															>
																{orderRating.fromDatabase
																	? format(
																			new Date(orderRating.fromDatabase),
																			"dd/MM/yyyy"
																	  )
																	: "-"}
															</TableCell>
															<TableCell
																className={
																	orderRating.hasDatabaseChanged
																		? "changed"
																		: ""
																}
															>
																{orderRating.toDatabase
																	? format(
																			new Date(orderRating.toDatabase),
																			"dd/MM/yyyy"
																	  )
																	: "-"}
															</TableCell>
														</Fragment>
													);
												}
											)}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
			</Panel>

			<Pagination />
		</>
	);
}
