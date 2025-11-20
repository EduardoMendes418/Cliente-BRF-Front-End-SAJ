import ScreenTemplate from 'src/components/Screen';
import { Grid } from '@material-ui/core';
import Form, { SelectField, TextField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import * as yup from 'yup';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { fetchESocialTables } from 'src/core/store/modules/e-social-tables/thunks';
import { addESocialRegistrationTable, editESocialRegistrationTable, fetchESocialRegistrationTableById } from 'src/core/store/modules/e-social-registration-table/thunks';


 const validationSchema = yup.object({
	code: yup
		.number()
		.min(0, t('required'))
		.required(t('required')).typeError('O valor deve ser um número.')
});
 
const ESocialRegistrationTableForm = () => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [registrationData, setRegistrationData] = useState<any>();
	const [eSocialTablesAsOption, setESocialTablesAsOption] = useState<any>();
	
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues = {
		eSocialTableId: registrationData?.eSocialTableId ??  "",
		code: registrationData?.code ??  "",
		description: registrationData?.description ??  "",
	};

	const onSubmit = async (values: any) => {
		   if(isNew === false){
			 const { payload } = await dispatch(editESocialRegistrationTable({id: registrationData?.id, eSocialTableId: values.eSocialTableId, code: values.code, description: values.description, status: registrationData?.status})) as any;

			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Cadastro editado com sucesso!", {
					variant: "success",
				});
			} 
		} else {
			const { payload } = await dispatch(addESocialRegistrationTable({...values, status: true})) as any;
			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			if(payload.status === 201){
				history.goBack();
				return enqueueSnackbar("Tabela registrada com sucesso!", {
					variant: "success",
				});
			} 
		}   
	}

	const getRegistrationTable = async () => {
		 const { payload } = await dispatch(fetchESocialRegistrationTableById(id)) as any;
		setRegistrationData(payload);
	}  

	 const getTablesOptions = async () => {
		const {payload} = await dispatch(fetchESocialTables({ page: 1, pageSize: 90})) as any
		setESocialTablesAsOption(payload.items?.map((x: any) => { 
			return {
			value: x.id,
			label: `${x.eSocialTableNumber} - ${x.description}`
		}}))
	}  

	 useEffect(() => {
		getTablesOptions();
		   if(isNew === false){
			getRegistrationTable();
		 } 
	
	  }, [])  

	return (
		<ScreenTemplate>
			 <Form
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			>
				{
					({handleSubmit, isSubmitting, dirty}) => (
						<form noValidate onSubmit={handleSubmit}>
							<Panel title={ isNew === true ? t('eSocial:eSocialTablesRegistration.form.title') : t('eSocial:eSocialTablesRegistration.editTitle')} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							 <Grid container spacing={2}>
								 <Grid item md={3} xs={12}>
									<SelectField 
										label={t('eSocial:reasonsForDismissal.filter.eSocialTableId')} 
										name='eSocialTableId'
										options={eSocialTablesAsOption ?? []}
										required
									/>
								</Grid> 
							<Grid item md={3} spacing={3}>
								<TextField
									label={t('eSocial:reasonsForDismissal.filter.code')}
									name='code'
									maxLength={100}
									required
									/> 
							</Grid>
							<Grid item md={3} spacing={3}>
								<TextField
									label={t('eSocial:reasonsForDismissal.filter.description')}
									name='description'
									maxLength={500}
									required
									/> 
							</Grid>
							</Grid>  
							</Panel> 
						</form>
					)
				}
			</Form> 
		</ScreenTemplate>
	);
};

export default ESocialRegistrationTableForm;