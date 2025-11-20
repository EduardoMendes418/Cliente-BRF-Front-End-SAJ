import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';

import { CheckboxField } from 'src/components/form';
import { Submit } from 'src/components/button';

import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { actions } from 'src/core/store';
import { TReportDictionary } from 'src/core/models/report-dictionary';
import { TReportFilterField } from 'src/core/models/report-configuration';
import { TFilterType } from 'src/core/models/reports';
import { t } from 'src/locale/i18n';

export type Props = {
	options: TReportDictionary[],
	filterTypeName: string,
	onSubmitModal: any,
	customFields: TReportFilterField[]
}

const CustomFieldsModal = ({ options, filterTypeName, onSubmitModal, customFields }: Props) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);
	
	const allOptions = [{ displayName: t('reports:modal.selectAll'), fieldName: 'all', id: 0 }, ...options]

	const getFormattedValues = (values: any): TReportFilterField[] => {
		const customFieldAdded = Object.keys(values)
			.filter(key => values[key] && key !== 'all')
			.map(key => ({
				fieldName: key,
				value: '',
				filterType: TFilterType.RESULT
			}))
		return customFieldAdded
	}

	const onSubmit = (values: any) => {
		onSubmitModal(getFormattedValues(values))
		dispatch(actions.modal.close({ modalId }));
	}

	const isAllChecked = (values: any) => Object.keys(values)
		.filter(key => key !== 'all' && values[key]).length === options.length;

	const checkAll = (values: any, setFieldValue: Function) => {
		const checked = !values['all'];
		Object.keys(values).forEach(key => setFieldValue(key, checked));
	}

	const check = (name: string, values: any, setFieldValue: Function) => {
		const isChecked = !values[name];
		setFieldValue('all', isAllChecked({ ...values, [name]: isChecked }));
		setFieldValue(name, isChecked);
	}

	const initialValues = allOptions.reduce((acc, elem) => {
		(acc as any)[elem.fieldName] = !!customFields.find(field => field.fieldName === elem.fieldName)
		return acc
	}, {})

	if(isAllChecked(initialValues)) (initialValues as any)['all'] = true;
	
	return (
		<>
			<Typography
				color='textSecondary'
				variant='caption'>
				{filterTypeName}
			</Typography>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, values, setFieldValue }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container alignItems='flex-start'>
							<Grid item md={12} xs={12}>
								<CheckboxField
									label={allOptions[0].displayName}
									name={allOptions[0].fieldName}
									onChange={() => checkAll(values, setFieldValue)}
									hideFormLabel
								/>
							</Grid>
							<Grid item md={12} xs={12}>
								{options.map((option) => (
									<CheckboxField
										key={option.id}
										row={true}
										label={option.displayName}
										name={option.fieldName}
										onChange={() => check(option.fieldName, values, setFieldValue)}
										hideFormLabel
									/>))}
							</Grid>
						</Grid>
						<Grid container justifyContent="flex-end">
							<Grid item xs={12} md={2} style={{ textAlign: 'end' }}>
								<Submit />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</>
	)
}

export default CustomFieldsModal;