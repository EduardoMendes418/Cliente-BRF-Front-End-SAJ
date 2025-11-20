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
import { addESocialTables, editESocialTables, fetchESocialTableById } from 'src/core/store/modules/e-social-tables/thunks';
import { useSnackbar } from 'notistack';
import { TTableGridList } from 'src/core/models/e-social-tables';

const validationSchema = yup.object({
	eSocialTableNumber: yup
		.number()
		.min(1, t('required'))
		.required(t('required')).typeError('O valor deve ser um número.'),
	description: yup.string().required(t('required')).max(100)
});

const ESocialTablesForm = () => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues = {
		eSocialTableNumber: tableData?.eSocialTableNumber ?? null,
		description: tableData?.description ?? ''
	};

	const onSubmit = async (values: TTableGridList) => {
		if(isNew === false){
			const { payload } = await dispatch(editESocialTables({id: tableData?.id, eSocialTableNumber: values.eSocialTableNumber, description: values.description, status: tableData?.status})) as any;

			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Tabela editada com sucesso!", {
					variant: "success",
				});
			}
		} else {
			const { payload } = await dispatch(addESocialTables({...values, status: true})) as any;
			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			if(payload.status === 201){
				history.goBack();
				return enqueueSnackbar("Tabela criada com sucesso!", {
					variant: "success",
				});
			}
		}
	}

	const getTableData = async () => {
		const { payload } = await dispatch(fetchESocialTableById(id)) as any;
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
							<Panel title={ isNew === true ? t('eSocial:eSocialTables.form.title') :  t('eSocial:eSocialTables.editTitle')} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<TextField
									label={t('eSocial:eSocialTables.form.eSocialTableNumber')}
									name='eSocialTableNumber'
									maxLength={20}
									required
									/>
								</Grid>
							<Grid item md={3} spacing={3}>
									<TextField
									label={t('eSocial:eSocialTables.form.description')}
									name={'description'}
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

export default ESocialTablesForm;
