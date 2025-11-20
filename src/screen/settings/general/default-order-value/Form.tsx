import { useEffect, useMemo, useState } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import Form, { SelectField, CurrencyField } from "src/components/form";
import {
	getItemCivilMass,
	getLoadingCivilMass,
	getStatusCivilMass as getStatus,
	getErrorMessageCivilMass as getErrorMessage
} from "src/core/store/modules/civil-mass/selectors";
import { addCivilMass, editCivilMass, fetchCivilMassById } from "src/core/store/modules/civil-mass/thunks";
import useProvisionFilterOptions from "src/hooks/useProvisionFilterOptions";
import { useFormulaCorrectionRule, useGroupedAreas } from "src/hooks/fetchLists";
import { useRegisterDefault } from 'src/hooks';
import { fillIfValue, valuesToNumber } from "src/core/utils/func";
import { TCivilMass } from "src/core/models/civil-mass";
import { useTranslation } from "src/locale/i18n";
import { actions } from "src/core/store";

import { optionsCivilMassFolderStatus } from "../../constants";
import { getListAsOptionsOrderDescription } from "src/core/store/modules/order-description/selectors";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const CivilMassForm = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const item = useSelector(getItemCivilMass);
	const isLoading = useSelector(getLoadingCivilMass);
	const statusSubmit = useSelector(getStatus);

	const [currentAreaId, setCurrentAreaId] = useState(item?.dejurArea as number | undefined);

	const { groupedAreasAsOptions} = useGroupedAreas();

	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();
	const orderDescriptionOptionsSelect = useSelector(getListAsOptionsOrderDescription)

	const {
		orderDescriptionOptions,
		orderProbabilityOptions,
		orderRatingDescriptionOptions
	} = useProvisionFilterOptions(currentAreaId)

	useRegisterDefault({
		action: 'civilMass',
		getStatus,
		getErrorMessage,
	});

	const isNew = id === 'novo';

	const initialValues: TCivilMass = useMemo(() => {
		const initialValues: TCivilMass = {
			name: '',
			value: 0,
			folderStatus: '',
			dejurArea: '',
			isActive: true,
			orderDescriptionId: '',
			orderProbabilityId: '',
			orderRatingDescriptionId: '',
			formulaCorrectionRuleId: '',
		}

		return fillIfValue<TCivilMass>(item, initialValues);
	}, [item])

	const onSubmit = (values: TCivilMass) => {
		const normalizedValues = valuesToNumber<TCivilMass>(['value'], values);
		if (isNew) dispatch(addCivilMass(normalizedValues));
		else dispatch(editCivilMass({ ...normalizedValues, id: Number(id) }));
	};

	useEffect(() => {
		if (id && !isNew) dispatch(fetchCivilMassById(Number(id)));
		return () => { dispatch(actions.civilMass.clear()) };
	}, [dispatch, id, isNew]);

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting, setFieldValue, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('settings:defaultOrderValue.titleForm')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting || isLoading} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
						>
							<div className="panel-content">
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<GroupedSelectFiledMultiple
											label={t('settings:defaultOrderValue.form.dejurArea')}
											name='dejurArea'
											options={groupedAreasAsOptions}
											required
											onChange={(e: any) => {
												const areaId = e.target.value
												setCurrentAreaId(areaId)
												if (!orderDescriptionOptions.some(od => od.areaId === values.orderDescriptionId))
													setFieldValue('orderDescriptionId', '')
											}}

										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:defaultOrderValue.form.folderStatus')}
											name='folderStatus'
											options={optionsCivilMassFolderStatus}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:defaultOrderValue.form.orderDescription')}
											options={orderDescriptionOptionsSelect.filter(({areaId}) => values.dejurArea === areaId)}
											name="orderDescriptionId"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:defaultOrderValue.form.probability')}
											options={orderProbabilityOptions}
											name="orderProbabilityId"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:defaultOrderValue.form.orderRatingDescription')}
											name="orderRatingDescriptionId"
											options={orderRatingDescriptionOptions}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											label={t('settings:defaultOrderValue.form.provisionAmount')}
											name='value'
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t('settings:defaultOrderValue.form.CorrectionFormulaAndRule')}
											name="formulaCorrectionRuleId"
											options={formulaCorrectionRuleAsOptions}
											required
										/>
									</Grid>
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

export default CivilMassForm;
