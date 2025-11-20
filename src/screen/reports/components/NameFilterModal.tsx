import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { actions } from 'src/core/store';
import { Submit } from 'src/components/button';
import { Grid } from '@material-ui/core';
import { SelectField, TextField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import { getHasItemReportConfiguration, getItemReportConfiguration } from 'src/core/store/modules/report-configuration/selectors';
import { useState } from 'react';

export type Props = {
	onSubmitModal: any,
}

const NameFilterModal = ({ onSubmitModal }: Props) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);
	const item = useSelector(getItemReportConfiguration);
	const hasItem = useSelector(getHasItemReportConfiguration);
	const [isPublic, setIsPublic] = useState()

	const isPublicOptions = [
		{ value: 'true', label: 'Público' },
		{ value: 'false', label: 'Privado' }
	];

	const onSubmit = ({ filterName }: { filterName: string }) => {
		onSubmitModal(filterName, isPublic === 'false' ? false : true)
		dispatch(actions.modal.close({ modalId }));
	}

	return (
		<Formik
			initialValues={{ filterName: hasItem ? item.filterName : '' }}
			onSubmit={onSubmit}>
			{({ handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container alignItems='flex-start'>
						<Grid item xs={12} md={12}>
							<TextField
								name='filterName'
								label={t('reports:filterName')}
								required
							/>
						</Grid>
						<Grid item xs={5} md={5} className='margin-top-16'>
						<SelectField 
						options={isPublicOptions} 
						name='visibility' 
						label={t('reports:isPublic')}	
						onChange={(e: any) => setIsPublic(e.target.value)}
						required					
						/>
						</Grid>
					</Grid>
					<Grid container justifyContent="flex-end" className='margin-top-16'>
						<Grid item xs={12} md={2} style={{ textAlign: 'end' }}>
							<Submit />
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	)
}

export default NameFilterModal;