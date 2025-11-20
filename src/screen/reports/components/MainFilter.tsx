import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import {
	TextField,
	DateField,
	SelectField,
	NumericField,
	RadioGroup,
	CostCenterField,
} from 'src/components/form';
import { useFormikContext } from "formik";

import { useTranslation } from "src/locale/i18n";
import { FormikContext } from "src/components/form";
import { booleanOptions } from 'src/screen/settings/constants';
import { TReportDictionary } from 'src/core/models/report-dictionary';
import { TReportFilterField } from 'src/core/models/report-configuration';
import ContactField from 'src/components/ContactField';
import useMainFilterOptions from 'src/hooks/useProcessFilterOptions';

import { useCustomFieldModal } from '../hooks/useModal';
import { folderOptionsAsOptions, requestProvisionOptions } from '../Form/constants';
import CustomFieldsButton from './CustomFieldsButton';

import { useGroupedAreas } from 'src/hooks/fetchLists';
import ContactMultipleSelectField from 'src/components/form/ContactMultipleSelectField';
import { envolvedTypeEnumOptions } from 'src/core/models/contacts';
import { TYPE_LINK_WITH_PROCESS } from 'src/core/utils/constants';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

type Props = {
	customFieldsDictionary: TReportDictionary[],
	setCustomFields: any,
	customFields: TReportFilterField[]
}

const MainFilter = ({ customFieldsDictionary, setCustomFields, customFields }: Props) => {
	const { t } = useTranslation();
	const { showModal } = useCustomFieldModal();
	const { values } = useFormikContext<FormikContext>();

	const {
		spheresOptions,
		closingOptions,
		statusesOptions,
		resultsAsOptions,
		actionClassesOptions,
		businessAreasOptions,
		contingenciesOptions,
		speciesCategoryOptions,
		provisionClassesOptions,
		groupedAreasByIdAsOptions
	} = useMainFilterOptions()

	const { groupedAreasAsOptions } = useGroupedAreas();

	const openCustomFieldModal = () => {
		showModal({
			filterTypeName: "Filtro Principal",
			onSubmitModal: setCustomFields,
			options: customFieldsDictionary,
			customFields: customFields
		})
	}

	return (
		<Panel title={t('reports:main.title')} withPadding>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<SelectField
						options={folderOptionsAsOptions}
						label={t('reports:main.form.folderNumberOption')}
						name='folderNumberOption'
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<GroupedSelectFiledMultiple
						options={groupedAreasAsOptions}
						label={t('reports:main.form.originAreaId')}
						name='originAreaId'
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<GroupedSelectFiledMultiple
						options={groupedAreasAsOptions}
						label={t('reports:main.form.legalDepartmentAreaId')}
						name='legalDepartmentAreaId'
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactMultipleSelectField 
						name="empresa"
						label={t('reports:main.form.empresa')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.COMPANY}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField 
						name="empresaInvolved"
						label={t('reports:main.form.empresaInvolved')}
						options={envolvedTypeEnumOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactMultipleSelectField
						name='oppositePart'
						label={t('reports:main.form.oppositePart')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField 
						name="oppositePartInvolved"
						label={t('reports:main.form.oppositePartInvolved')}
						options={envolvedTypeEnumOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name='identifierNumber'
						label={t('reports:main.form.identifierNumber')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<NumericField
						name='oldNumber'
						label={t('reports:main.form.oldNumber')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<NumericField
						name='otherNumber'
						label={t('reports:main.form.otherNumber')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactMultipleSelectField
						name='opposingLawyer'
						label={t('reports:main.form.opposingLawyer')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name='folderNumber'
						label={t('reports:main.form.folderNumber')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='contingency'
						label={t('reports:main.form.contingency')}
						options={contingenciesOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='sphere'
						label={t('reports:main.form.sphere')}
						options={spheresOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='statusId'
						label={t('reports:main.form.statusId')}
						options={statusesOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='result'
						label={t('reports:main.form.result')}
						options={resultsAsOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='distributionDateInitial'
								label={t('reports:main.form.distributionDateInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='distributionDateFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='creationDateInitial'
								label={t('reports:main.form.creationDateInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='creationDateFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataComplementoCadastroInitial'
								label={t('reports:main.form.dataComplementoCadastroInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataComplementoCadastroFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='terminationDateInitial'
								label={t('reports:main.form.terminationDateInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='terminationDateFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='closingDateInitial'
								label={t('reports:main.form.closingDateInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='closingDateFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name='comarca'
						label={t('reports:main.form.comarca')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactField
						name='city'
						label={t('reports:main.form.city')}
						setInvalidValueWhenTyping
					/>
				</Grid>
				 <Grid item xs={12} md={3}>
					<ContactMultipleSelectField
						name='internalLawyer'
						label={t('reports:main.form.internalLawyer')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
					/>  
				</Grid> 
				<Grid item xs={12} md={3}>
					<ContactMultipleSelectField
						name='agent'
						label={t('reports:main.form.agent')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.AGENT}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactMultipleSelectField
						name='mainResponsible'
						label={t('reports:main.form.mainResponsible')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.RESPONSIBLE}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<GroupedSelectFiledMultiple
						name='responsibleAreaId'
						label={t('reports:main.form.responsibleAreaId')}
						options={groupedAreasByIdAsOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactMultipleSelectField
						disabled={values?.responsibleAreaId?.length === 0}
						name='officeResponsible'
						label={t('reports:main.form.officeResponsible')}
						typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OFFICE_RESPONSIBLE}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.actionType')}
						name='actionType'
						options={actionClassesOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.provisionClass')}
						name='provisionClass'
						options={provisionClassesOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CostCenterField
						name='originCostCenter'
						label={t('reports:main.form.originCostCenter')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CostCenterField
						name='costCenter'
						label={t('reports:main.form.costCenter')}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.closure')}
						name='closure'
						options={closingOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.businessArea')}
						name='businessArea'
						options={businessAreasOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.categoria')}
						name='categoria'
						options={speciesCategoryOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<RadioGroup
						name='listObjects'
						label={t('reports:main.form.objectList')}
						options={booleanOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<RadioGroup
						name='provisionOrderList'
						label={t('reports:main.form.provisionOrderList')}
						options={requestProvisionOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<RadioGroup
						name='listInvolved'
						label={t('reports:main.form.involvedList')}
						options={booleanOptions}
					/>
				</Grid>
			</Grid>
			<CustomFieldsButton onClick={openCustomFieldModal} />
		</Panel>
	)
}

export default MainFilter;