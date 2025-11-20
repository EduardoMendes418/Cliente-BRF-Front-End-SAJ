import ScreenTemplate from 'src/components/Screen';
import { Grid, Box } from '@material-ui/core';
import Form, {  SelectField, TextField } from 'src/components/form';
import { t } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useAreasWitchGroups } from 'src/hooks/fetchLists';
import { getDataCurrentUser } from 'src/core/store/modules/currentUser/selectors';
import FieldColumn from 'src/components/FieldColumn';
import { rejectNoValues } from 'src/core/utils/func';
import { getListCircularizationLegalLaunch, getListFiltersCircularizationLegalLaunch, getLoadingCircularizationLegalLaunch } from 'src/core/store/modules/circularizationLegalLaunch/selector';
import { fetchCircularizationLegalLaunch } from 'src/core/store/modules/circularizationLegalLaunch/thunks';
import Table, { ColumnData } from 'src/components/Table';
import { folderStatusAsOptions } from '../../settings/constants';
import { modal } from 'src/components/modals';
import api from 'src/core/api/circularizationLegalLaunch'
import Pagination from 'src/components/Pagination';
import { usePagination } from 'src/hooks/pagination';
import { Clean, Submit, Button } from 'src/components/button';
import { IconButton } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { setHeaderStatus } from 'src/core/store/modules/circularizationBaseGenerationHeader/thunks';
import moment from 'moment';
import LegalLaunchModal from './LegalLaunchModal';
import { circularizationStatusAsOptions } from '../constants';
import NumericField from 'src/components/form/NumericField';
import UploadCard from 'src/components/form/Upload/UploadCard';

const breadcrumbs = [
	{ label: t("dashboard")},
	{ label: "Configurações",},
	{ label: "Geral"},
	{ label: "Circularização - Avaliação da Área Jurídica"},
	{ label: 'Editar lançamento'}
];


