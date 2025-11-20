import { useDispatch, useSelector } from 'react-redux';
import { Formik} from 'formik';
import { actions } from 'src/core/store';
import { Button, Submit } from 'src/components/button';
import { Box, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import NumericField from 'src/components/form/NumericField';
import { useSnackbar } from 'notistack';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress } from "@material-ui/core";

import { circularizationOfficeLaunchProcess } from 'src/core/store/modules/closed-process/thunks';
import Panel from 'src/components/Panel';
import { t } from 'src/locale/i18n';
import { CurrencyField, SelectField, TextField } from 'src/components/form';
import { useAreasResponsibleByUserIdPath, useGroupedAreas } from 'src/hooks/fetchLists';
import useProcessFilterOptions, { useProvisionClassesOptions } from 'src/hooks/useProcessFilterOptions';
import { statusFolderNumberAsOptions } from 'src/screen/settings/general/request-parameters/constants';
import ContactField from 'src/components/ContactField';
import { CONTACT_SEARCH, CONTACT_TYPE } from 'src/core/utils/constants';
import { useCurrentUser } from 'src/config/permissions';
import { getListLitigationPhasesAsOptions } from 'src/core/store/modules/litigation-phases/selectors';
import { fetchLitigationPhases } from 'src/core/store/modules/litigation-phases/thunks';
import { getListAsOptionsOrderDescription } from 'src/core/store/modules/order-description/selectors';
import { fetchOrderDescriptions } from 'src/core/store/modules/order-description/thunks';
import { addCircularizationOfficeLaunch } from 'src/core/store/modules/circularizationOfficeLaunch/thunks';
import { valuesToNumber } from 'src/core/utils/func';
import { optionsContingencyType } from '../circularizationBaseGeneration/List/Search';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

export type Props = {
	onSubmitModal?: any,
	data?: any,
}

