import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useFormikContext } from "formik";
import { useParams } from 'react-router-dom';

import { t } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { FormikContext } from 'src/components/form';
import { fetchESocialAreasListById } from 'src/core/store/modules/e-social-areas/thunks';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const DejurZonePanel = () => {
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';

	const dispatch = useDispatch();

	const { groupedAreasAsOptions } = useGroupedAreas();

	const { handleSubmit, setFieldValue, isSubmitting, dirty } = useFormikContext<FormikContext>();

	const handleUpdateForm = async () => {
		// @ts-ignore eslint-disable-next-line
		const { payload } = await dispatch(fetchESocialAreasListById({ id }));
		setFieldValue('id', payload?.id);
		setFieldValue('areaId', payload?.areaId);
		setFieldValue('isActive', payload?.isActive);
	};

	useEffect(() => {
		if(!isNew) handleUpdateForm();
	}, []);

	return (
		<form noValidate onSubmit={handleSubmit}>
			<Panel title={ isNew === true ? t('settings:eSocialArea.title') :  t('settings:eSocialArea.editTitle')} 
				withPadding
				slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
				slotBottonRightPermission={isNew ? 'add' : 'edit'}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={3} spacing={3}>
						<GroupedSelectFiledMultiple
							label={t('closure:runEqualization.list.dejurArea')}
							name="areaId"
							options={groupedAreasAsOptions}
							required
						/>
					</Grid>
				</Grid>
			</Panel>
		</form>
	);
};

export default DejurZonePanel;
