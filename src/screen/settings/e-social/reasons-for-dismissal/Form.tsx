import ScreenTemplate from 'src/components/Screen';
import { Grid } from '@material-ui/core';
import Form, { DateField, SelectField, TextField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import * as yup from 'yup';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { fetchESocialTables } from 'src/core/store/modules/e-social-tables/thunks';
import { addESocialReasonsForDismissal, editESocialReasonsForDismissal, fetchESocialReasonsForDismissalById } from 'src/core/store/modules/e-social-reasons-for-dismissal/thunks';
import { getListESocialWorkerCategory } from 'src/core/store/modules/e-social-worker-category/selectors';
import { fetchESocialWorkerCategory } from 'src/core/store/modules/e-social-worker-category/thunks';

 const validationSchema = yup.object({
	code: yup
		.number()
		.min(1, t('required'))
		.required(t('required')).typeError('O valor deve ser um número.')
});
 
const ESocialReasonsForDismissalForm = () => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [reasonData, setReasonData] = useState<any>();
	const [eSocialTablesAsOption, setESocialTablesAsOption] = useState<any>();
	const workerCategoryList = useSelector(getListESocialWorkerCategory);
	const eSocialWorkerCategories = reasonData?.eSocialReasonsForDismissalWorkerCategories.map((x: any) =>{ return x?.eSocialWorkerCategoryId});


	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues = {
		eSocialTableId: reasonData?.eSocialTableId ?? "",
		code: reasonData?.code ?? "",
		description: reasonData?.description ?? "",
		startDate: reasonData?.startDate ?? "",
		endDate: reasonData?.endDate ?? "",
		eSocialWorkerCategories: eSocialWorkerCategories ?? []
	};

	const workerCategoryAsOption = workerCategoryList?.map((x) => {
		return {
			label: `${x.code} - ${x.description}`,
			value: x.id
		}
	});


	const onSubmit = async (values: any) => {
		const toSend = {
			code: values.code,
			description: values.description,
			eSocialTableId: values.eSocialTableId,
			endDate: values.endDate,
			startDate: values.startDate,
			eSocialReasonsForDismissalWorkerCategories: values.eSocialWorkerCategories.map((x: any) => {return {eSocialWorkerCategoryId: x}})
		}

		    if(isNew === false){
			 const { payload } = await dispatch(editESocialReasonsForDismissal({id: reasonData?.id, eSocialTableId: values.eSocialTableId, code: values.code, description: values.description, startDate: values.startDate, endDate: values.endDate, eSocialReasonsForDismissalWorkerCategories: values?.eSocialWorkerCategories?.map((x: any) => {return {eSocialReasonsForDismissalId: reasonData?.id, eSocialWorkerCategoryId: x}}), status: reasonData?.status})) as any;

			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Motivo editado com sucesso!", {
					variant: "success",
				});
			} 
		} else {
			 const { payload } = await dispatch(addESocialReasonsForDismissal({...toSend, status: true})) as any;
			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			if(payload.status === 201){
				history.goBack();
				return enqueueSnackbar("Motivo de desligamento registrado com sucesso!", {
					variant: "success",
				});
			} 
		}
	}

	 const getReasonData = async () => {
		 const { payload } = await dispatch(fetchESocialReasonsForDismissalById(id)) as any;
		setReasonData(payload);
	} 

	 const getTablesOptions = async () => {
		const {payload} = await dispatch(fetchESocialTables({ page: 1, pageSize: 90})) as any;
		setESocialTablesAsOption(payload.items?.map((x: any) => { 
			return {
			value: x.id,
			label: `${x.eSocialTableNumber} - ${x.description}`
		}}))
	} 



	useEffect(() => {
		dispatch(fetchESocialWorkerCategory({page: 1, pageSize: 90}));
		getTablesOptions();
		  if(isNew === false){
			getReasonData();
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
							<Panel title={ isNew === true ? t('eSocial:reasonsForDismissal.form.title') : t('eSocial:reasonsForDismissal.editTitle')} 
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
							<Grid item md={3} spacing={3}>
								<DateField
								label={t('eSocial:reasonsForDismissal.filter.startDate')}
								name="startDate"
								required
								/>
							</Grid>
							<Grid item md={3} spacing={3}>
								<DateField
								label={t('eSocial:reasonsForDismissal.filter.endDate')}
								name="endDate"
								required
								/>
							</Grid>
							<Grid item md={3} spacing={3}>
								<SelectField
								label={t('eSocial:reasonsForDismissal.filter.categoryCode')}
								name="eSocialWorkerCategories"
								options={workerCategoryAsOption ?? []}
								multiple
								required
								overflowed={true}
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

export default ESocialReasonsForDismissalForm;
