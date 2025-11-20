import { Formik } from 'formik'
import { Box } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';

import TextField from 'src/components/form/TextField'
import { Submit, Button } from 'src/components/button'
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { actions } from 'src/core/store';

type Form = {
	justification: string
}

const initialValues: Form = {
	justification: ''
}

type JustificationModalProps = {
	id?: number
	assessmentStatus: boolean,
	onSubmit: ((approvationStatus: boolean, reason: string) => void)
		| ((approvationStatus: boolean, reason: string, id: number) => void)
}

export default function JustificationModal({ assessmentStatus, id, onSubmit }: JustificationModalProps) {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const onClose = () =>  dispatch(actions.modal.close({ modalId }));
	const justify = ({ justification }: Form) => {
		onSubmit(assessmentStatus, justification, id!)
		onClose()
	}


	return (
		<Formik initialValues={initialValues} onSubmit={justify}>
			{({ handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit}>
					<TextField
						multiline
						rows={5}
						name='justification'
						label="Motivo"
					/>
					<Box mt={3} display="flex" justifyContent="flex-end">
						<Button
							text="Cancelar"
							onClick={onClose}
						/>
						<Submit style={{ marginLeft: '8px' }} text="Salvar" />
					</Box>
				</form>
			)}
		</Formik>
	)
}
