import ScreenTemplate from 'src/components/Screen';
import { Grid, Box } from '@material-ui/core';
import Form, {  SelectField, TextField, Upload } from 'src/components/form';
import { t } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useAreasWitchGroups } from 'src/hooks/fetchLists';
import { getDataCurrentUser } from 'src/core/store/modules/currentUser/selectors';
import FieldColumn from 'src/components/FieldColumn';
import { rejectNoValues } from 'src/core/utils/func';
import { getListCircularizationOfficeLaunch, getListFiltersCircularizationOfficeLaunch, getLoadingCircularizationOfficeLaunch } from 'src/core/store/modules/circularizationOfficeLaunch/selector';
import { fetchCircularizationOfficeLaunch } from 'src/core/store/modules/circularizationOfficeLaunch/thunks';
import Table, { ColumnData } from 'src/components/Table';
import { folderStatusAsOptions } from '../../settings/constants';
import { modal } from 'src/components/modals';
import api from 'src/core/api/circularizationOfficeLaunch'
import OfficeLaunchModal from './OfficeLaunchModal';
import Pagination from 'src/components/Pagination';
import { usePagination } from 'src/hooks/pagination';
import { Button, Submit, Clean } from 'src/components/button';
import { IconButton } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { deleteFilesBaseGenerationHeader, fetchCircularizationBaseGenerationHeader, setHeaderStatus, uploadFilesBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/thunks';
import moment from 'moment';
import { circularizationStatusAsOptions } from '../constants';
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import NumericField from 'src/components/form/NumericField';
import useSelectableTable from 'src/hooks/selectableTable';
import ApprovalModal from './List/ApprovalModal';
import CTGModal from './CTGmodal';

const breadcrumbs = [
	{ label: t("dashboard")},
	{ label: "Configurações",},
	{ label: "Geral"},
	{ label: "Circularização - Avaliação do Escritório"},
	{ label: 'Editar lançamento'}
];

const CircularizationOfficeLaunchForm = () => {

	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { areasDEJUROptions } = useAreasWitchGroups();
	const history = useHistory(); 

	const loading = useSelector(getLoadingCircularizationOfficeLaunch);
	const [hasItens, setHasItens] = useState<boolean>(true);
	const [headerData, setHeaderData] = useState<any[]>([]);
	const [hasReviewRequired, setHasReviewRequired] = useState<boolean>(false);
	const [hasLaunch, setHasLaunch] = useState<boolean>(false);
	const { name } = useSelector(getDataCurrentUser);
	const list = useSelector(getListCircularizationOfficeLaunch);
	const filters = useSelector(getListFiltersCircularizationOfficeLaunch);
	const { page, pageSize, pageCount } = usePagination();
	
	const headerFiles = list[0]?.circularizationBaseGenerationHeader.files ?? [];

	
		const initialValues: any = useMemo(
			() => ({
				status: hasLaunch === true ? 2 : (list[0]?.circularizationBaseGenerationHeader?.status ?? 2),
				observation: '',
				folderNumber: '',
				headerFiles: headerFiles
			}),
			[hasLaunch]
		);

	const onChangeStatus = async (values: any) => {
		const {type} = await dispatch(setHeaderStatus({...values, dueDate: moment().format("YYYY-MM-DD"), id: Number(id)})) as any
	
		if(type === 'circularizationBaseGenerationHeader/setStatus/fulfilled'){
			if(values?.headerFiles?.length > 0){
				const normalizeFiles = Array.from(values.headerFiles || [])

				dispatch(uploadFilesBaseGenerationHeader(
					{circularizationBaseGenerationHeaderId: Number(id),
					filesList: normalizeFiles as unknown as FileList,
					isMainFile: false}
				)) 
				
			}
			history.goBack()
			return enqueueSnackbar("Status de atendimento alterado com sucesso!", {
				variant: 'success',
			});
		} else {
			return enqueueSnackbar("Ocorreu um erro", {
				variant: 'error',
			});
		}
	}

	const onEdit = async (row: any) => {
		const { data } = await api.getById(row.id) as any
		modal({
			title: "",
			component: <OfficeLaunchModal relist={search}  data={data}/>,
			buttons: [],
			dialogProps: {
				maxWidth: "xl",
				showCloseButton: true,
				fullWidth: true,
			},
		})
	}

	const onOpeCTGModal = async() => {
		modal({
			title: "",
			component: <CTGModal data={list}/>,
			buttons: [],
			dialogProps: {
				maxWidth: "xl",
				showCloseButton: true,
				fullWidth: true,
			},
		})
	}

	const getBaseGenerationHeaderData = async () => {
		const { payload } = await dispatch(fetchCircularizationBaseGenerationHeader({ page, pageSize, id: id})) as any;
		setHeaderData(payload?.items)
	} 

	const rows = useMemo(() => (list).map((item: any) => {
		return {
			...item,
			folderNumber: item?.circularizationBaseGeneration?.folderNumber,
			circularizationDate: item?.circularizationBaseGenerationHeader?.circularizationDate,
			dejurArea: areasDEJUROptions?.filter((x: any) => x.value === item?.dejurAreaId)[0]?.label,
			statusId: folderStatusAsOptions[item?.circularizationBaseGeneration?.statusId],
			sphere: item?.circularizationBaseGeneration?.sphere?.substring(2),
			contingency: item?.circularizationBaseGeneration?.contingency,
			processNumber: item?.circularizationBaseGeneration?.processNumber,
			internalLawyer: item?.internalLawyerName,
			responsibleContact: item?.responsibleContactName,
			responsibleOffice: item?.responsibleOofficeName,
			otherPartContact: item?.otherPartContactName,
			provisionClass: item?.circularizationBaseGeneration?.provisionClass,
		}
	}), [list]);

	const selectableTable = useSelectableTable(rows);
	
	const circularizationDate = headerData?.length > 0 ? headerData[0]?.circularizationDate : ""; 
	const dejurAreaName =  headerData?.length > 0 ? areasDEJUROptions?.filter((x: any) => x.value === headerData[0]?.dejurAreaId)[0]?.label : "";
	const officeName = headerData?.length > 0 ? headerData[0]?.office?.name : ""; 
	const fechamento = headerData?.length > 0 ? headerData[0]?.closure : "";  
	
	const onApprove = async (row?: any) => {
		const { data } = await api.getById(row.id) as any
		modal({
			title: "",
			component: <ApprovalModal relist={search}  data={data} selectableTable={selectableTable}/>,
			buttons: [],
			dialogProps: {
				maxWidth: "xl",
				showCloseButton: true,
				fullWidth: true,
			},
		})
	}

	const onApproveByCheckbox = async (row?: any) => {
		modal({
			title: "",
			component: <ApprovalModal relist={search} data={undefined} selectableTable={selectableTable}/>,
			buttons: [],
			dialogProps: {
				maxWidth: "xl",
				showCloseButton: true,
				fullWidth: true,
			},
		})
	}

	const handleOnCheckedChange = (id: number) => {
		selectableTable.changeSelectedItems(+id);
	}

	const handleOnCheckedAllChange = () => {
		selectableTable.handleOnSelectAllItems();
	}

	const columns: ColumnData[] = [
		{
			label: 'Ações',
			field: 'action',
			component: (row: any) => {
				return (
					<>
						<IconButton aria-label='edit' onClick={() => onEdit(row)}>
							{row.circularizationBaseGenerationHeader.status === 2 || row.circularizationBaseGenerationHeader.status === 4 ? <VisibilityIcon /> : <EditIcon />}
						</IconButton>
						<IconButton aria-label='edit' onClick={() => onApprove(row)}>
							{row.circularizationBaseGenerationHeader.status === 2 || row.circularizationBaseGenerationHeader.status === 4 || row.statusFlowId === 3 ? null : <DoneIcon style={{color:  "#45e215"}}/>}
						</IconButton>
					</>
				)
			},
			type: 'custom'
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

	const changeStatus = async () => {
		await dispatch(setHeaderStatus({ status: 2, dueDate: moment().format("YYYY-MM-DD"), id: Number(id)}))
	}

		const search = async (values?: any) => {
			if(values !== undefined){
				const result = rejectNoValues({ CircularizationBaseGenerationHeaderId: id, status: [1, 2, 3], Page: page, PageSize: pageSize, FolderNumber: values.folderNumber })
			
				const {payload} = await dispatch(fetchCircularizationOfficeLaunch(result)) as any;		
				if(payload?.error?.status === 404){
					return enqueueSnackbar("Não há mais lançamentos para serem avaliados.", {
					variant: 'error',
				});
			}	
				return
			}
			const result = rejectNoValues({ CircularizationBaseGenerationHeaderId: id, status: [1, 2, 3], Page: page, PageSize: pageSize })
				const {payload} = await dispatch(fetchCircularizationOfficeLaunch(result)) as any;
			
				if(payload?.error?.status === 404){
					setHasItens(false)
					setHasLaunch(true)

					await changeStatus();
					return enqueueSnackbar("Não há mais lançamentos para serem avaliados.", {
					variant: 'error',
				});
			}
			}

			useEffect(() => {
				getBaseGenerationHeaderData();
			}, []); 
		
			useEffect(() => {
				search();
			}, [page, pageSize, dispatch, filters]); 

			useEffect(() => {
				selectableTable.unselectAllItems();
			}, [filters]) 

	const onDeleteFile = async (file: any) => {
		if (file && file.id) { 
			dispatch(deleteFilesBaseGenerationHeader(file.id)) as any; 
		}  
	};
	
	const verifyIfIsReviewRequired = (items: any[],) => {
		for (const object of items) {
			if (object["isReviewRequired"] === true) {
			  return setHasReviewRequired(true);
			}
		  }
		  return setHasReviewRequired(false);
	}

	useEffect(() => {
		verifyIfIsReviewRequired(selectableTable.items)
	}, [selectableTable])

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
											value={fechamento}
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
											disabled={hasItens}
											options={circularizationStatusAsOptions?.filter(({value}) => value <= 2 && value > 0)}
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
									<Grid item md={6} xs={12}>
										<Upload
											multiple
											id='headerFiles'
											name="headerFiles"
											confirmDeletionGoodsAndGuarantees 
											onDelete={(file) => onDeleteFile(file)}
										/>
									</Grid>
							</Grid>	
							<Grid container direction='row' justifyContent='flex-end' className='margin-top-24'>
									<Button style={{ marginRight: '8px' }} text='CTG fora da base' onClick={onOpeCTGModal}/>
									<Button text='Salvar' onClick={() => onChangeStatus(values)}/>
								</Grid> 
							</Panel> 

							<Panel title={"Buscar lançamentos"} withPadding>
							<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
							<NumericField
								name='folderNumber'
								label={t('form.CTGFolder')}
							/>
							</Grid>
							
							<Grid item md={1} xs={2}>
							<Submit type="search"/>
							</Grid>
							</Grid>
								<Clean onClick={() => search()}/>
							</Panel>
						
							<Panel title={"Editar lançamentos do escritório"} withPadding
							> 
							<Grid container justifyContent="space-between">
							<Grid item xs={12}>
								<Box p={2} textAlign="right" gridGap="rem">
									<Button disabled={selectableTable?.selectedItems?.length === 0 ? true : false} text='Aprovar' onClick={() => onApproveByCheckbox()}></Button>
								</Box>
							</Grid>
							</Grid>
							<Table
								showCheckboxColumn={!hasReviewRequired} 
								onCheckedChange={handleOnCheckedChange}
								onCheckedAllChange={handleOnCheckedAllChange}
								isAllItemsSelected={selectableTable.areAllItemsSelected}
								isCheckboxIndeterminate={
								selectableTable.haveAnySelectedItemFromCurrentPage &&
								!selectableTable.areAllItemsSelected}
								columns={columns}
								isMultipleAttach={true}
								rows={hasLaunch === true ? [] : selectableTable.items}
								isLoading={loading}
							/>
							</Panel>
						</form>
					)
				}

			</Form>
		</ScreenTemplate>

		<Pagination
		page={page}
		pageSize={pageSize}
		pageCount={pageCount}
		/>
		        <Box marginY={4} display="flex" justifyContent="flex-end">
		            <Button
						text="Voltar"
						onClick={() => history.goBack()}
					/>		
				</Box>
		</>
	);
};

export default CircularizationOfficeLaunchForm;
