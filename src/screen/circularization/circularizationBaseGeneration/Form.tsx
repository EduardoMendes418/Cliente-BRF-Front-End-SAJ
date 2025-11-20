import ScreenTemplate from 'src/components/Screen';
import { Box, Button, Grid } from '@material-ui/core';
import Form, { DateField, SelectField, TextField, Upload } from 'src/components/form';
import { t } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import { Clean, Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { Button as ComponentButton }  from 'src/components/button';

import { optionsContingencyType } from './List/Search';
import useProcessFilterOptions, { useClosingOptions, useProvisionClassesOptions } from 'src/hooks/useProcessFilterOptions';
import { statusFolderNumberAsOptions } from '../../settings/general/request-parameters/constants';
import { getLoadingCircularizationBaseGeneration } from 'src/core/store/modules/circularizationBaseGeneration/selector';
import CustomFieldsButton from 'src/screen/reports/components/CustomFieldsButton';
import { TReportComponent } from 'src/core/models/reports';
import { useReport } from 'src/screen/reports/hooks/useReport';
import { useCustomFieldModal } from 'src/screen/reports/hooks/useModal';
import { addCircularizationBaseGenerationHeader, fetchCircularizationBaseGenerationHeader, fetchCircularizationBaseGenerationHeaderOffices, setHeaderStatus, uploadFilesBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/thunks';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { fetchCircularizationBaseGeneration } from 'src/core/store/modules/circularizationBaseGeneration/thunks';
import { folderStatusAsOptions } from '../../settings/constants';
import { getListCircularizationBaseGenerationHeader, getListOffices } from 'src/core/store/modules/circularizationBaseGenerationHeader/selector';
import FieldColumn from 'src/components/FieldColumn';
import { exportRequestReportCircularizationExcelFile } from 'src/core/store/modules/report/thunks';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';
import { modal } from 'src/components/modals';
import CircularizationHeaderModal from './List/CircularizationHeaderModal';

const CircularizationBaseGenerationForm = () => {
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory(); 

	const { groupedAreasAsOptions} = useGroupedAreas();
	const provisionClassesOptions = useProvisionClassesOptions();
	const options = useProcessFilterOptions();
	const loading = useSelector(getLoadingCircularizationBaseGeneration);
	const { showModal } = useCustomFieldModal();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [pageCount, setPageCount] = useState(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

	const [fetchOffices, setFetchOffices] = useState<boolean>(true);
	const [filterValues, setFilterValues] = useState<any>();
	const [list, setList] = useState<any[]>([]);
	const officesAsOptions = useSelector(getListOffices);
	const listHeader = useSelector(getListCircularizationBaseGenerationHeader);
	const closingOptions = useClosingOptions();

	const onPageChange = useCallback((page: number) => setPage(page), [])
	const onPageSizeChange = useCallback((pageSize: number) => setPageSize(pageSize), [])
	
	const { spheresOptions } = options;

	const disableWhenStatusEqualTen = listHeader !== undefined ? listHeader[0]?.status === 10 : false;

	const closingOptionsList = useMemo(() => closingOptions.slice().sort((x, y) => x.label.localeCompare(y.label)).filter((x) => x.label !== ''), [closingOptions]);

	const getBaseGeneration = async () => {
		if(id !== "novo"){ 
			setIsLoadingTable(true);
			const { payload } = await dispatch(fetchCircularizationBaseGeneration({ page, pageSize, circularizationBaseGenerationHeaderId: id})) as any;
			setList(payload?.items === undefined ? [] : payload?.items)
			setPageCount(payload?.pageCount)
			setIsLoadingTable(false);
		} 
	}

	useEffect(() => {
		getBaseGeneration();
	}, [page, pageSize])

	const getOffices = async () => {
		
		await dispatch(fetchCircularizationBaseGenerationHeaderOffices({dejurAreaId: filterValues?.dejurAreaId, monthAndYear: filterValues?.circularizationDate, contingencies: filterValues?.contingencies, provisionClassIds: filterValues?.provisionClassIds, spheres: filterValues?.spheres, statusIds: filterValues?.statusIds}))
		return
	}

	const initialValues: any = {
		dejurAreaId: [],
		officeIds: [],
		contingencies: [],
		provisionClassIds: [],
		closureIds: [],
		circularizationDate: null,
		spheres: [],
		statusIds: [],
		status: listHeader !== undefined ? listHeader[0]?.status : null,
		observation: '',
		emails: '',
		files: listHeader !== undefined ? listHeader[0]?.files : []
	}

	const {
		customFields,
		setCustomFields,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: TReportComponent.CIRCULARIZATION_BASE_GENERATION, getReportConfiguration: true })

	const openCustomFieldModal = () => {
		showModal({
			filterTypeName: "Filtro Principal",
			onSubmitModal: setCustomFields,
			options: customFieldsDictionary,
			customFields: customFields
		})
	}

	const onSubmit = async (values: any) => {
		setIsLoading(true);
		await delete values.observation
		await delete values.emails
		await delete values.status
		await delete values.files
		const customFieldsArray = customFields?.map((x) => x.fieldName)
		const { type, payload  } = await dispatch(addCircularizationBaseGenerationHeader({...values, customFields: customFieldsArray })) as any;
		setIsLoading(false);
	
		if (type === 'circularizationBaseGenerationHeader/add/rejected'){
			return enqueueSnackbar(payload?.detail, {
				variant: "error",
			});
			} else {
				history.goBack();
			return enqueueSnackbar("Header base circularização gerado com sucesso!", {
				variant: "success",
			});
			}
	}

	const columns: ColumnData[] = [

		{ label: "Área DEJUR", field: 'dejurArea' },
		{ label: "Pasta/CTG", field: 'folderNumber' },
		{ label: 'Classe provisão', field: 'provisionClass'},
		{ label: 'Tipo da contingência', field: 'contingency'},
		{ label: 'Processo', field: 'processNumber'},
		{ label: 'Esfera', field: 'sphere'},
		{ label: 'Status', field: 'statusId'},
		{ label: 'Advogado interno', field: 'internalLawyer'},
		{ label: 'Resp. jurídico', field: 'responsibleContact'},
		{ label: 'Escritório', field: 'office'},
		{ label: 'Resp. escritório', field: 'responsibleOffice'},
		{ label: 'Total provável', field: 'probablyTotal', type: 'currency'},
		{ label: 'Total possível', field: 'possibleTotal', type: 'currency'},
		{ label: 'Total remoto', field: 'remoteTotal', type: 'currency'},
	];	

		const rows: any[] = list?.map((item: any) => {
			return {
				...item,
				dejurArea: item?.dejurArea?.name,
				sphere: item?.sphere,
				statusId: folderStatusAsOptions[item?.statusId],
				internalLawyer: item?.internalLawyer?.name,
				responsibleContact: item?.responsibleContact?.name,
				office: item?.office?.name,
				responsibleOffice: item?.responsibleOffice?.name,
				possibleTotal: item?.totalPossible,
				probablyTotal: item?.totalProbably,
				remoteTotal: item?.totalRemote,	
			}
		});

	const generateReport = async (values: any) => {
		const { meta } = await dispatch(exportRequestReportCircularizationExcelFile({circularizationDate: list[0]?.circularizationDate, dejurAreaIds: [list[0]?.dejurArea?.id], officeIds: [list[0]?.office?.id], closureIds: [list[0]?.closureId]})) as any;
		
		if (meta?.requestStatus === "fulfilled") {
			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			window.open("/relatorios/gerados", "_blank")?.focus();
		}

	}	

const setCircularizationStatus = async (values: any, statusType: string) => {
		const {type} = await dispatch(setHeaderStatus({observation: values.observation, dueDate: list[0]?.circularizationDate, id: Number(id), emails: statusType === 'send' ? values.emails : '', status: statusType === 'send' ? 1 : 11})) as any
	
		if(type === 'circularizationBaseGenerationHeader/setStatus/fulfilled'){
			if(values?.files?.length > 0){
				const normalizeFiles = Array.from(values.files || [])

				await dispatch(uploadFilesBaseGenerationHeader(
					{circularizationBaseGenerationHeaderId: Number(id),
					filesList: normalizeFiles as unknown as FileList,
					isMainFile: false}
				)) 
				
			}
			enqueueSnackbar(`Circularização alterada com sucesso!`,
			{ variant: "success" })
				history.goBack();
			return
	} else {
		enqueueSnackbar(`Ocorreu um erro.`,
			{ variant: "error" })
	}
}

useEffect(() => {
	if(officesAsOptions.length > 0){
		return
	}
	if(fetchOffices === false){
		getOffices();
	}
}, [filterValues])

useEffect(() => {
	dispatch(fetchCircularizationBaseGenerationHeader({ page, pageSize, id: id}))
}, [])

	return <>
		<ScreenTemplate>
			<Form
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onSubmit}
			>
				{
					({handleSubmit, isSubmitting, dirty, setSubmitting, submitCount, values}) => (
						<form noValidate onSubmit={handleSubmit}>
							{
								isNew !== false ? <>
								<Panel title={"Geração de header base circularização"} withPadding>
								{setFilterValues(values)}
								{setFetchOffices((values?.dejurAreaId?.length === 0 || values.circularizationDate === null || values?.contingencies?.length === 0 || values?.provisionClassIds?.length === 0 || values?.spheres?.length === 0 || values?.statusIds?.length === 0) === true ? true : false)}
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<GroupedSelectFiledMultiple
										options={groupedAreasAsOptions}
										label={"Área DEJUR"}
										name='dejurAreaId'
										multiple
										required 
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<DateField
										label={"Mês da competência"}
										name="circularizationDate"
										views={['year', 'month']}
										provisionReport={true}
										format="MM-YYYY"
										required 
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={"Tipo da Contingência"}
										name='contingencies'
										options={optionsContingencyType}
										required
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={"Classe de provisão"}
										name="provisionClassIds"
										options={provisionClassesOptions}
										required
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={"Esfera"}
										name="spheres"
										options={spheresOptions}
										required
										multiple
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={"Status da pasta/CTG"}
										name='statusIds'
										options={statusFolderNumberAsOptions}
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField 
										options={closingOptionsList}
										label={t('goodsAndGuarantees:depositUpdate.fieldClosure')}
										name="closureIds"
										multiple
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										label={"Escritório"}
										name="officeIds"
										options={officesAsOptions}
										multiple
										required
										disabled={fetchOffices} 
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<CustomFieldsButton 
										marginTop={0} 
										onClick={openCustomFieldModal}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item md={8} xs={12}>
									<Clean action='Circularization'/>
								</Grid>
								<Grid item md={4} xs={12} style={{ paddingTop: 23, textAlign: 'right' }}>
										<Button
											variant="contained"
											color='primary'
											style={{ marginRight: "16px" }}
											onClick={() => history.goBack()}
										>
											{t("dataImport:goBack")}
										</Button>
										<Submit 
											type="button" 
											disabled={!dirty && !submitCount} 
											submitting={isLoading || isSubmitting} 
										/>	
								</Grid>
							</Grid>
						{!loading && isSubmitting && setSubmitting(false)} 
						</Panel>
								</> : 
								<>

								<Panel title='Circularização' withPadding>
									<Grid container spacing={3}>
			 						<Grid  item xs={12} md={3}>
												<FieldColumn 
													label='Mês/ano circularização'
													value={list[0]?.circularizationDate ?? ''}
													type='date'
												/>
									</Grid>
										<Grid item xs={12} md={3}>
												<FieldColumn 
													label='Área DEJUR'
													value={list[0]?.dejurArea.path ?? ''}
										/>
										</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn 
						label='Escritório'
						value={list[0]?.office.name ?? ''}
					/>
				</Grid> 
				<Grid item xs={12} md={3}>
					<FieldColumn 
						label='Fechamento'
						value={list[0]?.closure ?? ''}
					/>
				</Grid> 
				<Grid item xs={12} md={3}>
	
					<TextField
						name="emails"
						label={t("goodsAndGuarantees:formFlow.emails")}
						helperText={!disableWhenStatusEqualTen === true ? '' : t("goodsAndGuarantees:formFlow.emailsHelperText"
						)}
						readOnly={!disableWhenStatusEqualTen} 
						/>
				</Grid>	
				<Grid item md={12} xs={12}>
					<TextField
						rows={3} 
						unlimitedLength 
						label={'Parecer/observação'}
						name={'observation'}  
						multiline
						disabled={!disableWhenStatusEqualTen}
					/>
				</Grid> 
				<Grid item md={12} xs={12}>
					<Upload
						id='files'
						multiple
						name="files"
						disabled={!disableWhenStatusEqualTen}
					/>
					</Grid> 
					<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
									<Button
										variant="contained"
										color='primary'
										style={{ marginRight: "16px" }}
										onClick={() => setCircularizationStatus(values, 'cancel')}
										disabled={!disableWhenStatusEqualTen}
									>
										{'Cancelar'}
									</Button>
									<Button
										variant="contained"
										color='primary'
										style={{ marginRight: "16px" }}
										onClick={() => setCircularizationStatus(values, 'send')}
										disabled={!disableWhenStatusEqualTen}	
									>
										{'Enviar para Avaliação do Escritório'}
									</Button>
									<Button
										variant="contained"
										color='primary'
										style={{ marginRight: "16px" }}
										onClick={() => generateReport(values)}
									>
										{"Gerar relatório"}
									</Button>
									<Button
										variant="contained"
										color='primary'
										style={{ marginRight: "16px" }}
										onClick={() => history.goBack()}
									>
										{t("dataImport:goBack")}
									</Button>
								</Box>
								
							</Grid> 
							</Panel>
		
								<Panel title={"Lista de base circularização"} slotTopRight={
									<ComponentButton
									text="Extrato"
								
									onClick={() => modal({
										title: "",
										component: <CircularizationHeaderModal id={id}/>,
										buttons: [],
										dialogProps: {
											maxWidth: "xl",
											showCloseButton: true,
											fullWidth: true,
			
										},
									})}
									/>
								}
								slotTopRightPermission='view'
								>
									<Table
										columns={columns}
										rows={rows}
										isLoading={isLoadingTable}
									/>
								</Panel>
								<Pagination  
								page={page}
								pageSize={pageSize}
								pageCount={pageCount}
								onChangePage={onPageChange}
								onChangePageSize={onPageSizeChange}
								/>
								<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
								<Button
										variant="contained"
										color='primary'
										style={{ marginRight: "16px" }}
										onClick={() => history.goBack()}
									>
										{t("dataImport:goBack")}
									</Button>
								</Box>
								</>
							}	
					</form>
				)}
			</Form>
		</ScreenTemplate>
		</>
	};

	
export default CircularizationBaseGenerationForm;