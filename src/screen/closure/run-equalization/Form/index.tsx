import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Grid, Box, Button } from '@material-ui/core';

import AccordionPanel from 'src/components/AccordionPanel';
import FieldColumn from 'src/components/FieldColumn';
import ScreenTemplate from 'src/components/Screen';

import { actions } from 'src/core/store';
import { getOptionsAsObject } from 'src/core/utils/func';
import { fetchEqualizationById } from 'src/core/store/modules/equalization/thunks';
import { getItemEqualization, getLoadingEqualization, getHasItemEqualization } from 'src/core/store/modules/equalization/selectors';
import { FOLDER_STATUS, optionsContingencyType, optionsFolderStatus } from 'src/screen/settings/constants';
import { useAreasDEJUR, useFormulaCorrectionRule } from 'src/hooks/fetchLists';
import { useTranslation } from 'src/locale/i18n';
import { useCurrentUser } from 'src/config/permissions';
import {
	getListOrderDescription,
} from 'src/core/store/modules/order-description/selectors'

import { useGenerateEqualizationReport } from '../hooks/useGenerateEqualizationReport';
import EqualizationResultList from './EqualizationResultList';

const RunEqualizationForm = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const { allowedAreasAsOptions: areasAsOptions } = useAreasDEJUR();
	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule();

	const { currentScreenPermissions } = useCurrentUser(id);
	const { generateReport, isGeneratingReport } = useGenerateEqualizationReport();
	const areasDEJURAsObject = useMemo(() => getOptionsAsObject(areasAsOptions), [areasAsOptions]);

	const item = useSelector(getItemEqualization);
	const loading = useSelector(getLoadingEqualization);
	const hasItem = useSelector(getHasItemEqualization);
	const listOrderDescription = useSelector(getListOrderDescription)

	const exportReport = () => {
		generateReport([Number(id)]);
	}

	useEffect(() => {

		dispatch(fetchEqualizationById(Number(id)));
		return () => { dispatch(actions.equalization.clear()) };

	}, [dispatch, id, listOrderDescription]);

	return (
		<ScreenTemplate>
			{loading && <CircularProgress className='margin-top-16 align-center' />}
			{!loading && hasItem && (
				<>
					<AccordionPanel title={t('closure:runEqualization.titleForm')} startExpanded>
						<Grid container spacing={2} style={{ width: '100%' }}>
							<Grid item md={3} xs={12}>
								<FieldColumn
									label={t('settings:equalizationParameters.form.dejurArea')}
									value={item.areaId}
									type='list'
									options={areasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<FieldColumn
									label={t('settings:equalizationParameters.form.folderStatus')}
									value={item.folderStatus}
									type='list'
									options={optionsFolderStatus}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<FieldColumn
									label={t('settings:equalizationParameters.form.contingencyType')}
									value={item.contingencyType}
									type='list'
									options={optionsContingencyType}
								/>
							</Grid>
							{item.folderStatus === FOLDER_STATUS.TEMPORARY_WRITE_OFF && (
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t('settings:equalizationParameters.form.daysNumber')}
										value={item.days}
									/>
								</Grid>
							)}
							<Grid item md={3} xs={12}>
								<FieldColumn
									label={t('settings:equalizationParameters.form.monetaryUpdateRule')}
									value={item.formulaCorrectionRuleId}
									options={formulaCorrectionRuleAsOptions}
									type='list'
								/>
							</Grid>
						</Grid>
					</AccordionPanel>
					<EqualizationResultList
						equalizationId={Number(id)}
						areasDEJURAsObject={areasDEJURAsObject}
						equalization
					/>
					<EqualizationResultList
						equalizationId={Number(id)}
						areasDEJURAsObject={areasDEJURAsObject}
					/>
					{currentScreenPermissions.add && (
						<Box display='flex' justifyContent='flex-end' paddingTop={3}>
							{isGeneratingReport
								? <CircularProgress />
								: (
									<Button
										color="primary"
										variant="contained"
										onClick={exportReport}
									>
										{t('closure:runEqualization.list.exportReport')}
									</Button>
								)
							}
						</Box>
					)}
				</>
			)}
		</ScreenTemplate>
	)
}

export default RunEqualizationForm;