import { Formik } from 'formik'
import { Box } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';

import TextField from 'src/components/form/TextField'
import { Submit, Button } from 'src/components/button'
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { actions } from 'src/core/store';
import { cancelPayment } from 'src/core/store/modules/approvation-flow-management/thunks';
import { useSnackbar } from 'notistack';

type Form = {
	observation: string
}

const initialValues: Form = {
	observation: ''
}

const CancelModal = ({row}: any) => {

	const dispatch = useDispatch();
	
	const { enqueueSnackbar } = useSnackbar();
	const modalId = useSelector(getLastModalOpen);

	const onClose = () =>  {
		dispatch(actions.modal.close({ modalId }))
	};

	const justify = async ({ observation }: Form) => {
		
		const {payload, type} = await dispatch(cancelPayment({ id: row.id, observation })) as any; 
	
		if("approvationFlowManagement/cancel/rejected".match(type)){
			dispatch(actions.modal.close({ modalId }))
			return  enqueueSnackbar(`${payload?.detail}`, {
				variant: "error",
			})
		} else {
			dispatch(actions.modal.close({ modalId }))
			return  enqueueSnackbar("Contabilização cancelada com sucesso", {
				variant: "success",
			})
		}
		
	}

	return (
		<Formik initialValues={initialValues} onSubmit={justify}>
			{({ handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit}>
					<TextField
						multiline
						rows={8}
						name='observation'
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

export default CancelModal;