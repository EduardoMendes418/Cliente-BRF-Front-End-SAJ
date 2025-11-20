import { useDispatch, useSelector } from 'react-redux';
import { Formik} from 'formik';
import { actions } from 'src/core/store';
import { Button, Submit } from 'src/components/button';
import { Box, Grid } from '@material-ui/core';

import { t } from 'src/locale/i18n';

import { SelectField, TextField, Upload } from 'src/components/form';
import Panel from 'src/components/Panel';
import { folderStatusAsOptions } from '../../settings/constants';
import FieldColumn from 'src/components/FieldColumn';
import { useState } from 'react';
import { valuesToNumber } from 'src/core/utils/func';
import { useSnackbar } from 'notistack';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import Logs from 'src/components/Logs';
import { deleteFilesLegalLaunch, editCircularizationLegalLaunch, uploadFilesLegalLaunch } from 'src/core/store/modules/circularizationLegalLaunch/thunks';

export type Props = {
	onSubmitModal?: any,
	data?: any,
	relist?: any
}

export const OfficeLaunchStatus = {
	1: "Pendente",
	2: "Aguardando Validação Área Jurídica",
	3: "Devolvido Escritório",
	4: "Finalizado Área Jurídica",
	5: "Aprovado Circularização",
	6: "Reprovado Circularização"
  };

