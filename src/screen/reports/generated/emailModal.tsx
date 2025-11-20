import { useDispatch, useSelector } from 'react-redux';
import { Formik} from 'formik';
import { actions } from 'src/core/store';
import { Button, Submit } from 'src/components/button';
import { Box, Grid } from '@material-ui/core';
import uniqBy from "lodash/uniqBy";

import { CheckboxesAutocompleteField, TextField } from 'src/components/form';


import { useSnackbar } from 'notistack';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { useUsersActives } from "src/hooks/fetchLists";


import { sendReportByEmail } from 'src/core/store/modules/report/thunks';
import { TSendReportByEmail } from 'src/core/models/reports';
import { useMemo } from 'react';

export type Props = {
	executionId: string
}

const EmailModal = ({ executionId }: Props) => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const modalId = useSelector(getLastModalOpen);
	const {
		usersActivesAsOptionsByEmail,
	} = useUsersActives();

	const onClose = () =>  {
		dispatch(actions.modal.close({ modalId }))
	};
	
	const emailOptions = useMemo(
		() => uniqBy(usersActivesAsOptionsByEmail, "value"),
		[usersActivesAsOptionsByEmail]
	);

	const initialValues: TSendReportByEmail = {
		executionId: "",
		emailsTo: [],
		emailsCC: [],
		subject: "",
		body: ""
	}

	const onSubmit = async (values: TSendReportByEmail) => {

		const { payload } = await dispatch(sendReportByEmail({...values, executionId: executionId})) as any;

		if(payload?.status === 200){
			onClose()
			return enqueueSnackbar(
				'Email enviado com sucesso!',
				{ variant: "success" }
			);
		} else {
			return enqueueSnackbar(
				'Aconteceu um erro.',
				{ variant: "error" }
			);
		}
	} 

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			>
			{({ handleSubmit}) => (
				<form noValidate onSubmit={handleSubmit}>
	
					<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<CheckboxesAutocompleteField
							label={'Destinatário(s)'}
							options={emailOptions}
							name="emailsTo"
							required={true}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<CheckboxesAutocompleteField
							label={'Usuário(s) em cópia'}
							options={emailOptions}
							name="emailsCC"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
								label={'Assunto'}
								name="subject"
								required
							/>
					</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								label={'Corpo'}
								name="body"
								required
								multiline
							/>
						</Grid>
					<Grid container justifyContent="flex-end" >
						<Box mt={3} justifyContent="flex-start" style={{ zIndex: 9999, bottom: 2, marginTop: "20px", marginBottom: '6px' }}>
							<Button
								text="Cancelar"
								onClick={onClose}
							/>
							<Submit style={{ marginLeft: '8px' }} />
						</Box>
					</Grid>	
					</Grid>		
				</form>
			)}
		</Formik>
	)
}

export default EmailModal;