import { useMemo, useState } from "react";
import { Button, CircularProgress, Grid, IconButton } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from "react-redux"
import { groupBy } from "ramda";
import { setNestedObjectValues } from "formik";

import Form from "src/components/form"
import Panel from "src/components/Panel"
import { useTranslation } from "src/locale/i18n"

import { TCorrectionRuleItem, TSubmitCorrectionRules } from "src/core/models/correction-rule"
import {
	getStatusCorrectionRule as getStatus,
	getErrorMessageCorrectionRule as getErrorMessage,
} from "src/core/store/modules/correction-rule/selectors";
import { TFormulaCorrectionRule } from "src/core/models/formula-correction-rule";
import { submitCorrectionRules } from "src/core/store/modules/correction-rule/thunks";
import { valuesToNumber } from "src/core/utils/func";
import { useEconomicIndices } from "src/hooks/fetchLists"
import { useRegisterDefault } from "src/hooks";

import CorrectionRulesFields from "./CorrectionRulesFields";
import CorrectionRulesList from "./CorrectionRulesList";
import { useCurrentUser } from "src/config/permissions";

type TProps = {
	formulaCorrectionRule: TFormulaCorrectionRule;
	params: string;
}

const CorrectionRules = ({ formulaCorrectionRule, params }: TProps) => {
	const [correctionRules, setCorrectionRules] = useState<TCorrectionRuleItem[]>(formulaCorrectionRule.correctionRules ?? []);

	const { t } = useTranslation();
	const dispatch = useDispatch();

	const statusSubmit = useSelector(getStatus)

	const { economicIndicesAsOptions } = useEconomicIndices();
	const { currentScreenPermissions } = useCurrentUser(params);

	useRegisterDefault({
		action: 'correctionRule',
		getStatus,
		getErrorMessage,
	})

	const initialValues: TCorrectionRuleItem = {
		economicIndicesId: '',
		correctionStart: null,
		correctionEnd: null,
		feesStart: null,
		feesEnd: null,
		feesValue: 0,
		fineType: '',
		fineValue: null,
		formulaCorrectionRuleId: Number(formulaCorrectionRule.id),
	}

	const onAdd = async (formikHelper: any) => {
		const validationErrors = await formikHelper.validateForm();
		if (Object.keys(validationErrors).length > 0) {
			formikHelper.setTouched(setNestedObjectValues(validationErrors, true));
			return;
		}

		const id = (correctionRules[correctionRules.length - 1]?.id ?? 0) + 1;
		const normalizedValues = { ...formikHelper.values, id, submitAction: 'add' } as TCorrectionRuleItem;
		setCorrectionRules([...correctionRules, normalizedValues]);
		formikHelper.resetForm();
	}

	const onEdit = (values: TCorrectionRuleItem) => {
		const items = [...correctionRules];
		const index = correctionRules.findIndex(item => item.id === values.id);

		items[index] = { ...values, submitAction: !values.submitAction ? 'edit' : values.submitAction };

		setCorrectionRules(items);
	}

	const onDelete = (values: TCorrectionRuleItem) => {
		if (values.submitAction === 'add')
			setCorrectionRules([...correctionRules.filter(item => item.id !== values.id)]);
		else {
			const items = [...correctionRules];
			const index = correctionRules.findIndex(item => item.id === values.id);

			items[index] = { ...values, submitAction: 'delete' };

			setCorrectionRules(items);
		}
	}

	const onSubmit = () => {
		const correctionRulesToSubmit = correctionRules
			.filter(({ submitAction }) => submitAction)
			.map(({ index, fineTypeName, ...item }: any) => valuesToNumber<TCorrectionRuleItem>(['feesValue', 'fineValue'], item))

		const groupedItems = groupBy(
			({ submitAction }) => {
				return submitAction === 'add' ? 'itemsToAdd' :
					submitAction === 'edit' ? 'itemsToEdit' : 'itemsToDelete'
			},
			correctionRulesToSubmit) as TSubmitCorrectionRules;

		dispatch(submitCorrectionRules(groupedItems));
	}

	const isSaveBtnEnabled = useMemo(() => !!correctionRules.find(({ submitAction }) => submitAction), [correctionRules])

	return (
		<Form initialValues={initialValues} onSubmit={() => { }} permission={currentScreenPermissions.add}>
			{formikHelper => (
				<form noValidate>
					<Panel
						title={t('settings:formulaCorrectionRule.form.correctionRule')}
						slotBottomRight={statusSubmit === 'saving'
							? <CircularProgress />
							: (
								<Button
									color="primary"
									type="button"
									variant={!isSaveBtnEnabled ? undefined : "contained"}
									disabled={!isSaveBtnEnabled}
									onClick={() => onSubmit()}
								>
									{t('btnSalvarEdicao')}
								</Button>
							)}
						slotBottonRightPermission
						withPadding
					>
						<Grid container spacing={2}>
							{currentScreenPermissions.add && (
								<>
									<CorrectionRulesFields economicIndicesAsOptions={economicIndicesAsOptions} />
									<Grid item md={2} xs={12}>
										<IconButton type="button" color="primary" onClick={() => onAdd(formikHelper)}>
											<AddIcon />
										</IconButton>
									</Grid>
								</>
							)}
							<CorrectionRulesList
								economicIndicesAsOptions={economicIndicesAsOptions}
								correctionRules={correctionRules}
								onEdit={onEdit}
								onDelete={onDelete}
								canEdit={currentScreenPermissions.edit}
							/>
						</Grid>
					</Panel>
				</form>
			)}
		</Form>
	)
}

export default CorrectionRules;