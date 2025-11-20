import { Box, Button, Grid } from "@material-ui/core";
import { Formik } from "formik";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Submit from "src/components/button/Submit";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import TableComponent, { ColumnData } from "src/components/Table";
import { TIntegrationsRequestForm } from "src/core/models/integrations";
import {
	getIntegrationsResult,
	getLoadingStatus,
} from "src/core/store/modules/integrations/selectors";
import {
	integrateCnpj,
	integrateCpf,
} from "src/core/store/modules/integrations/thunks";
import { t } from "src/locale/i18n";
import CnpjMultipleItems from "../components/CnpjMultipleItems";
import CpfMultipleItems from "../components/CpfMultipleItems";
import FoldersMultipleItems from "../components/FoldersMultipleItems";
import {actions} from 'src/core/store'

const initialValues: TIntegrationsRequestForm = {
	cnpjs: [],
	cpf: [],
	folderNumbers: [],
};

const validate = (items: TIntegrationsRequestForm) => {
	if (items.cpf.length > 0 && items.folderNumbers.length === 0)
		return { folderNumbers: "Pasta CTG necessária para busca por cpf" };
	return {};
};

const columns: ColumnData[] = [
	{
		label: t("integrations:request.table.cpfCnpj"),
		field: "cpfcnpj",
	},
	{
		label: t("integrations:request.table.status"),
		field: "message",
	},
];

const IntegrationsRequest: React.FC = () => {
	const result = useSelector(getIntegrationsResult);
	const loading = useSelector(getLoadingStatus);
	const dispatch = useDispatch();

	const submitHandler = useCallback(
		async (form: TIntegrationsRequestForm) => {
			if (form.cnpjs.length > 0) {
				await dispatch(integrateCnpj(form));
			}
			if (form.cpf.length > 0) {
				await dispatch(integrateCpf(form));
			}
		},
		[dispatch]
	);

	const cleanButtonHandler = useCallback(() => {
		dispatch(actions.integrations.cleanList())
	}, [dispatch])

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={submitHandler}
				validate={validate}
				enableReinitialize
			>
				{({ handleSubmit, isValid, dirty, isSubmitting }) => (
					<form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Panel title={t("integrations:request.pageName")} withPadding>
							<Grid container spacing={3}>
								<FoldersMultipleItems />
								<CpfMultipleItems />
								<CnpjMultipleItems />
							</Grid>
							<Box display="flex" justifyContent="flex-end" mt={3}>			
								<Submit
									submitting={isSubmitting}
									disabled={!isValid || !dirty}
									text={t("integrations:request.form.submitButton")}
								/>
							</Box>
						</Panel>
						<Panel title={t("integrations:request.table.tableName")}>
							<TableComponent rows={result} columns={columns} isLoading={loading} />
							<Box display="flex" justifyContent="flex-end" mt={0}>
							<Button
								color="primary"
								onClick={cleanButtonHandler}
							>
								{t('integrations:request.form.cleanButton')}
							</Button>
							</Box>
						</Panel>
					</form>
				)}
			</Formik>
		</ScreenTemplate>
	);
};

export default IntegrationsRequest;
