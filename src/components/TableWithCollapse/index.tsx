import React, { ChangeEvent, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
	Checkbox,
	Radio,
	Table as MuiTable,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { Skeleton } from "@mui/material";


import { isNull, numberToCurrency } from "src/core/utils/func";
import { useCurrentUser } from "src/config/permissions";
import { TPermissionType } from "src/core/models/profiles";
import { v4 } from "uuid";

import Table from '@material-ui/core/Table';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { formatedDateToDDMMYYYY } from "src/screen/goods-and-guarantees/management/List/List";
import { statusBemAsOption } from "src/core/models/goods-guarantee";
import { requestTypesOptionsAll } from "src/screen/goods-and-guarantees/constants";
import { useSelector } from "react-redux";
import { getListAsOptionPaymentType } from "src/core/store/modules/payment-type/selectors";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { ActionCell, ArrayCell, CurrencyCell, DateCell, DefaultCell, EditableCurrencyCell, FavoriteCell, PercentageCell, SwitchButtonCell, SwitchButtonYNCell } from "./cell";

export type Cell = {
	index: number;
	column: ColumnData;
	row: any;
	hiddeButton?: boolean;
	noWrap?: boolean;
	rindex?: number;
	onChange?: ({
		key,
		value,
		id,
	}: {
		key: string;
		value: any;
		id: number | string;
	}) => void;
};

export type ColumnData = {
	field: string;
	label: string;
	noWrap?: boolean;
	type?:
		| "switch-button"
		| "string"
		| "number"
		| "array"
		| "date"
		| "hour"
		| "dateHour"
		| "dateMonthYear"
		| "currency"
		| "editableCurrency"
		| "percentage"
		| "favorite"
		| "custom"
		| "switch-button-yn";
	customTypeRule?: (
		row: any
	) =>
		| "switch-button"
		| "string"
		| "number"
		| "array"
		| "date"
		| "dateHour"
		| "dateMonthYear"
		| "currency"
		| "percentage"
		| "switch-button-yn"
		| undefined;
	onChange?: (row: any, index?: number) => void;
	checked?: boolean;
	permission?: TPermissionType;
	component?: any;
	id?: number | string;
};

export type Props = {
	columns: ColumnData[];
	rows: any[];
	isLoading?: boolean;
	showCheckboxColumn?: boolean;
	isAllItemsSelected?: boolean;
	isCheckboxIndeterminate?: boolean;
	onVisualize?: (row: any, index?: number) => void;
	onEdit?: (row: any, index?: number) => void;
	onSaveRow?: (row: any, index?: number) => void;
	onDelete?: (row: any, index?: number) => void;
	onCheck?: (row: any, index?: number) => void;
	isCheck?: boolean;
	onClick?: (row: any) => void;
	onChangeValue?: ({
		key,
		value,
		id,
	}: {
		key: string;
		value: any;
		id: string | number;
	}) => void;
	onChangeCancel?: ({
		key,
		value,
		id,
	}: {
		key: string;
		value: any;
		id: string | number;
	}) => void;
	onCheckedChange?: (row: any) => void;
	onCheckedAllChange?: () => void;
	onSelectRadio?: (row: any) => void;
	onAttach?: (event: ChangeEvent, row: any) => void;
	isPendingProp?: string;
	permissionVisualize?: boolean | TPermissionType;
	permissionEdit?: boolean | TPermissionType;
	permissionDelete?: boolean | TPermissionType;
	permissionAttach?: boolean | TPermissionType;
	permissionCheck?: boolean | TPermissionType;
	permissionClick?: TPermissionType;
	numItemsLoading?: number;
	customStyle?: object;
	className?: Record<string, string>;
	isMultipleAttach?: boolean;
};

const Empty = ({ colSpan }: { colSpan: number }) => (
	<TableRow>
		<TableCell component="td" colSpan={colSpan}>
			Nenhum registro encontrado
		</TableCell>
	</TableRow>
);

const SkeleletonTable = ({
	columns,
	showActionColumn,
	showCheckboxColumn,
	onSelectRadio,
}: {
	columns: ColumnData[];
	showActionColumn: boolean;
	showCheckboxColumn: boolean;
	onSelectRadio: boolean;
}) => (
	<TableRow>
		{(showCheckboxColumn || onSelectRadio) && (
			<TableCell component="td">
				<Skeleton width={28} height={28} />
			</TableCell>
		)}
		{columns &&
			columns.map((_, index) => (
				<TableCell component="td" key={`skc-${index}`}>
					<Skeleton />
				</TableCell>
			))}
		{showActionColumn && (
			<TableCell component="td">
				<Skeleton width="50%" />
			</TableCell>
		)}
	</TableRow>
);

const renderCell = (
	props: Cell,
	hiddeButton: boolean,
	onChangeCell?: ({
		key,
		value,
		id,
	}: {
		key: string;
		value: any;
		id: string | number;
	}) => void
) => {
	let { type } = props.column;
	if (props.column.customTypeRule)
		type = props.column.customTypeRule(props.row);
	switch (type) {
		case "switch-button":
			return (
				<SwitchButtonCell
					{...props}
					hiddeButton={hiddeButton}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "array":
			return (
				<ArrayCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "date":
			return (
				<DateCell {...props} key={`${props.index}_${props.column.label}_row`} />
			);
		case "dateMonthYear":
			return (
				<DateCell
					{...props}
					format="MM/YYYY"
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "dateHour":
			return (
				<DateCell
					{...props}
					format="DD/MM/YYYY HH:mm:ss"
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "hour":
			return (
				<DateCell
					{...props}
					format="HH:mm:ss"
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "currency":
			return (
				<CurrencyCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "editableCurrency":
			return props.row.openToEdit ? (
				<EditableCurrencyCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
					onChange={onChangeCell}
				/>
			) : (
				<CurrencyCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "percentage":
			return (
				<PercentageCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "favorite":
			return (
				<FavoriteCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		case "custom":
			return (
				<TableCell component="td">
					{props.column.component(props.row, props.rindex)}
				</TableCell>
			);
		case "switch-button-yn":
			return (
				<SwitchButtonYNCell
					{...props}
					hiddeButton={hiddeButton}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
		default:
			return (
				<DefaultCell
					{...props}
					key={`${props.index}_${props.column.label}_row`}
				/>
			);
	}
};

const sizeActions = [undefined, "75px", "130px", "200px"];

const TableComponentWithCollapse = ({
	columns,
	rows,
	isLoading = false,
	numItemsLoading = 10,
	showCheckboxColumn = false,
	isAllItemsSelected = false,
	isCheckboxIndeterminate = false,
	customStyle = {},
	className,
	isPendingProp,
	onChangeValue,
	onVisualize,
	permissionVisualize = "view",
	onEdit,
	onSaveRow,
	permissionEdit = "edit",
	onDelete,
	permissionDelete = "del",
	onCheck,
	permissionCheck = "check",
	onClick,
	permissionClick = "view",
	onCheckedChange,
	onCheckedAllChange,
	onSelectRadio,
	onAttach,
	permissionAttach = "edit",
	isCheck,
	isMultipleAttach,
}: Props) => {

	const { id } = useParams<{ id: string }>();
	const { currentScreenPermissions } = useCurrentUser(id);
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const { guaranteeModality } = useGuaranteeModality();
	const [openRows, setOpenRows] = useState<any>({});

	const guaranteeModalityList = useMemo(() => {
		if (!guaranteeModality) return {};

		return guaranteeModality.reduce((acc, current) => {
			(acc as any)[Number(current.id)] = current.description;
			return acc;
		}, {});
	}, [guaranteeModality]);

	const handleToggle = (rowId: any) => {
		setOpenRows((prevOpenRows: { [x: string]: any; }) => ({
		...prevOpenRows,
		[rowId]: !prevOpenRows[rowId],
		}));
	};

	const onVisualizePermission = useMemo(() => {
		if (
			(typeof permissionVisualize === "boolean" && permissionVisualize) ||
			currentScreenPermissions[permissionVisualize || "view"]
		) {
			if (onVisualize) return onVisualize;
			if (
				(typeof permissionEdit === "boolean" && permissionEdit) ||
				!currentScreenPermissions[permissionEdit || "edit"]
			)
				return onEdit;
		}
	}, [
		currentScreenPermissions,
		permissionVisualize,
		onVisualize,
		permissionEdit,
		onEdit,
	]);

	const onEditPermission = useMemo(() => {
		if (
			(typeof permissionEdit === "boolean" && permissionEdit) ||
			currentScreenPermissions[permissionEdit || "edit"]
		)
			return onEdit;
	}, [currentScreenPermissions, permissionEdit, onEdit]);

	const onDeletePermission = useMemo(() => {
		if (
			(typeof permissionDelete === "boolean" && permissionDelete) ||
			currentScreenPermissions[permissionDelete || "del"]
		)
			return onDelete;
	}, [currentScreenPermissions, permissionDelete, onDelete]);

	const onCheckPermission = useMemo(() => {
		if (
			(typeof permissionCheck === "boolean" && permissionCheck) ||
			currentScreenPermissions[permissionCheck || "check"]
		)
			return onCheck;
	}, [currentScreenPermissions, permissionCheck, onCheck]);

	const onAttachPermission = useMemo(() => {
		if (
			(typeof permissionAttach === "boolean" && permissionAttach) ||
			currentScreenPermissions[permissionAttach || "edit"]
		)
			return onAttach;
	}, [currentScreenPermissions, permissionAttach, onAttach]);

	const showActionColumn = useMemo(() => {
		if (
			onVisualizePermission ||
			onEditPermission ||
			onDeletePermission ||
			onAttachPermission ||
			onCheckPermission
		)
			return true;
		return false;
	}, [
		onVisualizePermission,
		onEditPermission,
		onDeletePermission,
		onAttachPermission,
		onCheckPermission,
	]);

	let colSpan = showActionColumn ? columns.length + 1 : columns.length;
	if (onSelectRadio) colSpan += 1;
	if (showCheckboxColumn) colSpan += 1;

	const isEmpty = isNull(rows) && !isLoading;

	const quantActions = [
		onVisualizePermission,
		onEditPermission,
		onDeletePermission,
		onAttachPermission,
		onCheckPermission
	].filter((v) => !!v).length;

	return (
		<TableContainer style={customStyle} className={className?.root}>
			<MuiTable>
				<TableHead>
					<TableRow data-testid="table-row-header">
						{showCheckboxColumn && (
							<TableCell
								component="th"
								style={{ width: "54px", maxWidth: "54px" }}
							>
								<Checkbox
									color="primary"
									style={{ padding: 0 }}
									indeterminate={isCheckboxIndeterminate}
									checked={isAllItemsSelected}
									onChange={onCheckedAllChange}
								/>
							</TableCell>
						)}
						{onSelectRadio && (
							<TableCell
							component="th"
							style={{ width: "54px", maxWidth: "90px" }}
							>
							Selecionar	
							</TableCell>
						)}
						{showActionColumn && (
							<TableCell
								component="td"
							>
								Ações
							</TableCell>
						)}
						<TableCell component="th">
             				 Endosso
            			</TableCell>
						{columns &&
							columns.map((column, index) => (
								<TableCell
									component="th"
									key={`${index}_${column.label}_header`}
								>
									{column.label}
								</TableCell>
							))}
					</TableRow>
				</TableHead>
				<TableBody>
					{isLoading &&
						Array(numItemsLoading)
							.fill(null)
							.map((_, index) => (
								<SkeleletonTable
									columns={columns}
									showActionColumn={showActionColumn}
									showCheckboxColumn={showCheckboxColumn}
									onSelectRadio={!!onSelectRadio}
									key={`sk-${index}`}
								/>
							))}
					{isEmpty && colSpan && <Empty colSpan={colSpan ?? 1} />}
					{!isLoading && !isEmpty && rows && rows.map && rows.map(({ isViewButtonHidden, ...row }, index) => {
						return (
						<React.Fragment key={row.id}>
							<TableRow
								key={v4()}
								data-testid="table-row-body"
								style={{
									cursor:
										onClick && currentScreenPermissions[permissionClick]
											? "pointer"
											: "default",
									backgroundColor: `${
										row.message?.includes("Verificar impacto contábil")
											? "#9fc7b0"
											: ""
									}`,
								}}
								onClick={
									onClick && currentScreenPermissions[permissionClick]
										? () => onClick(row)
										: undefined
								}
							>
								{showCheckboxColumn && (
									<TableCell
										component="td"
										style={{ width: "54px", maxWidth: "54px" }}
									>
										{row.checked === undefined ? (
											"-"
										) : (
											<Checkbox
												color="primary"
												style={{ padding: 0 }}
												checked={row.checked}
												onChange={() =>
													onCheckedChange ? onCheckedChange(row.id) : null
												}
											/>
										)}
									</TableCell>
								)}
								{onSelectRadio && (
									<TableCell
										component="td"
										style={{ paddingRight: "0", width: "0%" }}
									>
										<Radio
											color="primary"
											checked={row.isSelected}
											onChange={() => onSelectRadio(row)}
										/>
									</TableCell>
								)}
								{showActionColumn && (
									<ActionCell
										isCheck={isCheck}
										row={{
											...row,
											isViewButtonHidden:
												!onEditPermission && isViewButtonHidden
													? false
													: isViewButtonHidden,
										}}
										onVisualize={onVisualizePermission}
										onEdit={onEditPermission}
										onSaveRow={onSaveRow}
										onDelete={onDeletePermission}
										onCheck={onCheckPermission}
										onAttach={onAttachPermission}
										isMultipleAttach={isMultipleAttach}
										isPendingProp={isPendingProp}
										index={index}
									/>
								)}
										
								<TableCell>
										<IconButton
										aria-label="expand row"
										size="small"
										onClick={() => handleToggle(row.id)}
										disabled={row.endorsements?.length === 0}
								>
									
									{
										row.endorsements?.length === 0 ? null : <>
											{openRows[row.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
										</>
									}
								
								</IconButton>
                  				</TableCell>

									{columns.map((column, cindex) =>
										renderCell(
											{ index: cindex, column, row, rindex: index, noWrap: column.noWrap },
											!currentScreenPermissions[column.permission || "del"] && !row.showSwitchHidden,
											onChangeValue
										)
									)}
							</TableRow>
							<TableRow>
                  				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + (showActionColumn ? 1 : 0) + (showCheckboxColumn ? 1 : 0) + 1}>
									<Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
									<Box sx={{ margin: 1 }}>
												<Table size="small" aria-label="purchases">
													<TableHead>
														<TableRow>
															<TableCell>ID do bem e garantia</TableCell>
															<TableCell>N°. da pasta/CTG</TableCell>
															<TableCell>Data do bem</TableCell>
															<TableCell>Modalidade da garantia</TableCell>
															<TableCell>Tipo da garantia</TableCell>
															<TableCell>Tipo da solicitação</TableCell>
															<TableCell>Valor da garantia</TableCell>
															<TableCell>Saldo contábil</TableCell>
															<TableCell>Saldo jurídico</TableCell>
															<TableCell>Status</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
													{row?.endorsements?.map((historyRow: any) => (
                    									// eslint-disable-next-line react/jsx-key
                    									<TableRow >
															<TableCell component="th" scope="row">
																{historyRow.id}
															</TableCell>
															<TableCell component="th" scope="row">
																{historyRow.folderNumber}
															</TableCell>
															<TableCell component="th" scope="row">
																{formatedDateToDDMMYYYY(historyRow.guaranteeDate)}
															</TableCell>
															<TableCell component="th" scope="row">
																{(guaranteeModalityList as any)[historyRow.guaranteeModeId]}
															</TableCell>
															<TableCell component="th" scope="row">
																{paymentTypeOptions.filter((x) => x.value === historyRow.guaranteeTypeId)[0]?.label}
															</TableCell>
															<TableCell component="th" scope="row">
																{requestTypesOptionsAll.find((x) => x.value === row.requestTypeId)?.label}
															</TableCell>
															<TableCell component="th" scope="row">
																{numberToCurrency(historyRow.valueGuarantee)}
															</TableCell>
															<TableCell component="th" scope="row">
																{numberToCurrency(historyRow.accountingBalance)}
															</TableCell>
															<TableCell component="th" scope="row">
																{numberToCurrency(historyRow.legalBalance)}
															</TableCell>
															<TableCell component="th" scope="row">
																{statusBemAsOption.filter((x: { value: any; }) => x.value === historyRow.statusBem)[0]?.label}
															</TableCell>
                    									</TableRow>
                  								))}
													</TableBody>
												</Table>
											</Box>
                    				</Collapse>
                  				</TableCell>
                			</TableRow>
						</React.Fragment>
						);
          				})}
				</TableBody>
			</MuiTable>
		</TableContainer>
	);
};

export default TableComponentWithCollapse;
