import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@material-ui/core'
import { useFormikContext } from 'formik'

import Panel from 'src/components/Panel'
import { SelectField, DateField, RadioGroup } from 'src/components/form'
import ComarcaField from 'src/components/ComarcaField';
import { Clean, Submit } from 'src/components/button';
import { getLoadingFetchingSmartSwap } from 'src/core/store/modules/smart-swap/selectors';
import { useTranslation } from 'src/locale/i18n';
import { useGroupedAreas, useStatesAndCities } from 'src/hooks/fetchLists';
import { processTypeOptions, processPhasesOptions, TYPE_LINK_WITH_PROCESS, CONTACT_TYPE, CONTACT_SEARCH } from 'src/core/utils/constants';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { TSmartSwapFilter } from 'src/core/models/smart-swap';
import CTGOption from 'src/screen/data-import/components/CTGOption'
import { actions } from 'src/core/store';
import ContactFieldMultiple from 'src/components/ContactFieldMultiple';
import CostCenterMultipleField from 'src/components/form/CostcenterMultipleField';
import {useLitigationJustice} from "../../../hooks/litigationJustice";
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

type TSearchProps = {
	options: ReturnType<typeof useProcessFilterOptions>
}

const Search = ({ options }: TSearchProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch()

	const { values, handleSubmit, isSubmitting, resetForm, initialValues } = useFormikContext<TSmartSwapFilter>()
	const {options: litigationOptions} = useLitigationJustice()

	const {
		actionClassesOptions,
		businessAreasOptions,
		closingOptions,
		contingenciesOptions,
		provisionClassesOptions,
		resultsAsOptions,
		speciesCategoryOptions,
		spheresOptions,
		statusesOptions,
		groupedAreasByIdAsOptions
	} = options;

	const { statesAsOptions, citiesAsOptions } = useStatesAndCities(values.stateId || 0);
	const { groupedAreasAsOptions } = useGroupedAreas();

	const loading = useSelector(getLoadingFetchingSmartSwap);

	const enabledSubmit = values === initialValues;
	const enableComarcaField = (values.justiceIds && values.stateId !== null) ?? false;

	const clearFrom = () => {
		dispatch(actions.smartSwap.clearList())
		resetForm()
	}

	return (
		<form noValidate 
		onSubmit={handleSubmit}
		autoComplete="off">
			<Panel title={t('dataImport:smartswap.filter.title')} withPadding>
				<Grid container spacing={3}>
					<CTGOption foldersName="foldersNumber" />
					<Grid item xs={12} md={3}>
						<GroupedSelectFiledMultiple
							multiple
							label={t('dataImport:smartswap.filter.originArea')}
							name="originAreaId"
							options={groupedAreasAsOptions}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<GroupedSelectFiledMultiple
							multiple
							label={t('dataImport:smartswap.filter.dejurArea')}
							name="legalDepartmentAreaId"
							options={groupedAreasAsOptions}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.distributionDateStart')}
									name="distributionDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.to')}
									name="distributionDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.registrationDateStart')}
									name="creationDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.to')}
									name="creationDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.complementRegistrationDateStart')}
									name="registrationComplementDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.to')}
									name="registrationComplementDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.dischargeDateStart')}
									name="terminationDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.to')}
									name="terminationDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.closingDateStart')}
									name="closingDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('dataImport:smartswap.filter.to')}
									name="closingDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.result')}
							name="result"
							options={resultsAsOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.contigencyType')}
							name="contingency"
							options={contingenciesOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.status')}
							name="statusId"
							options={statusesOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.type')}
							name="type"
							options={processTypeOptions}
							multiple
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name='stateId'
							label={t('dataImport:smartswap.filter.state')}
							options={statesAsOptions}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name='cityId'
							label={t('dataImport:smartswap.filter.city')}
							options={citiesAsOptions}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField 
							options={litigationOptions} 
							name="justiceIds"
						  	label={t("dataImport:smartswap.filter.JusticeIds")}
							/>
					</Grid>
					<Grid item xs={12} md={3}>
						<ComarcaField
							label={t('dataImport:smartswap.filter.judicialDistrict')}
							name="JurisdictionsIds"
							justiceId={values.justiceIds}
							stateId={values.stateId}
							disabled={!enableComarcaField || typeof values.stateId !== 'number'}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<ContactFieldMultiple
							label={t('dataImport:smartswap.filter.location')}
							name="LocationIds"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<ContactFieldMultiple
							label={t('dataImport:smartswap.filter.agent')}
							name="AgentIds"
							getOptionsTypeLinkWithTheProcess={true}
							typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<ContactFieldMultiple
							label={t('dataImport:smartswap.filter.internalLawyer')}
							name="InternalLawyerIds"
							getOptionsTypeLinkWithTheProcess={true}
							typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<ContactFieldMultiple
							label={t('dataImport:smartswap.filter.mainResponsible')}
							name="LegalResponsibleIds"
							getOptionsTypeLinkWithTheProcess={true}
							typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.RESPONSIBLE}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<GroupedSelectFiledMultiple
							label={t('dataImport:smartswap.filter.responsibleArea')}
							name="responsibleAreaId"
							options={groupedAreasByIdAsOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<ContactFieldMultiple
							label={t('dataImport:smartswap.filter.reponsibleAreaResponsible')}
							name="ResponsibleOfficeIds"
							contactType={CONTACT_TYPE.PERSON}
							contactSearch={CONTACT_SEARCH.OfficeResponsible}
							
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.stage')}
							name="phasesId"
							options={processPhasesOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.actionClass')}
							name="actionClassId"
							options={actionClassesOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.provisionClass')}
							name="provisionClassId"
							options={provisionClassesOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.closing')}
							name="closureId"
							options={closingOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<CostCenterMultipleField
							label={t('dataImport:smartswap.filter.costCenter')}
							name="CostCenters"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<CostCenterMultipleField
							label="Centro de custo origem"
							name="OriginCostCenterIds"
							getFromSmartSwap
							sendId
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.sphere')}
							name="sphere"
							options={spheresOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.businessArea')}
							name="businessAreaId"
							options={businessAreasOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('dataImport:smartswap.filter.category')}
							name="categorySpeciesId"
							options={speciesCategoryOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<RadioGroup
							isDeselectable
							label={t('dataImport:smartswap.filter.valuedProcess')}
							name="valuedProcess"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Box mt="-15px" mb="-15px">
							<Clean onClick={clearFrom} />
						</Box>
					</Grid>
				</Grid>
			</Panel>
			<Box mt="20px" textAlign="right">
				<Submit
					disabled={loading || enabledSubmit}
					submitting={loading || isSubmitting}
					text={t('dataImport:smartswap.filter.generateList')}
				/>
			</Box>
		</form>
	);
}

export default Search
