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
import { addESocialWorkerCategory, editESocialWorkerCategory, fetchESocialWorkerCategoryById } from 'src/core/store/modules/e-social-worker-category/thunks';
import { fetchESocialTables } from 'src/core/store/modules/e-social-tables/thunks';
import { fetchESocialGroup } from 'src/core/store/modules/e-social-group/thunks';

 const validationSchema = yup.object({
	code: yup
		.number()
		.min(1, t('required'))
		.required(t('required')).typeError('O valor deve ser um número.')
});
 
const ESocialWorkerCategoryForm = () => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState<any>();
	const [eSocialTablesAsOption, setESocialTablesAsOption] = useState<any>();
	const [eSocialGroupAsOption, setESocialGroupAsOption] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues = {
		eSocialTableId: tableData?.eSocialTableId ?? '',
		code: tableData?.code ?? '',
		description: tableData?.description ?? '',
		eSocialGroupId: tableData?.eSocialGroupId ?? '',
	};

	const onSubmit = async (values: any) => {
		 if(isNew === false){
			const { payload } = await dispatch(editESocialWorkerCategory({id: tableData?.id, eSocialTableId: values.eSocialTableId, code: values.code, description: values.description, eSocialGroupId: values.eSocialGroupId, status: tableData?.status})) as any;

			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Categoria editada com sucesso!", {
					variant: "success",
				});
			}
		} else {
			 const { payload } = await dispatch(addESocialWorkerCategory({...values, status: true})) as any;
			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			if(payload.status === 201){
				history.goBack();
				return enqueueSnackbar("Categoria criada com sucesso!", {
					variant: "success",
				});
			} 
		} 
	}

	const getTableData = async () => {
		 const { payload } = await dispatch(fetchESocialWorkerCategoryById(id)) as any;
		setTableData(payload);
	}

	const getTablesOptions = async () => {
		const {payload} = await dispatch(fetchESocialTables({ page: 1, pageSize: 90})) as any
		setESocialTablesAsOption(payload.items?.map((x: any) => { 
			return {
			value: x.id,
			label: x.description
		}}))
	}

	const getGroupOptions = async () => {
		const {payload} = await dispatch(fetchESocialGroup({ page: 1, pageSize: 90})) as any
		setESocialGroupAsOption(payload.items?.map((x: any) => { 
			return {
			value: x.id,
			label: x.description
		}}))

	}

	useEffect(() => {
		getGroupOptions();
		getTablesOptions();
		 if(isNew === false){
			getTableData();
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
							<Panel title={ isNew === true ? t('eSocial:workerCategory.form.title') : t('eSocial:workerCategory.editTitle')} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							<Grid container spacing={2}>
								 <Grid item md={3} xs={12}>
									<SelectField 
										label={t('eSocial:workerCategory.filter.eSocialTableDescription')} 
										name='eSocialTableId'
										options={eSocialTablesAsOption ?? []}
										required
									/>
								</Grid> 
							<Grid item md={3} spacing={3}>
								<TextField
									label={t('eSocial:workerCategory.filter.code')}
									name='code'
									maxLength={100}
									required
									/> 
							</Grid>
							<Grid item md={3} spacing={3}>
								<TextField
									label={t('eSocial:workerCategory.filter.description')}
									name='description'
									maxLength={500}
									required
									/> 
							</Grid>
							<Grid item md={3} spacing={3}>
								<SelectField 
									label={t('eSocial:workerCategory.filter.eSocialGroupDescription')} 
									name='eSocialGroupId'
									options={eSocialGroupAsOption ?? []}
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

export default ESocialWorkerCategoryForm;
