import {MutableRefObject, useCallback, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";

import Panel from "src/components/Panel";
import {
	DateField,
	SelectField,
	TextField,
} from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { useTranslation } from "src/locale/i18n";

import { actions } from "src/core/store";

import { fetchAreas } from "src/core/store/modules/areas/thunks";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";

import { moduleToProcessAsOptions, statusAsOptions } from "./options";


type TExecutionMonitorForm = {
	loading?: boolean;
	formRef?: MutableRefObject<any>;
	setRequest: any;
}

const Search = ({ loading, formRef, setRequest }: TExecutionMonitorForm) => {

	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		location: { pathname },
	} = useHistory();

	const cleanList = useCallback(() => {
		setRequest(formRef?.current?.initialValues)
		dispatch(actions.dataImport.clear())
		dispatch(actions.pagination.clear())
	
	}, [dispatch])
	
	useEffect(() => {
		dispatch(fetchAreas(1));
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
		cleanList()
	}, [dispatch, cleanList]);

	const initialValues: any = {
		FileName: '',
		ModuleToProcess: null,
		ProcessDateStart: null,
		ProcessDateEnd: null,
		Status: null
	};

	return (
		<Panel title={"Filtro de monitor de execução"} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={setRequest}
				enableReinitialize
				innerRef={formRef}
			>
				{({ handleSubmit, isSubmitting }) => {
					return (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
								name="FileName"
								label={t("dataImport:executionMonitor.form.fileName")}
								maxLength={5000}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
									<SelectField
										label={t("dataImport:executionMonitor.form.moduleToProcess")}
										name="ModuleToProcess"
										options={moduleToProcessAsOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<Grid container spacing={3}>
										<Grid item xs={6} md={6}>
											<DateField
												name="ProcessDateStart"
												label={t("dataImport:executionMonitor.form.startDate")}
											/>
										</Grid>
										<Grid item xs={6} md={6}>
											<DateField
												name="ProcessDateEnd"
												label={t("dataImport:executionMonitor.form.endDate")}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("dataImport:executionMonitor.form.status")}
										name="Status"
										options={statusAsOptions}
									/>
								</Grid>
								
							</Grid>
							<Grid container spacing={2} alignItems="center">
								<Grid item md={6} xs={6}>
									<Clean action="dataImport" page={pathname} onClick={cleanList} />
								</Grid>
								<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
									<Submit type="search" submitting={loading || isSubmitting} />
								</Grid>

							</Grid>
						</form>
					);
				}}
			</Formik>
		</Panel>
	);
};

export default Search;
