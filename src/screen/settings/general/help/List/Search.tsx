import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import { TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import Panel from "src/components/Panel";

import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { getLoadingHelpFiles } from "src/core/store/modules/HelpFiles/selectors";
import { useTranslation } from "src/locale/i18n";
import { useState } from "react";


const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingHelpFiles);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const onSubmit = (values: any) => {
		setIsSubmitting(true)
		const filters = rejectNoValues(values);
		dispatch(actions.helpFiles.setFilters(filters));
		setIsSubmitting(false)
	};

	const initialValues: any = {
		search: "",
	};

	return (
		<Panel title={"Buscar da gestão de conhecimento"} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("settings:helpFiles.form.documentName")}
									name="search"
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean action="helpFiles" />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
