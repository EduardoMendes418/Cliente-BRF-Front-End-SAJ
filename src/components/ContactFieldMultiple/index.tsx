import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from 'lodash/debounce';

import { FormikContext } from "src/components/form";
import { actions } from "src/core/store";

import {
	getIsFetchingContacts,
	getFilterContacts,
	getMultipleListContacts,
	getContactsWithoutIncludes
} from "src/core/store/modules/contacts/selectors";
import { fetchContactsWithLikeWithoutIncludes, fetchLikeAndCpfWithoutIncludes } from "src/core/store/modules/contacts/thunks";
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";

import { useFormikContext } from "formik";
import { TOptions } from "../form/AutocompleteField";
import AutocompleteMultipleField from "../form/AutocompleteMultipleField";

type TContactField = {
	name: string;
	label: string;
	contactType?: CONTACT_TYPE;
	setInvalidValueWhenTyping?: boolean;
	required?: boolean;
	labelValueTarget?: boolean;
	initialValue?: TOptions;
	disabled?: boolean;
	contactSearch?: CONTACT_SEARCH;
	getOptionsTypeLinkWithTheProcess?: boolean;
	typeOfLinkWithTheProcess?: TYPE_LINK_WITH_PROCESS;
}

const ContactFieldMultiple = ({ 
	contactType, 
	disabled, 
	setInvalidValueWhenTyping, 
	labelValueTarget, 
	initialValue, 
	contactSearch, 
	getOptionsTypeLinkWithTheProcess, 
	typeOfLinkWithTheProcess, 
	...props 
}: TContactField) => {
	const dispatch = useDispatch();
	const { initialValues, setFieldValue, values } = useFormikContext<FormikContext>();

	const contacts = useSelector(getMultipleListContacts);
	const contactsTypeOfLinkWithTheProcess = useSelector(getContactsWithoutIncludes);
	const loading = useSelector(getIsFetchingContacts);
	const currentSearchFilter = useSelector(getFilterContacts);

	const options = useMemo(() => (contacts[props.name] ?? []).map(({ id, name }) => ({ label: name, value: id })),
		[contacts, props.name])

	const optionsTypeOfLinkWithTheProcess = useMemo(() => contactsTypeOfLinkWithTheProcess.map(({ id, name }) => ({ label: name, value: id })),
		[contactsTypeOfLinkWithTheProcess, props.name])	 

	const delayedFetch = debounce((value: string, responsibleAreaIds: number[]) => {
		dispatch(actions.contacts.changeFilter(props.name));
		if(getOptionsTypeLinkWithTheProcess === true){
			dispatch(fetchLikeAndCpfWithoutIncludes({
				fragment: value,
				typeOfLinkWithTheProcess: typeOfLinkWithTheProcess}));
			return;
		}
		dispatch(fetchContactsWithLikeWithoutIncludes({ 
			partName: value, contactType, 
			field: props.name, 
			type: contactSearch, 
			responsibleAreaIds: responsibleAreaIds 
		}))
	}, 500);

	const search = useCallback((value: string, reason: AutocompleteInputChangeReason, fieldsValues: FormikContext) => {
		if (reason === 'clear')
			dispatch(actions.contacts.clearList(props.name));
		else if (reason === "input" && value) {
			if (setInvalidValueWhenTyping) setFieldValue(props.name, -1)
			
			if (value?.length >= 3) {
				const AreaIds = fieldsValues?.responsibleAreaIds ||
												fieldsValues?.responsibleAreaId ||
												fieldsValues?.ResponsibleAreaIds ||
												fieldsValues?.ResponsibleAreaId;

				delayedFetch(value, AreaIds);		
			}
		}
	}, []);

	useEffect(() => {
		if (initialValues[props.name] && Number(initialValues[props.name])){
			if(getOptionsTypeLinkWithTheProcess === true){
				dispatch(fetchLikeAndCpfWithoutIncludes({
					fragment: props.name,
					typeOfLinkWithTheProcess: typeOfLinkWithTheProcess}));
				return;
			}
			dispatch(fetchContactsWithLikeWithoutIncludes({ id: Number(initialValues[props.name]), field: props.name }))
		}
		else
			dispatch(actions.contacts.clearList(props.name))
	}, [initialValues, props.name, dispatch])

	return (
		<AutocompleteMultipleField
			{...props}
			options={getOptionsTypeLinkWithTheProcess === true ? optionsTypeOfLinkWithTheProcess : options}
			disableField={disabled}
			loading={loading && currentSearchFilter === props.name}
			onValueChange={(value, reason) => search(value, reason, values)}
			valuePropName={labelValueTarget ? 'label' : 'value'}
			initialValue={initialValue}
			onDemand
			limitTags={1}
		/>
	);
}

export default ContactFieldMultiple;