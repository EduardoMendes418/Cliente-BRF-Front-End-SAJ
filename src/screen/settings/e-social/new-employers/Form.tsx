import ScreenTemplate from 'src/components/Screen';
import { Grid } from '@material-ui/core';
import Form, { CPFOrCNPJField, SelectField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { fetchESocialClosureEmployerCreate, fetchESocialClosureEmployerListById, fetchESocialClosureEmployerUpdate } from 'src/core/store/modules/e-social-new-employers/thunks';

const ESocialNewEmployerForm = () => {

	const { id } = useParams<{ id: any }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState<any>();

	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const {
		closingOptions,
	} = useProcessFilterOptions();
	
	const getData = async () => {
		const { payload } = await dispatch(fetchESocialClosureEmployerListById({id: id})) as any;
		setTableData(payload);  
		
	}

	const initialValues = useMemo(() => {
		const initialValues = {
			closureId:  "",
			ccnpj: ""
		} as any;
		return tableData ? tableData : initialValues;
	}, [tableData]);

	const onSubmit = async (values: any) => {
		if(isNew === false){
			const { payload } = await dispatch(fetchESocialClosureEmployerUpdate({...values, id: tableData?.id})) as any;
			if(payload.status !== 200){
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
			const { payload } = await dispatch(fetchESocialClosureEmployerCreate({...values})) as any;
		
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Empregador registrado com sucesso!", {
					variant: "success",
				});
			}
			if(payload.status !== 200){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			
		} 
	}

	useEffect(() => {
		if(isNew === false){
			getData();
		} 
	}, [])

	return (
		<ScreenTemplate>
			<Form
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onSubmit}
			>
				{
					({handleSubmit, isSubmitting, dirty}) => (
						<form noValidate onSubmit={handleSubmit}>
							<Panel title={ isNew === true ? "Editar empregador" : "Cadastrar novo empregador"} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t('dataImport:processSheet.form.closing')}
										name="closureId"
										options={closingOptions}
									/>
								</Grid> 
							<Grid item md={3} spacing={3}>
								<CPFOrCNPJField 
									label={t("integrations:request.form.cnpj")}
									name="cnpj"
									type="cnpj"
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

export default ESocialNewEmployerForm;
