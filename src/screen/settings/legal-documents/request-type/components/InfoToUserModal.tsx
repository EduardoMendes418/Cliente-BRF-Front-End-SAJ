import { Formik } from 'formik'
import { Box } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';

import TextField from 'src/components/form/TextField'
import { Submit, Button } from 'src/components/button'
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { actions } from 'src/core/store';
import { useMemo } from 'react';

type Form = {
	info: string
}

const defaultValues: Form = {
	info: ''
}

type InfoToUserModalProps = {
	initialValue: string
	onSubmit: (info: string) => void
}

export default function InfoToUserModal({ initialValue, onSubmit }: InfoToUserModalProps) {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const onClose = () =>  dispatch(actions.modal.close({ modalId }));
	const justify = ({ info }: Form) => {
		onSubmit(info)
		onClose()
	}

	const initialValues = useMemo(() => initialValue ? { info: initialValue } : defaultValues, [initialValue])

	return (
		<Formik initialValues={initialValues} onSubmit={justify}>
			{({ handleSubmit }) => {
				return (
					<form noValidate onSubmit={handleSubmit}>
						<TextField
							multiline
							unlimitedLength
							minRows={5}
							name='info'
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
				)
			}}
		</Formik>
	)
}
