import ScreenTemplate from 'src/components/Screen';
import { Grid } from '@material-ui/core';
import Form, { PercentageField, TextField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { addCircularizationConfiguration, editCircularizationConfiguration, fetchCircularizationConfiguration } from 'src/core/store/modules/circularizationConfiguration/thunks';
import Logs from 'src/components/Logs';
import { OfficeLaunchStatus } from 'src/screen/circularization/circularizationOfficeLaunch/OfficeLaunchModal';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';


const CircularizationForm = () => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [data, setData] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const { groupedAreasAsOptions} = useGroupedAreas();


	const initialValues = {
		dejurAreaId: data?.dejurAreaId ?? '',
		provisionTolerancePercentage: data?.provisionTolerancePercentage ?? null,
		approvalProcessType: data?.approvalProcessType ?? ''
	};

	const onSubmit = async (values: any) => {
		const formattedPercentage = +values?.provisionTolerancePercentage.replace(',', '.').replace('%', '');

		  if(isNew === false){ 
			const { type } = await dispatch(editCircularizationConfiguration({...data, dejurAreaId: values?.dejurAreaId, provisionTolerancePercentage: formattedPercentage, approvalProcessType: values?.approvalProcessType})) as any;
		
			 if(type !== 'circularizationConfiguration/edit/fulfilled' ){
				return enqueueSnackbar(`Erro na edição`, {
					variant: "error",
				});
			}
			if(type === 'circularizationConfiguration/edit/fulfilled'){
				history.goBack();
				return enqueueSnackbar("Circularização editada com sucesso!", {
					variant: "success",
				});
			}
		} else {
			
			const { type } = await dispatch(addCircularizationConfiguration({...values, provisionTolerancePercentage: formattedPercentage, isActive: true})) as any;

			if(type === 'circularizationConfiguration/add/fulfilled'){
				history.goBack();
				return enqueueSnackbar("Circularização cadastrada com sucesso!", {
					variant: "success",
				});
			} else {
				return enqueueSnackbar("Ocorreu um erro.", {
					variant: "error",
				});
			}}}

	const getData = async () => {
		const { payload } = await dispatch(fetchCircularizationConfiguration({id: id})) as any;
		setData(payload?.items[0]);
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
							<Panel title={  isNew === true ? "Cadastro configuração circularização" :  "Editar configuração circularização"} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							<Grid container spacing={2}>
							<Grid item md={3} spacing={3}> 
								<GroupedSelectFiledMultiple
									options={groupedAreasAsOptions}
									label={t('dataImport:documents.form.areasId')}
									name='dejurAreaId'
								/>
							</Grid>
							<Grid item md={3} spacing={3}>
								<PercentageField
									label={"Percentual tolerância provisão"}
									name='provisionTolerancePercentage'
									maxLength={6}
									noSymbol
								/> 
							</Grid>
							<Grid item md={3} spacing={3}>
								<TextField
									label={"Tipo processo aprovação1"}
									name="approvalProcessType"
									maxLength={500}
								/> 
							</Grid>
							</Grid>
							</Panel>
							 <Logs
                            logs={data?.logs}
                            statuses={OfficeLaunchStatus}
                            statusOrder={["approvalCenter"]}
                        /> 
						</form>
					)
				}

			</Form>
		</ScreenTemplate>
	);
};

export default CircularizationForm;
