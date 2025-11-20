import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getListReportDictionary } from 'src/core/store/modules/report-dictionary/selectors'
import {
	getItemReportConfiguration,
	getHasItemReportConfiguration,
	getStatusReportConfiguration,
} from 'src/core/store/modules/report-configuration/selectors';
import { fetchReportDictionary, fetchReportDictionaryConfiguration } from 'src/core/store/modules/report-dictionary/thunks';
import { TReportFilterField } from 'src/core/models/report-configuration';
import { TReportComponent } from 'src/core/models/reports';
import { fillIfValue } from 'src/core/utils/func';

import { getResultFilterFieldsAsArray, getSearchFilterFieldsAsObject } from '../Form/utils';

type TProps = {
	initialValues: object,
	reportComponent: TReportComponent
	getReportConfiguration?: boolean
}

export const useReport = ({ initialValues, reportComponent, getReportConfiguration }: TProps) => {
	const dispatch = useDispatch();
	const [customFields, setCustomFields] = useState<TReportFilterField[]>([]);

	
	const customFieldsDictionary = useSelector(getListReportDictionary);
	const item = useSelector(getItemReportConfiguration);
	const hasItem = useSelector(getHasItemReportConfiguration);

	const status = useSelector(getStatusReportConfiguration);
	const isSaving = status === 'saving';


	useEffect(() => {
		if(getReportConfiguration === true){
			dispatch(fetchReportDictionaryConfiguration({reportComponent}));
		}else{
		dispatch(fetchReportDictionary({ reportComponent }));
		}
	}, [dispatch, getReportConfiguration, reportComponent]);

	useEffect(() => {
		if (!hasItem) return;

		const initialCustomFilterFields = getResultFilterFieldsAsArray(item.reportFilterFields)
		setCustomFields(initialCustomFilterFields)
	}, [hasItem, item.reportFilterFields])
	
	const initialFormValues = useMemo(() => {
		if (!hasItem) return initialValues;
		const initialReportFilterFields =  getSearchFilterFieldsAsObject(item.reportFilterFields);
		const tempInitialValues = { ...fillIfValue<any>(initialReportFilterFields, initialValues) }
		return tempInitialValues
	}, [hasItem, item.reportFilterFields, initialValues])

	return {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary
	}
}