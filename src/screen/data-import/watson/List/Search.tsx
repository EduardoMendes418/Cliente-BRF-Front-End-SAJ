import { useCallback, useEffect } from "react";
import Panel from "src/components/Panel";
import { Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { getListAsOptionsGuaranteeType } from "src/core/store/modules/watson/selector";
import { Clean, Submit } from "src/components/button";
import { UserField, DateField, SelectField, TextField } from "src/components/form";
import { Formik } from "formik";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { fetchWatsonList } from "src/core/store/modules/watson/thunks";
import { useGroupedAreas } from "src/hooks/fetchLists";
import { useTranslation } from "src/locale/i18n";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";
type TFiltersInitialValues = {
	executiomDateStart: Date | null;
	executionDateEnd: Date | null;
	userId: string;
	watsonSearchFilterId: string;
	dejurAreas: number[];
	folders?: string[];
	folderNumber?: string;

}
const initialValues: TFiltersInitialValues = {
	executiomDateStart: null,
	executionDateEnd: null,
	userId: "",
	watsonSearchFilterId: "",
	dejurAreas: [],
	folderNumber: "" 
};
const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const listAsOptionsGuaranteeType = useSelector(getListAsOptionsGuaranteeType);
	const { groupedAreasAsOptions } = useGroupedAreas();

	useEffect(() => {
		dispatch(fetchWatsonList({ page: 1, notPaginate: true }));
	}, [dispatch]);
	const onSubmit = useCallback(
		(values: TFiltersInitialValues, { setSubmitting }) => {
			const normalizeValues = rejectNoValues(values) as TFiltersInitialValues;
			if (normalizeValues.folderNumber) {
				normalizeValues.folders = normalizeValues.folderNumber.split(";")
				delete normalizeValues.folderNumber
			}
			dispatch(actions.watsonExport.setFilters({ ...normalizeValues }));
			setSubmitting(false);
		},
		[dispatch]
	);
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting, dirty }) => (
				<form noValidate onSubmit={handleSubmit} autoComplete="off">
					<Panel title={"Buscar carga Watson"} withPadding>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField
									name="folderNumber"
									label={t("dataImport:documents.form.foldersNumber")}
									maxLength={600}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t("settings:users.form.dejurArea")}
									name="dejurAreas"
									options={groupedAreasAsOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Nome do filtro"}
									name="watsonSearchFilterId"
									options={listAsOptionsGuaranteeType}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserField label={"Solicitante"} name="userId" />
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data da solicitação de"}
											name="executiomDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField label={"Até"} name="executionDateEnd" />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean action="watsonExport" />
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit
									type="search"
									disabled={!dirty}
									submitting={isSubmitting}
								/>
							</Grid>
						</Grid>
					</Panel>
				</form>
			)}
		</Formik>
	);
};
export default Search;

