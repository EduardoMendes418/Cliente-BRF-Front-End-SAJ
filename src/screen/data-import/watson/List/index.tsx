import {
	useCallback,
	useEffect,
	useState,
	ChangeEvent,
	ReactNode,
	useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "src/locale/i18n";
import { IconButton, FormControl, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility } from "@material-ui/icons";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@material-ui/core";

import TableComponent, { ColumnData } from "src/components/Table";
import Panel from "src/components/Panel";
import Pagination from "src/components/Pagination";

import {
	getListExportWatson,
	getStatusExportWatson,
	getErrorMessageExportWatson,
	getListFilters
} from "src/core/store/modules/watson-export/selector";
import { usePagination } from "src/hooks/pagination";
import ScreenTemplate from "src/components/Screen";
import { Button } from "src/components/button";
import { useRegisterDefault } from "src/hooks";
import {
	fetchWatsonExportList,
	fetchWatsonXLSX,
} from "src/core/store/modules/watson-export/thunks";
import { actions } from "src/core/store";
import { statusWatsonAsOptions } from "../constants";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import Search from "./Search"
import { TFilterBaseGeral, TWatsonList } from "src/core/models/watson";
import moment from "moment";
import ProgressButton from "./ProgressButtonProps";
import ReprocessButton from "./ReprocessButton";
import { ActionDiv, RenderUl } from "./styled";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

enum StatusTypeEnum {
	None = -1,
	WaitingToBeSent = 1,
	Sent = 2,
	Processed = 3,
	Error = 4,
	Concluded = 5,
	CalledOff = 6,
	ProcessingReturnFile = 7,
	ErroProcessingReturnFile = 8
}

const statusText = {
	[StatusTypeEnum.None]: "Erro na Geração do Arquivo",
	[StatusTypeEnum.WaitingToBeSent]: "Aguardando Envio",
	[StatusTypeEnum.Sent]: "Enviado Watson",
	[StatusTypeEnum.Processed]: "Processado",
	[StatusTypeEnum.Error]: "Erro",
	[StatusTypeEnum.Concluded]: "Concluído",
	[StatusTypeEnum.CalledOff]: "Cancelado",
	[StatusTypeEnum.ProcessingReturnFile]: "Processando Arquivo Retorno",
	[StatusTypeEnum.ErroProcessingReturnFile]: "Erro Processamento Arquivo Retorno",
};

const doStringData = ({
	creationDateStart,
	creationDateEnd,
	terminationDateStart,
	terminationDateEnd
}: TFilterBaseGeral) => {
	const arrayToBeReturned = []
	let creationfinalString = "" 
	// if (creationDateStart || creationDateEnd) creationfinalString += "Periodo"  
	if (creationDateStart) creationfinalString += `${moment(creationDateStart).format("DD/MM/YYYY")}`
	if (creationDateEnd) creationfinalString += ` até ${moment(creationDateEnd).format("DD/MM/YYYY")}`
	if (creationfinalString !== "") arrayToBeReturned.push(creationfinalString) 
	// let terminationfinalString = ""
	// if (terminationDateStart || terminationDateEnd) terminationfinalString += "Finalizado" 
	// if (terminationDateStart) terminationfinalString += ` a partir ${moment(terminationDateStart).format("DD/MM/YYYY")}`
	// if (terminationDateEnd) terminationfinalString += ` até ${moment(terminationDateEnd).format("DD/MM/YYYY")}`
	// if (terminationfinalString !== "") arrayToBeReturned.push(terminationfinalString)

	return arrayToBeReturned
}
const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const classes = useStyles();
	const [fileType, setFileType] = useState<any>({});
	const { enqueueSnackbar } = useSnackbar();
	const [idsLoding, setIdsLoading] = useState<number[]>([]);

	const list = useSelector(getListExportWatson);
	const listFilters = useSelector(getListFilters);
	const loading = useSelector(getStatusExportWatson);

	const fetchList = useCallback(() => {
		dispatch(fetchWatsonExportList({ page, pageSize, ...listFilters }));
	}, [dispatch, page, pageSize, listFilters]);

	const pushIdLoading = (id: number) => {
		idsLoding.push(id);
		setIdsLoading([...idsLoding]);
	}
	const removeIdLoading = (id: number) => {
		const index = idsLoding.indexOf(id);
		if (index > -1) {
			idsLoding.splice(index, 1);
			setIdsLoading([...idsLoding]);
		}
	}
	useEffect(() => () => dispatch(actions.watson.clear()), [dispatch]);

	useEffect(() => {
		fetchList();
	}, [fetchList]);
	const rows = useMemo(
		() =>
			list.map((item: TWatsonList) => {
				let statusTextFinal = item?.status !== undefined ? (statusText as any)[item.status] : "-";
				// if (item.triggerWatsonWithError !== null && item.triggerWatsonWithError === true) {
				// 	statusTextFinal = "Erro na execução Watson";
				// }

				return {
					...item,
					statusText: statusTextFinal,
					areasTextArray: Array.from(new Set<string>(item?.areas.map(({ path }: { path: string }) => path))),
					filterBaseGeralArray: Array.from(new Set<string>(item?.filterBaseGeral?.map((filterBaseGeral) => doStringData(filterBaseGeral)).flat(1))) ?? [],
					statusWatson: item?.status === 1 ? "" : item.triggerWatsonWithError ? "Erro na execução Watson" : "Processado"
				};
			}),
		[list]
	);


	useRegisterDefault({
		action: "watsonExport",
		getStatus: getStatusExportWatson,
		getErrorMessage: getErrorMessageExportWatson,
		route: "noRedirect",
		updateInListCallback: () => fetchList(),
	});

	const handleChange = (event: ChangeEvent<{ value: unknown }>, row: any) => {
		const checkValue: any = event.target.value;

		if (checkValue.includes("all")) {
			if (statusWatsonAsOptions.length !== (fileType as any)[row.id]?.length) {
				const arrayOfValues = [] as any;

				for (const item of statusWatsonAsOptions) {
					arrayOfValues.push(item.value);
				}

				const newFileType = { ...fileType };
				(newFileType as any)[row.id] = arrayOfValues;
				setFileType(newFileType);
			} else {
				const newFileType = { ...fileType };
				(newFileType as any)[row.id] = [];
				setFileType(newFileType);
			}
		} else {
			const newFileType = { ...fileType };
			(newFileType as any)[row.id] = [event.target.value].flat(1);
			setFileType(newFileType);
		}
	};

	const handleClickTable = async (row: any) => {
		if ((fileType as any)[row.id] === undefined)
			return enqueueSnackbar(t("dataImport:watson.selectFileType"), {
				variant: "error",
			});
		try {
			pushIdLoading(row.id);
			enqueueSnackbar("Gerando arquivo Watson, aguarde!", { variant: "info" });
			const { type } = (await dispatch(
				fetchWatsonXLSX({
					idWatson: row.idWatsonLoad,
					nameFiles: (fileType as any)[row.id],
				})
			)) as any;

			if (type.includes("fulfilled") === true) {
				enqueueSnackbar(t("dataImport:common.exportSuccess"), {
					variant: "success",
				});
				removeIdLoading(row.id);
			}
		} catch ({ message }: any) {
			enqueueSnackbar(t("dataImport:common.exportErrors"), {
				variant: "error",
			});
			removeIdLoading(row.id);
		}
	};

	const renderValue = useCallback(
		(selected: any): ReactNode => {
			return (
				<RenderUl>
					{statusWatsonAsOptions
						.filter(({ value }) => selected.includes(value))
						.map(({ label }, index) => (
							<li key={index}>{label}</li>
						))}
				</RenderUl>
			);
		},
		[statusWatsonAsOptions]
	);

	const columns: ColumnData[] = [
		{ label: t("dataImport:watson.list.id"), field: "id" },
		{ label: "Áreas DEJUR", field: "areasTextArray", type: "array" },
		{ label: "Filtro", field: "watsonSearchFilterDescription" },
		{ label: "Revisão de base", field: "baseRevision", type: "switch-button-yn" },
		{ label: "Simulação", field: "simulation", type: "switch-button-yn" },
		{ label: "Período de complemento", field: "filterBaseGeralArray", type: "array" },

		{ label: "Solicitante", field: "userName" },
		{
			label: "Data execução",
			field: "executionDate",
			type: "date",
		},
		{ label: t("dataImport:watson.list.hour"), field: "executionHour" },
		{ label: "Status", field: "statusText" },
		{ label: "Status Watson", field: "statusWatson" },
		{
			label: t("dataImport:watson.list.fileType"),
			field: "custom",
			type: "custom",
			component: (row: any) => (
				<FormControl variant="outlined" className={classes.formControl}>
					<Select
						id="fileType"
						value={(fileType as any)[row.id] ?? []}
						multiple
						onChange={(event: ChangeEvent<{ value: unknown }>) =>
							handleChange(event, row)
						}
						renderValue={renderValue}
					>
						<MenuItem value={"all"}>
							<FormControlLabel
								label={"Selecionar todos"}
								labelPlacement={"end"}
								control={
									<Checkbox
										color="secondary"
										checked={
											statusWatsonAsOptions.length === (fileType as any)[row.id]?.length
										}
									/>
								}
							/>
						</MenuItem>
						{statusWatsonAsOptions.map(({ value, label }) => (
							<MenuItem value={value}>
								<FormControlLabel
									label={label}
									labelPlacement={"end"}
									control={
										<Checkbox
											color="secondary"
											checked={fileType[row.id]?.indexOf(value) > -1}
										/>
									}
								/>
							</MenuItem>
						))}
					</Select>
				</FormControl>
			),
		},
		{
			label: "Ação",
			field: "custom",
			type: "custom",
			component: (row: any) => idsLoding.includes(row.id) ? <CircularProgress /> : (
				<ActionDiv>
					
					<IconButton
						color="default"
						size="small"
						onClick={() => handleClickTable(row)}
					>
						<Visibility />
					</IconButton>
					<ProgressButton 
						executionStatus={row.status}
						watsonLoadExecutionId={row.id}
					/>
					<ReprocessButton
						executionStatus={row.status}
						watsonLoadExecutionId={row.id}
					/>

				</ActionDiv>
			),
		},
	];

	return (
		<ScreenTemplate
			slotTopRight={
				<Button
					onClick={() => history.push(`/carga-de-dados/carga-watson/novo`)}
					text={t("dataImport:watson.list.newWatsonLoad")}
				/>
			}
		>
			<Search />
			<Panel title={t("dataImport:watson.list.watsonPayloadListing")}>
				<TableComponent
					columns={columns}
					rows={rows}
					isLoading={loading === "fetching"}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default List;