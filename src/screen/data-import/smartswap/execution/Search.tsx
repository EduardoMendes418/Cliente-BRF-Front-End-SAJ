import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import Panel from "src/components/Panel";
import { SelectField, TOptionsSelect, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { useTranslation } from "src/locale/i18n";
import { actions } from "src/core/store";
import { SmartSwapChangesParameters, StatusExecutionSmartSwap } from "src/core/models/smart-swap-execution";
import { getListProcessSmartSwapExecution, getListStatusSmartSwapExecution } from "src/core/store/modules/smart-swap-execution/selectors";

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const execution = useSelector(getListStatusSmartSwapExecution) as StatusExecutionSmartSwap[]
	const process = useSelector(getListProcessSmartSwapExecution) as StatusExecutionSmartSwap[]


	const onSubmit = (values: SmartSwapChangesParameters, { setSubmitting }: any) => {
		setSubmitting(true);
		dispatch(actions.smartSwapExecution.setFilters({ ...values }));
		setSubmitting(false);
	};

	const initialValues = {
		folderNumber: "",
		statusExecutionSmartSwapProcess: null,
		statusExecutionSmartSwap: null,

	} as SmartSwapChangesParameters;

	return (
		<Panel title={t("inspection:resquest.filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField name="Pasta/CTG" label={"Pasta/CTG"} />
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="statusExecutionSmartSwap"
									label={"Status do execução"}
									options={execution.map((item:StatusExecutionSmartSwap): TOptionsSelect => ({ label: item.value, value: item.key })) as TOptionsSelect[]}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="statusExecutionSmartSwapProcess"
									label={"Status do processo"}
									options={process.map((item:StatusExecutionSmartSwap): TOptionsSelect => ({ label: item.value, value: item.key })) as TOptionsSelect[]}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean action="smartSwapExecution" />
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit type="search" disabled={!dirty} />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
