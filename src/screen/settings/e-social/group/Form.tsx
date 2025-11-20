import ScreenTemplate from 'src/components/Screen';
import { Grid } from '@material-ui/core';
import Form, { TextField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import * as yup from 'yup';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addESocialGroup, editESocialGroup, fetchESocialGroupById } from 'src/core/store/modules/e-social-group/thunks';
import { TGroupGridList } from 'src/core/models/e-social-tables';
import { useSnackbar } from 'notistack';

const validationSchema = yup.object({
	description: yup.string().required(t('required')).max(100)
});

const ESocialGroupForm = () => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues = {
		description: tableData?.description ?? ''
	};

	const onSubmit = async (values: TGroupGridList) => {
		if(isNew === false){
			const { payload } = await dispatch(editESocialGroup({id: tableData?.id, description: values.description, status: tableData?.status})) as any;

			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Grupo editado com sucesso!", {
					variant: "success",
				});
			}
		} else {
			const { payload } = await dispatch(addESocialGroup({...values, status: true})) as any;
			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			if(payload.status === 201){
				history.goBack();
				return enqueueSnackbar("Grupo criado com sucesso!", {
					variant: "success",
				});
			}
		}
	}

	const getTableData = async () => {
		const { payload } = await dispatch(fetchESocialGroupById(id)) as any;
		setTableData(payload);
	}

	useEffect(() => {
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
							<Panel title={ isNew === true ? t('eSocial:eSocialGroup.form.title') :  t('eSocial:eSocialGroup.editTitle')} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							<Grid container spacing={2}>
								
								<Grid item md={3} spacing={3}>
									<TextField
										label={t('eSocial:eSocialTables.form.description')}
										name={'description'}
										maxLength={100}
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

export default ESocialGroupForm;
