import { Grid } from "@material-ui/core"
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

import { Submit } from "src/components/button";
import Form, { TextField } from "src/components/form"
import Panel from "src/components/Panel"
import { AppDispatch } from "src/core/store";

import {
	getStatusFormulaCorrectionRule as getStatus,
	getErrorMessageFormulaCorrectionRule as getErrorMessage,
} from "src/core/store/modules/formula-correction-rule/selectors";
import { addFormulaCorrectionRule, editFormulaCorrectionRule } from "src/core/store/modules/formula-correction-rule/thunks";
import { useRegisterDefault } from "src/hooks";
import { useTranslation } from "src/locale/i18n";

type TProps = {
	isNew: boolean;
	formulaName: string;
	id: string;
}

const FormulaForm = ({ isNew, formulaName, id }: TProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();

	const statusSubmit = useSelector(getStatus);

	useRegisterDefault({
		action: 'formulaCorrectionRule',
		getStatus,
		getErrorMessage,
		route: 'noRedirect',
	});

	const onSubmit = async (values: { formulaName: string }) => {
		const request = () => isNew
			? dispatch(addFormulaCorrectionRule({ formulaName: values.formulaName, status: true }))
			: dispatch(editFormulaCorrectionRule({ formulaName: values.formulaName, id: Number(id), status: true }))

		const { meta, payload } = await request()
		if (meta.requestStatus === 'rejected')
			enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), { variant: 'error' })
	}

	return (
		<Form initialValues={{ formulaName }} onSubmit={onSubmit}>
			{({ dirty, handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel
						title={isNew ? t('settings:formulaCorrectionRule.titleForm') : t('settings:formulaCorrectionRule.form.formula')}
						slotBottomRight={<Submit submitting={statusSubmit === 'saving'} isNew={isNew} disabled={!dirty} />}
						slotBottonRightPermission='add'
						withPadding
					>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('settings:formulaCorrectionRule.form.formulaName')}
									name='formulaName'
								/>
							</Grid>
						</Grid>
					</Panel>
				</form>
			)}
		</Form>
	)
}

export default FormulaForm;