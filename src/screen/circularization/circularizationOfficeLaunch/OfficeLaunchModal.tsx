import { useDispatch, useSelector } from 'react-redux';
import { Formik} from 'formik';
import { round } from 'lodash';
import { actions } from 'src/core/store';
import { Button, Submit } from 'src/components/button';
import { Box, Grid } from '@material-ui/core';
import { t } from 'src/locale/i18n';
import { CurrencyField, SelectField, TextField, Upload } from 'src/components/form';
import Panel from 'src/components/Panel';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { folderStatusAsOptions } from '../../settings/constants';
import FieldColumn from 'src/components/FieldColumn';
import { useEffect, useState } from 'react';
import { valuesToNumber } from 'src/core/utils/func';
import { useSnackbar } from 'notistack';
import { uploadFilesOfficeLaunch, deleteFilesOfficeLaunch, editCircularizationOfficeLaunch } from 'src/core/store/modules/circularizationOfficeLaunch/thunks';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import Logs from 'src/components/Logs';
import { getListLitigationPhasesAsOptions } from 'src/core/store/modules/litigation-phases/selectors';
import { fetchLitigationPhases } from 'src/core/store/modules/litigation-phases/thunks';
import { fetchCircularizationConfiguration } from 'src/core/store/modules/circularizationConfiguration/thunks';
import { fetchOrderDescriptions } from 'src/core/store/modules/order-description/thunks';
import { getListAsOptionsOrderDescription } from 'src/core/store/modules/order-description/selectors';
import { MessageP } from './styled';

export type Props = {
	onSubmitModal?: any,
	data?: any,
	relist?: any
}

export const isFolderOfficeResponsibilityAsOptions = [
	{ label: 'Sim', value: "true"},
	{ label: 'Não', value: "false"}
];

export const OfficeLaunchStatus = {
	1: "Pendente",
	2: "Aguardando Validação Área Jurídica",
	3: "Devolvido Escritório",
	4: "Finalizado Área Jurídica",
	5: "Aprovado Circularização",
	6: "Reprovado Circularização"
};

function isInRange(provision: number, launch: number, provisionTolerancePercentage: any) {
	const percentValue = round(provisionTolerancePercentage, 2) * round(provision, 2) / 100;
	const minValue = round(provision, 2) - round(percentValue, 2);
	const maxValue = round(provision, 2) + round(percentValue, 2);
	const actualValue = round(launch, 2);
	
	if (actualValue === provision || actualValue <= minValue || actualValue >= maxValue) return true;
	return false;
}

const validate = ( initialValues: any , tolerancePercentage: number | undefined, newValues: any ) => {
		const normalizedValues = {
			...(valuesToNumber(
				[
					"TotalProbably",
					"TotalPossible",
					"TotalRemote"
				],
				newValues
			) as any)}

	const message = <MessageP>"Percentual de ajuste do valor do pedido de provisão MENOR que parametrizado para áreajurídica. Manter o valor de provisão atual.";</MessageP>
	
	if(initialValues?.totalProbably !== 0 && isInRange(initialValues?.totalProbably, normalizedValues.TotalProbably, tolerancePercentage) === false){  
		return { TotalProbably: message}
	} else if(initialValues?.totalPossible !== 0 && isInRange(initialValues?.totalPossible, normalizedValues.TotalPossible, tolerancePercentage) === false){  
		return { TotalPossible: message }
	} else if(initialValues?.totalRemote !== 0 && isInRange(initialValues?.totalRemote, normalizedValues.TotalRemote, tolerancePercentage) === false){  
		return { TotalRemote: message}
	}     
};

