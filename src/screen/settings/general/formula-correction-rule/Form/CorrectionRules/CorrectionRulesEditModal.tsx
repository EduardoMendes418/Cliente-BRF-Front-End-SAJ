import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Form, { TOptionsSelect } from 'src/components/form';
import { Submit } from 'src/components/button';

import { actions } from 'src/core/store';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { TCorrectionRule } from 'src/core/models/correction-rule';
import CorrectionRulesFields from './CorrectionRulesFields';

type TCorrectionRulesEditModal = {
	onSave: any;
	canEdit: boolean;
	correctionRule: TCorrectionRule;
	economicIndicesAsOptions: TOptionsSelect[];
}

const CorrectionRulesEditModal = ({ onSave, economicIndicesAsOptions, correctionRule, canEdit }: TCorrectionRulesEditModal) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const initialValues: TCorrectionRule = { ...correctionRule };

	const onSubmit = (values: TCorrectionRule) => {
		onSave(values);
		dispatch(actions.modal.close({ modalId }));
	}

	return (
		<Form initialValues={initialValues} onSubmit={onSubmit} permission={canEdit}>
			{({ handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2} alignItems='flex-start'>
						<CorrectionRulesFields economicIndicesAsOptions={economicIndicesAsOptions} isModal />
					</Grid>
					{canEdit && (
						<Grid
							container
							direction='row'
							justifyContent='flex-end'
							className='margin-top-24'
						>
							<Submit />
						</Grid>
					)}
				</form>
			)}
		</Form>
	)
}

export default CorrectionRulesEditModal;