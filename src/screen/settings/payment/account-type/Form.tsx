import { FormikHelpers } from 'formik';
import Grid from '@material-ui/core/Grid';

import Form, { TextField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLoadingPaymentMethod } from 'src/core/store/modules/payment-method/selectors';
import { AppDispatch } from 'src/core/store';
import { addPaymentAccountType, editPaymentAccountType, fetchPaymentAccountTypeById } from 'src/core/store/modules/payment-account-type/thunks';
import { TPaymentAccountType } from 'src/core/models/payment-account-type';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const TipoDeContaForm = () => {

	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const [paymentAccountType, setPaymentAccountType] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	
	const isFetching = useSelector(getLoadingPaymentMethod);

	const isNew = id === 'novo';

	const initialValues = {
		description:  paymentAccountType?.description ?? "",
		code: paymentAccountType?.code ?? "",
	};

	const onSubmit = async (
		value: any,
		{ setSubmitting }: FormikHelpers<TPaymentAccountType>,
	) => {
		 if (isNew) {
			const { payload, meta } = await dispatch(addPaymentAccountType({...value, isActive: true}));
			if(meta?.requestStatus === 'fulfilled'){
				history.goBack();
				return enqueueSnackbar("Tipo de conta registrado com sucesso!", {
					variant: "success",
				});
			} else {
				return enqueueSnackbar(`${payload.error.detail}`, {
					variant: "error",
				});
			}
		} else {
			const { payload, meta } = await dispatch(editPaymentAccountType({...value, isActive: paymentAccountType?.isActive, id: Number(id)}));
			if(meta?.requestStatus === 'fulfilled'){
				history.goBack();
				return enqueueSnackbar("Tipo de conta editado com sucesso!", {
					variant: "success",
				});
			} else {
				return enqueueSnackbar(`${payload.error.detail}`, {
					variant: "error",
				});
			}
		} 
	};

	const getPaymentAccount = async () => {
		const { payload } = await dispatch(fetchPaymentAccountTypeById(Number(id))) as any; 
		setPaymentAccountType(payload);
    }
	
	useEffect(() => {
		   if(isNew === false){
			getPaymentAccount();
		 } 
	  }, [])

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={ isNew ? 'Cadastro de tipo de conta' : 'Editar tipo de conta'}
							slotBottomRight={<Submit isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{!isFetching && (
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<TextField
											label={"Código"}
											name='code'
											maxLength={10}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											label={"Descrição"}
											name='description'
											maxLength={60}
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default TipoDeContaForm;