const OfficeLaunchModal = ({ data, relist }: Props) => {
	const dispatch = useDispatch();
	const phaseOptions = useSelector(getListLitigationPhasesAsOptions);
	const orderDescriptionOptions = useSelector(getListAsOptionsOrderDescription);
	const options = useProcessFilterOptions();
	const [newValues, setNewValues] = useState<any>();
	const [tolerancePercentage, setTolerancePercentage] = useState<number | undefined>();
	const { enqueueSnackbar } = useSnackbar();
	const modalId = useSelector(getLastModalOpen);

	const onClose = () =>  {
		relist()
		dispatch(actions.modal.close({ modalId }))
	};
	
	const {
		spheresOptions,
	} = options;

	const getData = async () => {
		const { payload } = await dispatch(fetchCircularizationConfiguration({DejurAreaIds: [data.dejurAreaId]})) as any;
		setTolerancePercentage(payload?.items[0]?.provisionTolerancePercentage);
	};

	const customFields = data?.circularizationBaseGenerationHeader?.customFields?.map((x: any) => x.reportFieldDictionary);
	const { circularizationBaseGeneration, circularizationBaseGenerationHeader } = data;

	const permissionToEdit = circularizationBaseGenerationHeader.status !== 2 || circularizationBaseGenerationHeader.status !== 4;
	
	const fixedFields = [
		{ label: 'Área DEJUR', value: circularizationBaseGeneration?.dejurArea?.path},
		{ label: 'Classe provisão', value: circularizationBaseGeneration?.provisionClass},
		{ label: 'Processo', value: circularizationBaseGeneration?.processNumber},
		{ label: 'Esfera', value: circularizationBaseGeneration?.sphere},
		{ label: 'Status', value: folderStatusAsOptions[circularizationBaseGeneration?.statusId]},
		{ label: 'CTG', value: circularizationBaseGeneration?.folderNumber},
		{ label: 'Advogado interno', value: circularizationBaseGeneration?.internalLawyer?.name},
		{ label: 'Resp. jurídico', value: circularizationBaseGeneration?.responsibleContact?.name},
		{ label: 'Escritório', value: circularizationBaseGeneration?.office?.name},
		{ label: 'Fase', value: circularizationBaseGeneration?.phase?.name},
		{ label: "Total provável", value: circularizationBaseGeneration?.totalProbably},
		{ label: "Total possível", value: circularizationBaseGeneration?.totalPossible},
		{ label: "Total remoto", value: circularizationBaseGeneration?.totalRemote},
	];

	const initialValues: any = {
		TotalProbably: data?.totalProbably,
		TotalPossible: data?.totalPossible,
		TotalRemote: data?.totalRemote,
		OrderDescriptionId: data?.orderDescriptionId,
		Observation: data?.observation,
		PhaseId: data?.phaseId,
		IsFolderOfficeResponsibility: data?.isFolderOfficeResponsibility ?? null,
		files: data?.files,
		SummaryProcessStatus: data?.summaryProcessStatus ?? null,
		ThemeObject: data?.themeObject ?? null,
		FoundationOfProbability: data?.foundationOfProbability ?? null,
	};

	const onSubmit = async (values: any) => {
		const valuesToSend = {
			orderDescriptionId: newValues?.orderDescriptionId ?? data?.orderDescriptionId,
			totalProbably: newValues?.TotalProbably !== null ? newValues?.TotalProbably : data?.totalProbably,
			totalPossible: newValues?.TotalPossible !== null ? newValues?.TotalPossible : data?.totalPossible,
			totalRemote: newValues?.TotalRemote !== null ? newValues?.TotalRemote : data?.totalRemote,
			isFolderOfficeResponsibility: newValues?.IsFolderOfficeResponsibility ?? data?.isFolderOfficeResponsibility, 
			observation: newValues?.Observation?.length !== 0 ? newValues?.Observation : data?.observation,
			statusFlowId: 0,
			phaseId: newValues?.PhaseId !== null ? newValues?.PhaseId : data?.phaseId,
			circularizationOfficeLaunchIds: [data?.id],
			themeObject: newValues?.ThemeObject !== null ? newValues?.ThemeObject : data?.themeObject,
			summaryProcessStatus: newValues?.SummaryProcessStatus !== null ? newValues?.SummaryProcessStatus : data?.summaryProcessStatus,
			foundationOfProbability: newValues?.FoundationOfProbability !== null ? newValues?.FoundationOfProbability : data?.foundationOfProbability
		} 
	
		const normalizedValues = {
				...(valuesToNumber(
					[
						"totalProbably",
						"totalPossible",
						"totalRemote"
					],
					valuesToSend
		) as any)}
			
		const {payload} = await dispatch(editCircularizationOfficeLaunch(normalizedValues)) as any;
			
		if(payload?.status === 204){
				if(values.files !== undefined){
					const normalizeFiles = Array.from(values.files || [])
					dispatch(uploadFilesOfficeLaunch({
							circularizationOfficeLaunchId: data?.id,
							filesList: normalizeFiles as unknown as FileList,
							isMainFile: false
			}))
				}
				relist();
				return (
				enqueueSnackbar("Lançamento editado com sucesso", {
					variant: 'success',
				}),
				dispatch(actions.modal.close({ modalId }))
				)
		} else {
				return enqueueSnackbar("Ocorreu um erro", { variant: 'error', }), dispatch(actions.modal.close({ modalId }))
		}
	};

	const setSelectOptions = (fieldName: string) => {
		switch(fieldName){
			case "OrderDescriptionId":
				return orderDescriptionOptions
			case "Sphere":
				return spheresOptions
			case "PhaseId":
				return phaseOptions
			default: 
				return []	
		}
	};

	const onDeleteFile = async (file: any) => {
		if (file && file.id) { 
			dispatch(deleteFilesOfficeLaunch(file.id)) as any; 
		}  
	}; 

	useEffect(() => {
		dispatch(fetchLitigationPhases({ notPaginate: true}));
		dispatch(fetchOrderDescriptions({ areaId: 31, page: 1, pageSize: 20 })) as any;
		getData();
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			validate={() => validate(data, tolerancePercentage, newValues)}
			>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					{setNewValues(values)}
						<Panel title={"Dados do lançamento"} withPadding>
							<Grid container spacing={3}>
								{
									fixedFields.map((x) => {
										return (
											<Grid key={x.value} item xs={12} md={3}>
											<FieldColumn 
												type={typeof x.value === 'number' ? 'currency' : undefined} 
												label={x.label} 
												value={x.value}									
											/>
											</Grid>
										)
									})
								}
							</Grid>
						</Panel>
					{
						permissionToEdit ? <>
							<Panel title={t('requisitions:service.title')} withPadding>
								<Grid container spacing={2}>
								<Grid item md={3} spacing={3}> 
											<SelectField
												options={isFolderOfficeResponsibilityAsOptions}
												label={"CTG na Base do Escritório?"}
												name="IsFolderOfficeResponsibility"
											/>
									</Grid> 
									{
										customFields?.map(((x: any) => {
											switch(x?.fieldType){
												case 'Select':
													return (
														<Grid item md={3} spacing={3}> 
															<SelectField
																options={setSelectOptions(x?.fieldName)}
																label={x?.displayName}
																name={x?.fieldName}
															/>
													</Grid>
													)
												case 'Currency':
													return (
														<Grid item md={3} spacing={3}> 
															<CurrencyField
																label={x?.displayName}
																name={x?.fieldName}   
															/>
														</Grid>
													)
													case 'TextField':
														return ( x.fieldName === "ThemeObject" || "SummaryProcessStatus" || 			"FoundationOfProbability" ? 
														<Grid item md={12} xs={12}>
																<TextField
																	rows={3} 
																	unlimitedLength 
																	label={x?.displayName}
																	name={x?.fieldName}  
																	multiline
																/>
														</Grid> :
															<Grid item md={3} spacing={3}> 
																<TextField
																	label={x?.displayName}
																	name={x?.fieldName}   
																/>
															</Grid>
																)			
												}
																					
											return null;
										}))
									} 
									<Grid item md={12} xs={12}> 
											<TextField
												rows={3} 
												unlimitedLength 
												label={"Observação"}
												name="Observation"
												multiline
											/>
									</Grid>
								</Grid>
							</Panel>
							<Panel
								title="Anexos"
								withPadding
							>
								<Upload
									id='files'
									multiple
									name="files"
									confirmDeletionGoodsAndGuarantees
									onDelete={(file) => onDeleteFile(file)}
								/>
							</Panel>
						</> : null
					}
					{data?.statusFlowId === 3 ? 
					<Panel title="Avaliação Jurídico" withPadding>
							<Grid container spacing={2}>
								<FieldColumn 
									label={"Análise do responsável"} 
									value={data?.analysisResponsible}									
								/>
							</Grid>	
					</Panel> : null }
					<Logs
						logs={data?.logs}
						statuses={OfficeLaunchStatus}
						statusOrder={["approvalCenter"]}
					/>
					<Grid container justifyContent="flex-end">
						<Box mt={3} justifyContent="flex-start" style={{position: "absolute", zIndex: 9999, bottom: 2, marginTop: "2px", marginBottom: '6px' }}>
							<Button
								text="Cancelar"
								onClick={onClose}
							/>
							<Submit disabled={!permissionToEdit}style={{ marginLeft: '8px' }} />
						</Box>
					</Grid>	
				</form>
			)}
		</Formik>
	)
}

export default OfficeLaunchModal;