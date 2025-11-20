import { useEffect, useMemo } from "react";
import { FormControlLabel, Grid, Switch, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import Form, { SelectField, NumericField } from "src/components/form";

import {
	getItemEqualizationParameters,
	getLoadingEqualizationParameters,
	getStatusEqualizationParameters as getStatus,
} from "src/core/store/modules/equalization-parameters/selectors";
import { addEqualizationParameters, editEqualizationParameters, fetchEqualizationParametersById } from "src/core/store/modules/equalization-parameters/thunks";
import { TEqualizationParameters } from "src/core/models/equalization-parameters";
import { fillIfValue, valuesToNumber } from "src/core/utils/func";
import { useTranslation } from "src/locale/i18n";
import { useFormulaCorrectionRule, useGroupedAreas } from "src/hooks/fetchLists";
import { actions, AppDispatch } from "src/core/store";

import { CONTINGENCY_TYPE, FOLDER_STATUS, optionsFolderStatus, optionsContingencyType } from "../../constants";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const EqualizationParametersForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory();

	const { groupedAreasAsOptions} = useGroupedAreas();

	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();

	const item = useSelector(getItemEqualizationParameters);
	const isLoading = useSelector(getLoadingEqualizationParameters);
	const statusSubmit = useSelector(getStatus);

	const isNew = id === 'novo';

	const formPermission = isNew ? 'add' : item?.runEqualization ? false : 'edit';

	const initialValues: TEqualizationParameters = useMemo(() => {
		const initialValues: TEqualizationParameters = {
			areaId: '',
			folderStatus: FOLDER_STATUS.TEMPORARY_WRITE_OFF,
			contingencyType: CONTINGENCY_TYPE.PASSIVA,
			days: '',
			formulaCorrectionRuleId: '',
			isActive: true,
			runEqualization: false
		}
		return fillIfValue<TEqualizationParameters>(item, initialValues);
	}, [item])

	const onSubmit = async (values: TEqualizationParameters) => {
		const normalizedValues = valuesToNumber<TEqualizationParameters>(['days', 'formulaCorrectionRuleId'], values);
		if (isNew) {
			const { type, payload } = await dispatch(addEqualizationParameters(normalizedValues));
			if (type === "equalizationParameters/add/rejected") {
				enqueueSnackbar(payload || t('anErrorHasOcurred'), { variant: 'error' })
			} else {
				history.goBack();
			}
		}
		else {
			const { type, payload } = await dispatch(editEqualizationParameters({ ...normalizedValues, id: Number(id) }));
			if (type === "equalizationParameters/edit/rejected") {
				enqueueSnackbar(payload || t('anErrorHasOcurred'), { variant: 'error' })
			} else {
				history.goBack();
			}
		}
	};

	useEffect(() => {
		if (id && !isNew) dispatch(fetchEqualizationParametersById(Number(id)));
		return () => { dispatch(actions.equalizationParameters.clear()) };
	}, [dispatch, id, isNew]);

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
				permission={formPermission}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('settings:equalizationParameters.titleForm')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting || isLoading} disabled={!dirty} />}
							slotBottonRightPermission={formPermission}
						>
							<div className="panel-content">
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<GroupedSelectFiledMultiple
											label={t('settings:equalizationParameters.form.dejurArea')}
											name='areaId'
											options={groupedAreasAsOptions}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:equalizationParameters.form.folderStatus')}
											name='folderStatus'
											options={optionsFolderStatus}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:equalizationParameters.form.contingencyType')}
											name='contingencyType'
											options={optionsContingencyType}
											required
										/>
									</Grid>
									{values.folderStatus === FOLDER_STATUS.TEMPORARY_WRITE_OFF && (
										<Grid item md={3} xs={12}>
											<NumericField
												label={t('settings:equalizationParameters.form.daysNumber')}
												name='days'
												required
											/>
										</Grid>
									)}
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:equalizationParameters.form.monetaryUpdateRule')}
											name='formulaCorrectionRuleId'
											options={formulaCorrectionRuleAsOptions}
											required
										/>
									</Grid>
									{!isNew && (
										<Grid item md={3} xs={12} className="readonly-field">
											<Typography variant='body2' style={{ marginBottom: '4px' }}>
												{t('settings:equalizationParameters.form.runningEqualization')}
											</Typography>
											<FormControlLabel
												control={<Switch checked={values.runEqualization} color='primary' disabled />}
												label={values.runEqualization ? t('sim') : t('nao')}
											/>
										</Grid>
									)}
								</Grid>
							</div>
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	)
}

export default EqualizationParametersForm;