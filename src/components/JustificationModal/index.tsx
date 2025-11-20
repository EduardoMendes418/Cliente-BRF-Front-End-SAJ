import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import moment from 'moment';

import { DateField, SelectField, TextField } from 'src/components/form';
import { Submit } from 'src/components/button';
import { t } from 'src/locale/i18n';

import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { useEvaluationReasons } from 'src/hooks/fetchLists';
import { actions } from 'src/core/store';

type TJustificationModal = {
	onSubmitJustification: any;
	hasDueDate?: boolean;
	reason?: 'rejected' | 'returned' | 'reversed' | 'cancelled';
	moduloId: number
	reasonType?: number 
}

export type TForm = {
	observation?: string | undefined;
	justification: string;
	dueDate?: string | null,
	rejectionAndReturnReasonsId?: number | '';
	statusApprovalId?: number;
	statusFlowId?: number;
	logs?: any;
}

const JustificationModal = ({ onSubmitJustification, hasDueDate = false, reason, moduloId, reasonType }: TJustificationModal) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const {	reasons } = useEvaluationReasons(moduloId, reasonType);

	const onSubmit = (values: TForm) => {
		onSubmitJustification(values);
		dispatch(actions.modal.close({ modalId }));
	}

	const initialValues: TForm = {
		justification: '',
		dueDate: null,
		rejectionAndReturnReasonsId: ''
	}

	return (
		<Formik	initialValues={initialValues} onSubmit={onSubmit}>
			{({ handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2} alignItems='flex-start'>
						{hasDueDate && (
							<Grid item xs={12} md={6}>
								<DateField
									name='dueDate'
									label={t('form.deadline')}
									minDate={moment()}
								/>
							</Grid>
						)}
						{reason && (
							<Grid item xs={12} md={6}>
								<SelectField
									name='rejectionAndReturnReasonsId'
									label={t('justification.reason')}
									options={reasons[reason]}
								/>
							</Grid>
						)}
						<Grid item xs={12} md={12}>
							<TextField
								name='justification'
								label={t('goodsAndGuarantees:justification')}
								placeholder={t('form.typeHere')}
								rows={5}
								maxLength={10000}
								multiline
							/>
						</Grid>
					</Grid>
					<Grid
						container
						direction='row'
						justifyContent='flex-end'
						className='margin-top-24'
					>
						<Submit />
					</Grid>
				</form>
			)}
		</Formik>
	)
}

export default JustificationModal;