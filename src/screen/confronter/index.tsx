import { useEffect, useRef } from 'react'
import { Grid } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { FormikHelpers, FormikProvider, useFormik } from 'formik'

import ScreenTemplate from 'src/components/Screen'
import Panel from 'src/components/Panel'
import { SelectField, TextField, NumericField, DateField } from 'src/components/form'
import ContactField from 'src/components/ContactField'
import { Clean, Submit } from 'src/components/button'
import { useGroupedAreas, useGroupedAreasById } from 'src/hooks/fetchLists'
import { useContingencyTypeOptions, useStatusProcessOptions } from 'src/hooks/useProcessFilterOptions'
import { useExpectationOptions, useOrderDescriptionOptions } from 'src/hooks/useProvisionFilterOptions'
import { usePagination } from 'src/hooks/pagination'
import { fetchConfrontingOrders } from 'src/core/store/modules/confronting-orders/thunks'
import { actions } from 'src/core/store';
import { t } from 'src/locale/i18n'
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants"

import ConfrontingTable from './components/ConfrontingTable'
import { confronterStatusOptionsNivel2, confronterStatusOptionsNivel1, confronterPhaseOptions, CONFRONTER_STATUS } from './utils/constants'
import { getConfrontingOrdersFilters, getConfrontingOrdersIsLoading } from 'src/core/store/modules/confronting-orders/selectors'
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple'

type Form = {
	legalDepartmentAreaId: string
	companyId: string
	processNumber: string
	oppositePartyId: string
	folderNumber: string
	contingency: string
	statusProcess: string
	expectationId: string
	internalLawyerId: string
	agentId: string
	legalResponsibleId: string
	responsibleAreaId: string
	responsibleId: string
	orderDescriptionId: string
	confronterPhase: string
	StatusFlowLevel1?: number[]
	StatusFlowLevel2?: number[]
	statusFlowId?: number[]
	responsible: string,
	createdDateStart: string | null
	createdDateEnd: string | null

}

const initialValues: Form = {
	legalDepartmentAreaId: '',
	companyId: '',
	processNumber: '',
	oppositePartyId: '',
	folderNumber: '',
	contingency: '',
	statusProcess: '',
	expectationId: '',
	internalLawyerId: '',
	agentId: '',
	legalResponsibleId: '',
	responsibleAreaId: '',
	responsibleId: '',
	orderDescriptionId: '',
	confronterPhase: '',
	StatusFlowLevel1: [],
	StatusFlowLevel2: [],
	statusFlowId: [],
	responsible: '',
	createdDateStart: null,
	createdDateEnd: null
}

const Confronter = () => {
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const isFirstMountRef = useRef(true);

	const filters = useSelector(getConfrontingOrdersFilters);
	const isLoading = useSelector(getConfrontingOrdersIsLoading);
	const { groupedAreasAsOptions} = useGroupedAreas();
	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	const contingenciesOptions = useContingencyTypeOptions();
	const statusProcessOptions = useStatusProcessOptions();
	const expectationOptions = useExpectationOptions();
	const orderDescriptionOptions = useOrderDescriptionOptions();

	const onSubmit = async (values: Form, { setSubmitting }: FormikHelpers<Form>) => {
		const normalizeValues = { ...values, page, pageSize }
		dispatch(actions.confrontingOrders.setFilters({ ...normalizeValues}))
		setSubmitting(false)
	}

	const formikContextData = useFormik({ initialValues, onSubmit, enableReinitialize: true })

	useEffect(() => {
		if (isFirstMountRef.current) {
			formikContextData.setFieldValue('StatusFlowLevel2', [CONFRONTER_STATUS.PENDENTE_NIVEL_2])
			const firstFilter = { StatusFlowLevel2: [CONFRONTER_STATUS.PENDENTE_NIVEL_2], page, pageSize }
			dispatch(actions.confrontingOrders.setFilters(firstFilter))
		}
	
	}, [])

	useEffect(() => {
		if (isFirstMountRef.current) {
			isFirstMountRef.current = false
			return
		}
		dispatch(fetchConfrontingOrders({ ...filters, page, pageSize }))
	}, [dispatch, filters, page, pageSize])

	return (
		<ScreenTemplate>
			<Panel title={t('confronter:filterTitle')} withPadding>
				<FormikProvider value={formikContextData}>
						<form noValidate onSubmit={formikContextData.handleSubmit}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										label={t('field.dejurArea')}
										name="legalDepartmentAreaId"
										options={groupedAreasAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.company')}
										name="companyId"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.COMPANY}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField
										label={t('field.process')}
										name="processNumber"
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.opposingPart')}
										name="oppositePartyId"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<NumericField
										label={t('field.ctgFolder')}
										name="folderNumber"
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t('field.contingencyType')}
										name="contingency"
										options={contingenciesOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t('field.processStatus')}
										name="statusProcess"
										options={statusProcessOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t('field.expectation')}
										name="expectationId"
										options={expectationOptions}
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
										label={t('field.agent')}
										name="agentId"
										contactSearch={CONTACT_SEARCH.Agent}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.legalResponsible')}
										name="legalResponsibleId"
										contactSearch={CONTACT_SEARCH.LegalResponsible}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<GroupedSelectFiledMultiple
										label={t('field.office')}
										name="responsibleAreaId"
										options={groupedAreasByIdAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										label={t('field.officeResponsible')}
										name="responsibleId"
										contactType={CONTACT_TYPE.PERSON}
										contactSearch={CONTACT_SEARCH.OfficeResponsible}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t('field.orderDescription')}
										name="orderDescriptionId"
										options={orderDescriptionOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										label={t('field.confronterPhase')}
										name="confronterPhase"
										options={confronterPhaseOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										multiple
										label={"Status confrontador primeiro nível"}
										name="StatusFlowLevel1"
										options={confronterStatusOptionsNivel1}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectField
										multiple
										label={"Status confrontador segundo nível"}
										name="StatusFlowLevel2"
										options={confronterStatusOptionsNivel2}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<ContactField
										labelValueTarget
										label={t('field.responsible')}
										name="responsible"
										contactType={CONTACT_TYPE.PERSON}
									/>
								</Grid>
										<Grid item xs={12} md={3}>
											<DateField
												name="createdDateStart"
												label={"Data da solicitação de"}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<DateField
												name="createdDateEnd"
												label={"Data da solicitação até"}
											/>
										</Grid>
								<Grid container spacing={2} alignItems='center'>
									<Grid item md={6} xs={6}>
										<Clean action='confrontingOrders' />
									</Grid>
									<Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
										<Submit
											type="search"
											disabled={isLoading}
											submitting={isLoading}
										/>
									</Grid>
								</Grid>
							</Grid>
						</form>
				</FormikProvider>
			</Panel>

			<ConfrontingTable isLoading={isLoading} />
		</ScreenTemplate>
	)
}

export default Confronter
