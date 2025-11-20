import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormikHelpers } from 'formik';

import { addReportConfiguration, editReportConfiguration } from 'src/core/store/modules/report-configuration/thunks'
import { getItemReportConfiguration, getHasItemReportConfiguration } from 'src/core/store/modules/report-configuration/selectors';
import { TReportComponent } from 'src/core/models/reports';

import { formatFilterFields } from '../Form/utils';
import { useFieldNameModal } from './useModal';
import { TReportFilterField } from 'src/core/models/report-configuration';

export const useSaveReportConfiguration = ({ reportComponent }: { reportComponent: TReportComponent }) => {
	const dispatch = useDispatch();
	const { showModal } = useFieldNameModal();

	const item = useSelector(getItemReportConfiguration);
	const hasItem = useSelector(getHasItemReportConfiguration);

	const onSaveConfiguration = useCallback(
		(
			{RequesterIds, ...values}: any,
			customFields: TReportFilterField[],
			filterName: string,
			isPublic: boolean
		) => {
			const formattedFilterValues = formatFilterFields(values, customFields);
			const bodyFormatted = {
				filterName,
				reportComponent,
				isPublic,
				reportFilterFields: formattedFilterValues,
				isActive: true,
				isDeleted: false
			};

			if (!hasItem) return dispatch(addReportConfiguration(bodyFormatted));
			else
				return dispatch(
					editReportConfiguration({ ...bodyFormatted, id: item.id })
				);
		},
		[dispatch, hasItem, item.id, reportComponent]
	);

	const onSaveConfigurationModal = useCallback((values: any, { setSubmitting, resetForm }: FormikHelpers<any>, customFields: TReportFilterField[]) => {
		if (values.devolution?.length !== 0) values.rejectionAndReturnReasons = [...values.rejectionAndReturnReasons, ...values.devolution];
		if (values.disapproval?.length !== 0) values.rejectionAndReturnReasons = [...values.rejectionAndReturnReasons, ...values.disapproval];
		if (values.folderNumber !== "")
			values.folderNumber = values.folderNumber.split(";");
		showModal({
			onSubmitModal: (filterName: string, isPublic: boolean) => onSaveConfiguration(values, customFields, filterName, isPublic),
			onCloseAction: () => setSubmitting(false)
		})
	}, [showModal, onSaveConfiguration]);

	return { onSaveConfiguration, onSaveConfigurationModal }
}