const CircularizationLegalLaunchForm = () => {

	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { areasDEJUROptions } = useAreasWitchGroups();

	const loading = useSelector(getLoadingCircularizationLegalLaunch);
	const { name } = useSelector(getDataCurrentUser);
	const list = useSelector(getListCircularizationLegalLaunch);
	const { page, pageSize } = usePagination();
	const [hasLaunch, setHasLaunch] = useState<boolean>(false);
	const [hasItens, setHasItens] = useState<boolean>(true);
	const history = useHistory(); 
	const filters = useSelector(getListFiltersCircularizationLegalLaunch);

	const initialValues = {
		status: list[0]?.circularizationBaseGenerationHeader?.status ?? null,
		observation: '',
		IsInconsistencyFound: true,
		folderNumber: ''
	}

	const headerStatus = list[0]?.circularizationBaseGenerationHeader?.status;

	const onChangeStatus = async (values: any) => {
		const valuesToSend = {
			status: values.status,
			observation: values.observation
		}

		const {type, payload} = await dispatch(setHeaderStatus({...valuesToSend, dueDate: moment().format("YYYY-MM-DD"), id: id})) as any
		
		if(type === 'circularizationBaseGenerationHeader/setStatus/fulfilled'){
			history.goBack()
			return enqueueSnackbar("Status de atendimento alterado com sucesso!", {
				variant: 'success',
			});
		} else if (payload?.status === 500){
			return enqueueSnackbar(`${payload?.detail}`, {
				variant: 'error',});
		} else {
			return enqueueSnackbar("Ocorreu um erro", {
				variant: 'error',
			});
		} 
	}

	const circularizationDate = list[0]?.circularizationBaseGeneration.circularizationDate ?? "";
	const dejurAreaName = list[0]?.circularizationBaseGeneration.dejurArea.path ?? "";
	const officeName = list[0]?.circularizationBaseGeneration.office.name ?? "";
	const files = list[0]?.circularizationBaseGenerationHeader?.files;

	const rows: any[] = list?.map((item: any) => {
		return {
			...item,
			circularizationDate: item?.circularizationBaseGenerationHeader?.circularizationDate,
			totalProbably: item?.circularizationOfficeLaunch?.totalProbably,
			totalRemote: item?.circularizationOfficeLaunch?.totalRemote,
			totalPossible: item?.circularizationOfficeLaunch?.totalPossible,
			provisionClass: item?.circularizationBaseGeneration?.provisionClass,
			folderNumber: item?.circularizationBaseGeneration?.folderNumber,
			dejurArea: areasDEJUROptions?.filter((x: any) => x.value === item?.circularizationBaseGeneration?.dejurAreaId)[0]?.label,
			statusId: folderStatusAsOptions[item?.circularizationBaseGeneration?.statusId],
			sphere: item?.circularizationBaseGeneration?.sphere?.substring(2),
			contingency: item?.circularizationBaseGeneration?.contingency,
			processNumber: item?.circularizationBaseGeneration?.processNumber,
			internalLawyer: item?.circularizationBaseGeneration?.internalLawyer?.name,
			responsibleContact: item?.circularizationBaseGeneration?.closedProcess?.responsibleContactName,
			responsibleOffice: item?.circularizationBaseGeneration?.closedProcess?.responsibleOofficeName,
			otherPartContact: item?.circularizationBaseGeneration?.closedProcess?.otherPartContactName
		}
	}).filter((item: any) => { return item.statusFlowId === -1 });

	const columns: ColumnData[] = [
		{
			label: "Ações",
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
					{
						headerStatus  === 2 ? <>
						<IconButton onClick={() => onEdit(row)}>
								<EditIcon/> 
						</IconButton>
						
						</> : <>
						<IconButton onClick={() => onEdit(row)}>
								<VisibilityIcon color="primary"/> 
						</IconButton>	
						</>
					}
						
					</>
				);
			},
		},
		{
			label: t("form.attachments"),
			field: "",
			type: "custom",
			component: ({ files }: { files?: any[] }) => {
				if (!files?.length) return null;
				return (
					<IconButton
						onClick={() => {
							const paths = files.map(
								(file) => file.path
							);
							paths.forEach((path) => window.open(path));
						}}
					>
						<AttachmentIcon />
					</IconButton>
				);
			},
		},
		{ label: "Pasta CTG", field: 'folderNumber'},
		{ label: "Tipo da CTG", field: 'contingency'},
		{ label: 'Classe provisão', field: 'provisionClass'},
		{ label: 'Número do Processo', field: 'processNumber'},
		{ label: 'Esfera', field: 'sphere'},
		{ label: 'Total provável', field: 'totalProbably', type: 'currency'},
		{ label: 'Total possível', field: 'totalPossible', type: 'currency'},
		{ label: 'Total remoto', field: 'totalRemote', type: 'currency'},
		{ label: 'Status Pasta/CTG', field: 'statusId'},
		{ label: 'Advogado Interno', field: 'internalLawyer'},
		{ label: 'Responsável Jurídico', field: 'responsibleContact'},
		{ label: 'Responsável Escritório', field: 'responsibleOffice'},
		{ label: 'Parte Contrária', field: 'otherPartContact'},
	];

		const search = async (values?: any) => {
			if(values !== undefined){
				const result = rejectNoValues({ CircularizationBaseGenerationHeaderId: id, Page: page, PageSize: pageSize, statusFlowId: -1, FolderNumber: values.folderNumber })

				const {payload} = await dispatch(fetchCircularizationLegalLaunch(result)) as any;

				if(payload?.error?.status === 404){
					return enqueueSnackbar("Não há mais lançamentos para serem avaliados.", {
						variant: 'error',
					});
				}
				return;

			}
			const result = rejectNoValues({ CircularizationBaseGenerationHeaderId: id, Page: page, PageSize: pageSize, statusFlowId: -1})
		
			const {payload} = await dispatch(fetchCircularizationLegalLaunch(result)) as any;
			
			if(payload?.error?.status === 404){
				setHasItens(false)
				setHasLaunch(true)
				return enqueueSnackbar("Não há mais lançamentos para serem avaliados.", {
					variant: 'error',
				});
			}
			}
		
			useEffect(() => {
				search();
			
			}, [page, pageSize, dispatch, filters]);
			
			useEffect(() => {
				if(rows?.length === 0){
					setHasItens(false)
				}
			}, [rows])

	const onEdit = async (row: any) => {
		const { data } = await api.getById(row.id) as any
		modal({
			title: "",
			component: <LegalLaunchModal relist={search}  data={data}/>,
			buttons: [],
			dialogProps: {
				maxWidth: "md",
				showCloseButton: true,
				fullWidth: true,
			},
		}) 
	}

	return (
		<>
		<ScreenTemplate breadcrumbsPath={breadcrumbs}>
			<Form
			enableReinitialize
			initialValues={initialValues}
			onSubmit={search} 
			>
				{
					({ handleSubmit, values}) => (
						<form noValidate onSubmit={handleSubmit}>
							<Panel title={t('requisitions:service.title')} withPadding>
							<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
							<FieldColumn
						         label={"Mês/ano circularização"}
						         value={circularizationDate}
								 type='date'
					          />
							</Grid>
							<Grid item md={3} xs={12}>
							  <FieldColumn
						         label={"Área DEJUR"}
						         value={dejurAreaName}
					          />
							</Grid>
							<Grid item md={3} xs={12}>
							  <FieldColumn
						         label={"Escritório"}
						         value={officeName}
					          />
							</Grid>
							<Grid item xs={12} md={3}>
								<FieldColumn 
									label='Fechamento'
									value={list[0]?.closure ?? ''}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
							  <FieldColumn
						         label={t('requisitions:form.responsibleName')}
						         value={name}
					          />
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name='status'
									label={t('status')}
									options={circularizationStatusAsOptions?.filter(({value}) => value >= 2 && value <= 4)}
									disabled={hasItens}
									required
								/>
							</Grid>
							<Grid item md={6} xs={12}>
								<TextField
									name="observation"
									label={t('requisitions:service.observation')}
									placeholder={t('form.typeHere')}
									maxLength={1000}
								/>
							</Grid>	
							</Grid>	
							{
								files?.length > 0 ? 
								<Panel title={"Anexos"}  withPadding>
							 		<Grid item md={6} xs={12}>
										<div className='row'>
											{files?.map((file: any, index: any) => (
												<UploadCard file={file} key={`uploadcard_${index}`} disabled />
												))}
										</div>
									</Grid> 
								</Panel> : null
							}							
							<Grid container direction='row' justifyContent='flex-end' className='margin-top-24'>
									<Button text='Salvar' onClick={() => onChangeStatus(values)}/>
								</Grid> 
							</Panel> 
							<Panel title={"Buscar lançamentos"} withPadding>
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<NumericField
											name='folderNumber'
											label={t('form.CTGFolder')}/>
									</Grid>
									<Grid item md={1} xs={2}>
										<Submit type="search"/>
									</Grid>
								</Grid>
								<Clean onClick={() => search()}/>
							</Panel>
							<Panel title={"Editar lançamentos do escritório"} 
							withPadding
							> 
							<Table
								columns={columns}
								isMultipleAttach={true}
								rows={hasLaunch === true ? [] : rows}
								isLoading={loading}
							/>
							</Panel>
						</form>
					)
				} 

			  </Form> 
		</ScreenTemplate>
		 <Pagination />  
		 		<Box marginY={4} display="flex" justifyContent="flex-end">
		            <Button
						text="Voltar"
						onClick={() => history.goBack()}
					/>
							
				</Box>
		</>
	);
};

export default CircularizationLegalLaunchForm;
