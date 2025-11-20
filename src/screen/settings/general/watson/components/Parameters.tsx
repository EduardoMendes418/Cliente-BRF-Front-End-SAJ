import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'src/locale/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { SelectField, TOptionsSelect } from 'src/components/form';
import { Formik } from 'formik';
import { Grid, Box } from '@material-ui/core';
import { SwitchField } from 'src/components/form';
import { fetchOrderDescriptions } from "src/core/store/modules/order-description/thunks"

import { fillIfValue } from "src/core/utils/func";
import {
	getItemSettingsWatson,
	getStatusSettingsWatson,
} from 'src/core/store/modules/watson-settings/selector';
import { getWatsonSettings, addWatsonSettings } from 'src/core/store/modules/watson-settings/thunks';
import { actions } from 'src/core/store';
import { TWatsonParameters } from 'src/core/models/watson';
import { Submit } from 'src/components/button';
import { useFormulaCorrectionRule, useGroupedAreas } from 'src/hooks/fetchLists'
import { fetchAreasWitchGroups } from 'src/core/store/modules/areas/thunks';
import { getListAsOptionsOrderDescription } from "src/core/store/modules/order-description/selectors"
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { StyledP } from './styled';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const Parameters = ({isNew, id}: {isNew: boolean, id?: number}) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const item = useSelector(getItemSettingsWatson);
	const loading = useSelector(getStatusSettingsWatson);
	const { groupedAreasAsOptions} = useGroupedAreas();

	const modalId = useSelector(getLastModalOpen);

	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule()
	const orderDescriptionOptions = useSelector(getListAsOptionsOrderDescription)
	const onClose = () =>  dispatch(actions.modal.close({ modalId }));


	const fetchList = useCallback(() => {
		dispatch(fetchAreasWitchGroups())
		dispatch(fetchOrderDescriptions({ notPaginate: true, isActive: true }));
		if (!isNew) {
			dispatch(getWatsonSettings(id ?? 0))
		}
	}, [dispatch, id, isNew]);

	useEffect(() => {
		fetchList()
	}, [fetchList]);
	
	const initialValues: TWatsonParameters = useMemo(() => {
		const initialValues: TWatsonParameters = {
			id: '',
			generateWatsonLoad: true,
			updateLegalOne: true,
			areaDejurId: "",
			orderDescriptionId: "",
			formulaCorrectionRuleId: "",
			isActive: true,
		}
		if (isNew) {
			return initialValues
		}
		return fillIfValue<TWatsonParameters>(item, initialValues);
	}, [item, isNew])

	const submit = (
		values: TWatsonParameters
	) => {
		if (isNew)
			dispatch(addWatsonSettings({...values, id:0}))
		dispatch(addWatsonSettings({...values}))
		
		onClose()
	}

	return <Formik
		initialValues={initialValues}
		onSubmit={submit}
		enableReinitialize
	>
		{({ handleSubmit, values }) => <form noValidate onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					<Grid item md={3} xs={12}>
						<GroupedSelectFiledMultiple
							name="areaDejurId"
							label={t('form.legalDepartmentArea')}
							options={groupedAreasAsOptions}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={`${t('provisions:fields.requestDescription')}`}
							name="orderDescriptionId"
							options={orderDescriptionOptions.filter((item) => values.areaDejurId === item.areaId)}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={`${t('provisions:fields.correctionIndex')}`}
							name="formulaCorrectionRuleId"
							options={formulaCorrectionRuleAsOptions}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<StyledP>
							<SwitchField
								name={`generateWatsonLoad`}
							/>
							{t('settings:watson.RunningWatsonLoad')}
						</StyledP>
					</Grid>
				</Grid>
				<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
					<Submit submitting={loading === 'fetching'} />
				</Box>

		</form>}
	</Formik>
}
export default Parameters