const LegalLaunchModal = ({ data, relist }: Props) => {

	const dispatch = useDispatch();
	const [newValues, setNewValues] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	const modalId = useSelector(getLastModalOpen);

	const onClose = () =>  {
		relist()
		dispatch(actions.modal.close({ modalId }))
	};

	const circularizationBaseGeneration = data?.circularizationBaseGeneration;
	const circularizationOfficeLaunch = data?.circularizationOfficeLaunch;
	const circularizationHeaderStatus = data?.circularizationBaseGenerationHeader?.status;
	const customFields = data?.circularizationBaseGenerationHeader?.customFields?.map((x: any) => x.reportFieldDictionary);

	const fixedFieldsBaseGeneration = [
		{ label: 'Área DEJUR', value: circularizationBaseGeneration?.dejurArea?.name},
		{ label: 'Classe provisão', value: circularizationBaseGeneration?.provisionClass},
		{ label: 'Processo', value: circularizationBaseGeneration?.processNumber},
		{ label: 'Esfera', value: circularizationBaseGeneration?.sphere},
		{ label: 'Status', value: folderStatusAsOptions[circularizationBaseGeneration?.statusId]},
		{ label: 'CTG', value: circularizationBaseGeneration?.folderNumber},
		{ label: 'Advogado interno', value: circularizationBaseGeneration?.internalLawyer?.name},
		{ label: 'Resp. jurídico', value: circularizationBaseGeneration?.responsibleOffice?.name},
		{ label: 'Escritório', value: circularizationBaseGeneration?.office?.name},
		{ label: 'Fase', value: circularizationBaseGeneration?.phase?.name},
		{ label: "Total provável", value: circularizationBaseGeneration?.totalProbably, isColorful: circularizationBaseGeneration?.totalProbably !== circularizationOfficeLaunch?.totalProbably},
		{ label: "Total possível", value: circularizationBaseGeneration?.totalPossible, isColorful: circularizationBaseGeneration?.totalPossible !== circularizationOfficeLaunch?.totalPossible},
		{ label: "Total remoto", value: circularizationBaseGeneration?.totalRemote, isColorful: circularizationBaseGeneration?.totalRemote !== circularizationOfficeLaunch?.totalRemote},

	];

	const fixedFieldsOfficeLaunch = [
		{ label: 'Fase', value: circularizationOfficeLaunch?.phase?.name, longText: false},
		{ label: "Total provável", value: circularizationOfficeLaunch?.totalProbably, isColorful: circularizationBaseGeneration?.totalProbably !== circularizationOfficeLaunch?.totalProbably, longText: false},
		{ label: "Total possível", value: circularizationOfficeLaunch?.totalPossible, isColorful: circularizationBaseGeneration?.totalPossible !== circularizationOfficeLaunch?.totalPossible, longText: false},
		{ label: "Total remoto", value: circularizationOfficeLaunch?.totalRemote, isColorful: circularizationBaseGeneration?.totalRemote !== circularizationOfficeLaunch?.totalRemote, longText: false}, 
		{ label: "CTG na Base do Escritório?", value: circularizationOfficeLaunch?.isFolderOfficeResponsibility === false ? "Não" : "Sim", longText: false},
		{ label: "Tema / Objeto", value: circularizationOfficeLaunch?.themeObject, longText: true},
		{ label: "Sumário / Situação do Processo", value: circularizationOfficeLaunch?.summaryProcessStatus, longText: true},
		{ label: "Fundamento da Probabilidade", value: circularizationOfficeLaunch?.foundationOfProbability, longText: true},
		{ label: "Observação", value: circularizationOfficeLaunch?.observation, longText: true},
	]

	const filteredFixedFieldsOfficeLaunch = fixedFieldsOfficeLaunch?.filter((field) =>
		customFields?.some((customField: any) => customField?.displayName?.toUpperCase() === field?.label?.toUpperCase())
	)

	const initialValues: any = {
		IsFolderOfficeResponsibility: null,
		isFolderRectifiedInBRF: data?.isFolderRectifiedInBRF.toString(),
		analysisResponsible: data?.analysisResponsible,
		files: data?.files,
		FoundationOfProbability: circularizationBaseGeneration?.foundationOfProbability,
		SummaryProcessStatus: circularizationBaseGeneration?.summaryProcessStatus,
		ThemeObject: circularizationBaseGeneration?.themeObject,
	}

	const isFolderRectifiedInBRFAsOptions = [
		{ label: 'Sim', value: "true"},
		{ label: 'Não', value: "false"}
	]

	const onSubmit = async (values: any, isReviewRequired?: boolean) => {

	const valuesToSend = {
		circularizationOfficeLaunchId: data?.circularizationOfficeLaunchId,
		circularizationBaseGenerationId: data?.circularizationBaseGenerationId,
		orderDescriptionId: data?.orderDescriptionId,
		isFolderOfficeResponsibility: newValues?.IsFolderOfficeResponsibility ?? data?.isFolderOfficeResponsibility, 
		createdDate: data?.createdDate,
		createdBy: data?.createdBy,
		updatedDate: data?.updatedDate,
		updatedBy: null,
		isDeleted: false,
		id: data?.id, 
		circularizationBaseGenerationHeaderId: data?.circularizationBaseGenerationHeaderId,
		isInconsistencyFound: newValues?.isInconsistencyFound !== null ? newValues?.isInconsistencyFound : null,
		analysisResponsible: newValues?.analysisResponsible !== null ? newValues?.analysisResponsible : null,
		isFolderRectifiedInBRF: newValues?.isFolderRectifiedInBRF !== null ? (newValues?.isFolderRectifiedInBRF === 'false' ? false : true) : null,
		statusFlowId: isReviewRequired === false ? 1 : 2
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

			const {payload} = await dispatch(editCircularizationLegalLaunch(normalizedValues)) as any 
			
				if(payload?.status === 204){
				if(values.files !== undefined){
					const normalizeFiles = Array.from(values.files || []);
					dispatch(uploadFilesLegalLaunch({
						circularizationLegalLaunchId: data?.id,
						filesList: normalizeFiles as unknown as FileList,
						isMainFile: false
					})) as any; 
				}
				relist()
				return (
				enqueueSnackbar(`Lançamento ${isReviewRequired === false ? "editado" : "devolvido"} com sucesso`, {
					variant: 'success',
				}),
				dispatch(actions.modal.close({ modalId }))
				)
			} else {
				return( 
					enqueueSnackbar("Ocorreu um erro", {
					variant: 'error',
				}),
				dispatch(actions.modal.close({ modalId }))
				)
			} 
	}

	const onDeleteFile = async (file: any) => {
		if (file && file.id) { 
			dispatch(deleteFilesLegalLaunch(file.id)) as any; 
			relist()
		}  
	}; 

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={(values) => onSubmit(values, false)}
			enableReinitialize
			>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					{setNewValues(values)}
						<Panel title={"Dados do lançamento"} withPadding>
					<Grid container spacing={3}>
						{
							fixedFieldsBaseGeneration.map((x) => {
								return (
									<Grid item key={x.value} xs={12} md={3}>
									<FieldColumn
										type={typeof x.value === 'number' ? 'currency' : undefined} 
										label={x.label} 
										value={x.value}
										coloredValueCircularization={x.isColorful}
									/>
									</Grid>
								)
							})
						}
				{
							customFields?.map(((x: any) => {
											switch(x?.fieldType){
													case 'TextField':
														return ( x.fieldName === "ThemeObject" || "SummaryProcessStatus" || 		"FoundationOfProbability" ? 
														<Grid item md={12} xs={12}>
																<TextField
																	rows={3} 
																	unlimitedLength 
																	label={x?.displayName}
																	name={x?.fieldName}  
																	multiline
																	readOnly
																/>
														</Grid> :
															<Grid item md={3} spacing={3}> 
																<TextField
																	label={x?.displayName}
																	name={x?.fieldName}
																	readOnly   
																/>
															</Grid>
																)			
												}
																					
											return null;
										}))
									} 
					</Grid>
					</Panel>
					<Panel title={"Dados do Escritório"} withPadding>
					<Grid container spacing={3}>
						{
							filteredFixedFieldsOfficeLaunch.map((x) => {
								if(x.longText === true){
									return <Grid key={x.value} item md={12} xs={12}>
									<FieldColumn 
										type={typeof x.value === 'number' ? 'currency' : undefined} 
										label={x.label} 
										value={x.value}
										coloredValueCircularization={x.isColorful}
										multiline
									/>
								</Grid>
								} else {
									return <Grid item key={x.value} xs={12} md={3}> 
									<FieldColumn 
										type={typeof x.value === 'number' ? 'currency' : undefined} 
										label={x.label} 
										value={x.value}
										coloredValueCircularization={x.isColorful}
									/>
								</Grid>
								}
							})
						}
					</Grid>
					</Panel>
					{ 
						circularizationHeaderStatus === 2 ? (
							<>
							<Panel title={t('requisitions:service.title')} withPadding>
							<Grid container spacing={2}>							
								<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
										<SelectField
											options={isFolderRectifiedInBRFAsOptions}
											label={"Será retificada a ctg no sistema?"}
											name="isFolderRectifiedInBRF"
										/>
										</Grid> 
										<Grid item md={12} xs={12}>
										<TextField
											label={"Análise da área jurídica responsável"}
											name="analysisResponsible"
											multiline
										/>
								</Grid>
								</Grid>
								</Grid>
						</Panel>
							<Panel
                            title="Anexos"
                            withPadding
                        >
                            <Upload
                                multiple
                                name="files"
								confirmDeletionGoodsAndGuarantees
                                onDelete={(file) => onDeleteFile(file)}
                            />
                        </Panel>
						<Logs
                            logs={data?.logs}
                            statuses={OfficeLaunchStatus}
                            statusOrder={["approvalCenter"]}
                        />
							<Grid container justifyContent="flex-end" className='margin-top-16'>
						<Box mt={3} display="flex" justifyContent="flex-end">
							<Button
								style={{marginRight: '8px'}}
								text="Devolver"
								onClick={() => {onSubmit(values, true)}}
							/>
							<Button
								text="Cancelar"
								onClick={onClose}
							/>
							<Submit style={{ marginLeft: '8px' }} />
						</Box>
					</Grid>	
							</>
						)  : null
					}		
				</form>
			)}
		</Formik>
	)
}

export default LegalLaunchModal;