const CTGModal = ({ data }: Props) => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { groupedAreasAsOptions } = useGroupedAreas();
	const provisionClassesOptions = useProvisionClassesOptions();
	const orderDescriptionOptions = useSelector(getListAsOptionsOrderDescription);
	const phaseOptions = useSelector(getListLitigationPhasesAsOptions);
	const [processData, setProcessData] = useState<any>();
	const [isSearchingData, setIsSearchingData] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const { userId } = useCurrentUser("");

	const { listDEJURbyUserOptions } = useAreasResponsibleByUserIdPath(userId as number);

	const options = useProcessFilterOptions();

	const { spheresOptions } = options;

	const modalId = useSelector(getLastModalOpen);

	const onClose = () =>  {
		dispatch(actions.modal.close({ modalId }))
	};

	const initialValues = {
		folderNumber: processData !== undefined ? processData?.[0]?.folderNumber : null, 
		dejurAreaId: processData !== undefined ? processData?.[0]?.dejurAreaId : null, 
		provisionClassIds: processData !== undefined ? processData?.[0]?.provisionClassId : null, 
		processNumber: processData !== undefined ? processData?.[0]?.processNumber : null,
		sphere: processData !== undefined ? processData?.[0]?.sphere : null,
		statusId: processData !== undefined ? processData?.[0]?.statusId : null,
		internalLawyerId: processData !== undefined ? processData?.[0]?.internalLawyerId : null,
		responsibleOfficeId: processData !== undefined ? processData?.[0]?.responsibleOfficeId : null,
		responsibleContactId: processData !== undefined ? processData?.[0]?.responsibleContactId : null,
		officeId: processData !== undefined ? processData?.[0]?.officeId : null,
		contingency: processData !== undefined ? processData?.[0]?.contingency : null,
		TotalPossible: processData !== undefined ? processData?.[0]?.totalPossible : null,
		TotalProbably: processData !== undefined ? processData?.[0]?.totalProbably : null,
		TotalRemote: processData !== undefined ? processData?.[0]?.totalRemote : null,
		OrderDescriptionId: processData !== undefined ? processData?.[0]?.orderDescriptionId : null,
		PhaseId: processData !== undefined ? processData?.[0]?.phaseId : null,
		ThemeObject: processData !== undefined ? processData?.[0]?.themeObject : null,
		SummaryProcessStatus: processData !== undefined ? processData?.[0]?.summaryProcessStatus : null,
		FoundationOfProbability: processData !== undefined ? processData?.[0]?.foundationOfProbability : null,
		observation: processData !== undefined ? processData?.[0]?.observation : ""
	};

	const customFields = data[0]?.circularizationBaseGenerationHeader?.customFields?.map((x: any) => x.reportFieldDictionary);
	const circularizationDate = data[0]?.circularizationBaseGeneration?.circularizationDate;
	
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

	const onSubmit = async (values: any) => {
		setIsSubmitting(true);
		const valuesToSend = {
			circularizationBaseGenerationHeaderId: data[0]?.circularizationBaseGenerationHeaderId,
			dejurAreaId: values.dejurAreaId,
			internalLawyerId: values.internalLawyerId,
			/* legalOfficerId: values., */
			officeId: values.officeId,
			responsibleContactId: values.responsibleContactId,
			contingency: values.contingency, 
			provisionClassId: values.provisionClassIds,
			/* provisionClass: "string", */
			processNumber: values.processNumber,
			sphere: values.sphere,
			phaseId: values.PhaseId,
			/* closedProcessId: values., */
			orderDescriptionId: values.OrderDescriptionId,
			folderNumber: values.folderNumber,
			statusId: values.statusId,
			totalProbably: values.TotalProbably,
			totalPossible: values.TotalPossible,
			totalRemote: values.TotalRemote,
			/* isFolderOfficeResponsibility: true, */
			observation: values.observation,
			themeObject: values.ThemeObject,
			summaryProcessStatus: values.SummaryProcessStatus,
			foundationOfProbability: values.FoundationOfProbability
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

		const {type} = await dispatch(addCircularizationOfficeLaunch(normalizedValues)) as any;

		if(type === 'addCircularizationOfficeLaunch/add/fulfilled'){
			setIsSubmitting(false);
			onClose();
			return enqueueSnackbar("Registro realizado com sucesso", {
				variant: 'success',
			});
		} else {
			setIsSubmitting(false);
			return enqueueSnackbar("Ocorreu um erro", {
				variant: "error"
			})
		}
	};

	const getProcess = async (folderNumber: any, setFieldValue: any) => {
		setIsSearchingData(true);
		const { payload } = await dispatch(circularizationOfficeLaunchProcess({monthAndYear: circularizationDate, folderNumber: folderNumber, })) as any;
		setProcessData(payload);
		setIsSearchingData(false);
		if(payload?.length === 0){
			setFieldValue('folderNumber', folderNumber)
		}
	}

	//addCircularizationOfficeLaunch ao salvar

	useEffect(() => {
		dispatch(fetchLitigationPhases({ notPaginate: true}));
		dispatch(fetchOrderDescriptions({ areaId: 31, page: 1, pageSize: 20 })) as any;
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			>
			{({ handleSubmit, values, setFieldValue }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={"Registrar / Editar CTG"} withPadding>
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<NumericField
										name='folderNumber'
										label={t('form.CTGFolder')}
									/>
								</Grid>
							<Grid item md={1} xs={2}>
								<IconButton
									aria-label='search'
									disabled={isSearchingData}
									onClick={() => getProcess(values.folderNumber, setFieldValue)}
									color='primary'
								>
								{ 
								isSearchingData === true ? <CircularProgress /> : 
								<SearchIcon />
								}
							</IconButton>
							</Grid>

							</Grid>
							</Panel>
							<Panel title={"Dados"} withPadding>
							<Grid container spacing={2}>
							<Grid item md={3} xs={3}>
									<GroupedSelectFiledMultiple
										options={groupedAreasAsOptions}
										label={"Área DEJUR"}
										name='dejurAreaId'
									/>
								</Grid>
								<Grid item xs={3} md={3}>
									<SelectField
										label={"Classe provisão"}
										name="provisionClassIds"
										options={provisionClassesOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name='processNumber'
										label={"Processo"}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={"Esfera"}
										name="sphere"
										options={spheresOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={"Status da pasta/CTG"}
										name='statusId'
										options={statusFolderNumberAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.internalLawyer')}
										name="internalLawyerId"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.InternalLawyer}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.legalResponsible')}
										name="responsibleContactId"
										contactSearch={CONTACT_SEARCH.LegalResponsible}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={"Escritório"}
										name="officeId"
										options={listDEJURbyUserOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
										<SelectField
											label={"Tipo da Contingência"}
											name='contingency'
											options={optionsContingencyType}
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
														return (
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
										name="observation"
										multiline
									/>
									</Grid>
							</Grid>
							</Panel>
							<Box mt="20px" textAlign="right">
							<Button
								text="Cancelar"
								onClick={onClose}
							/>
							<Submit submitting={isSubmitting} style={{ marginLeft: '8px' }} />
							</Box>
				</form>
			)}
		</Formik>
	)
}

export default CTGModal;