import { Formik} from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Panel from 'src/components/Panel';
import { actions } from 'src/core/store';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { Box, Grid } from '@material-ui/core';
import { Button, Submit } from 'src/components/button';
import { TextField } from 'src/components/form';
import { editCircularizationOfficeLaunch } from 'src/core/store/modules/circularizationOfficeLaunch/thunks';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

export type Props = {
	onSubmitModal?: any;
	data?: any;
	relist?: any;
	selectableTable: any;
}

const ApprovalModal = ({ data, relist, selectableTable }: Props) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);
	const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();


const onClose = () =>  {
		relist()
		dispatch(actions.modal.close({ modalId }))
	};


const onSubmit = async (values: any) => {
	setIsSubmiting(true)

	let valuesToSend = {
		circularizationOfficeLaunchIds: selectableTable.selectedItems,
		observation: values.Observation,
		isFolderOfficeResponsibility: true,
		statusFlowId: 1,
		phaseId: null,
		themeObject: null,
		summaryProcessStatus: null,
		foundationOfProbability: null,
		totalRemote: null,
		totalPossible: null,
		totalProbably: null,
		orderDescriptionId: null
	}

	if(data !== undefined){
		valuesToSend = {
			...valuesToSend,
			circularizationOfficeLaunchIds: [data.id]
		}
	}

	const {payload} = await dispatch(editCircularizationOfficeLaunch(valuesToSend)) as any;  
	 
	if(payload?.status === 204){
		relist();
		selectableTable.unselectAllItems();
				return (
				enqueueSnackbar("Lançamento aprovado com sucesso", {
					variant: 'success',
				}),
				dispatch(actions.modal.close({ modalId }))
				)
	} else {
		return enqueueSnackbar("Ocorreu um erro", { variant: 'error', }), dispatch(actions.modal.close({ modalId }))
	}  
}

const initialValues: any = {
	Observation: ''
}

	return ( 
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			>
		{({ handleSubmit }) => (	
			<form noValidate onSubmit={handleSubmit}>
				<Panel title={"Aprovação"} withPadding>
					<Grid item md={12} xs={12} style={{marginBottom: 30}}> 
						<TextField
							rows={3} 
							unlimitedLength 
							label={"Observação"}
							name="Observation"
							multiline
						/>
					</Grid>
				<Grid container justifyContent="flex-end" >
						<Box mt={3} justifyContent="flex-start" style={{position: "absolute", zIndex: 9999, bottom: 2, marginTop: "20px", marginBottom: '6px' }}>
							<Button
								text="Cancelar"
								onClick={onClose}
							/>
							<Submit submitting={isSubmiting} style={{ marginLeft: '8px' }} />
						</Box>
					</Grid>	
				</Panel>
			</form>
)}
			</Formik>

	)
}

export default ApprovalModal;