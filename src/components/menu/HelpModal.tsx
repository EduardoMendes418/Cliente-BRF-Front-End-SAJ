import { Formik } from "formik";
import { TextField } from "../form";
import { Grid } from "@mui/material";
import { Clean, Submit } from "src/components/button";
import TableContexComponent, {
	PaginationContext,
	usePaginationContext
} from "src/components/TableContext";
import { useEffect, useMemo } from "react";
import TableComponent, { ColumnData } from "src/components/Table";
import { IconButton } from "@material-ui/core";
import ArrowDownward from "@material-ui/icons/GetApp";
import { rejectNoValues } from "src/core/utils/func";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "src/core/store";
import { fetchHelpFiles } from "src/core/store/modules/HelpFiles/thunks";
import { getListFiltersHelpFiles, getListHelpFiles, getLoadingHelpFiles } from "src/core/store/modules/HelpFiles/selectors";
import { useTranslation } from "src/locale/i18n";
import FileSaver from 'file-saver';
import { MainDiv, TableDiv } from "./styled";

const HelpModal = () => {
	const dispatch = useDispatch();
	const { page, pageSize } = usePaginationContext();
	const filters = useSelector(getListFiltersHelpFiles);
	const list = useSelector(getListHelpFiles);
	const loading = useSelector(getLoadingHelpFiles);
	const { t } = useTranslation();

	const rows = useMemo(
		() =>
			list,
		[list]
	);

	const donwloadFile = (row: any) => {
		FileSaver.saveAs(row.pathPublish as Blob, `Teste_arquivo.${row.extensionFilePublish
		}`) 
	}

	const columns: ColumnData[] = [
		{
			label: "Download",
			field: "download",
			type: "custom",
			component: (row: any) => (
				<IconButton aria-label="edit" onClick={() => donwloadFile(row)}>
					<ArrowDownward />
				</IconButton>
			),
		},
		{
			label: t("settings:helpFiles.form.documentName"),
			field: "documentName",
		},
	];

	useEffect(() => {
		dispatch(fetchHelpFiles({ page, pageSize, ...filters }));
	
	}, [page, pageSize, filters])

	const onSubmit = (values: any) => {
		const filters = rejectNoValues(values);
		dispatch(actions.helpFiles.setFilters(filters));
	};

	return (
		<>
			<MainDiv>
				<Formik
					initialValues={{ search: "" }}
					onSubmit={onSubmit}
					enableReinitialize
				>
					{({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid item md={10} xs={12}>
									<TextField name="search" label={t("settings:helpFiles.form.documentName")} />
								</Grid>
								<Grid item md={2} xs={2}>
									<Submit type="search" submitting={loading} />
								</Grid>
							</Grid>
							<Clean action="helpFiles" />
						</form>
					)}
				</Formik>
				<TableDiv>
					<TableComponent rows={rows} columns={columns} isLoading={loading} />
					<PaginationContext />
				</TableDiv>
			</MainDiv>
		</>
	);
};
const ContexModal = () => (
	<TableContexComponent>
		<HelpModal />
	</TableContexComponent>
);

export default ContexModal;

