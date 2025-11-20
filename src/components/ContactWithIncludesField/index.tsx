import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from 'lodash/debounce';

import { AutocompleteField, FormikContext } from "src/components/form";
import { actions } from "src/core/store";

import {
	getIsFetchingContacts,
	getFilterContacts,
	getListContacts
} from "src/core/store/modules/contacts/selectors";
import { fetchContactsWithLike } from "src/core/store/modules/contacts/thunks";
import { CONTACT_TYPE } from "src/core/utils/constants";

import { useFormikContext } from "formik";
import { TOptions } from "../form/AutocompleteField";
import { TContact } from "src/core/models/contacts";

type TContactWithIncludesField = {
	name: string;
	label: string;
	contactType?: CONTACT_TYPE;
	setInvalidValueWhenTyping?: boolean;
	required?: boolean
	labelValueTarget?: boolean
	initialValue?: TOptions
  onSelectContact?: (value: TContact) => void;
}

const ContactWithIncludesField = ({ 
	contactType, 
	setInvalidValueWhenTyping, 
	labelValueTarget, 
	initialValue, 
	onSelectContact, 
	...props 
}: TContactWithIncludesField) => {
	const dispatch = useDispatch();
	const { initialValues, setFieldValue } = useFormikContext<FormikContext>();

	const contacts = useSelector(getListContacts);
	const loading = useSelector(getIsFetchingContacts);
	const currentSearchFilter = useSelector(getFilterContacts);

	const options = useMemo(() => contacts.map(({ id, name }) => ({ label: name, value: id })),
		[contacts])

	const delayedFetch = debounce((value: string) => {
		dispatch(actions.contacts.changeFilter(props.name));
		dispatch(fetchContactsWithLike({ partName: value }))
	}, 500);

	const search = useCallback((value: string, reason: AutocompleteInputChangeReason) => {
		if (reason === 'clear')
			dispatch(actions.contacts.clearList(props.name));
		else if (reason === "input" && value) {
			if (setInvalidValueWhenTyping) setFieldValue(props.name, -1)
			if (value.length >= 3) delayedFetch(value);
		}
	}, [delayedFetch, dispatch, props.name, setFieldValue, setInvalidValueWhenTyping]);

	useEffect(() => {
		if (initialValues[props.name] && Number(initialValues[props.name]))
		dispatch(fetchContactsWithLike({ partName: initialValues[props.name] }))
		else
			dispatch(actions.contacts.clearList(props.name))
	}, [initialValues, props.name, dispatch])

	const onSelect = useCallback((item: TOptions | null) => {
		if (!item) {
			return
		}

		const contact = contacts.filter(x => x.name === item.label)[0]

		if (!contact) {
			return
		}

		onSelectContact?.(contact)
	}, [contacts, onSelectContact])

	return (
		<AutocompleteField
			{...props}
			options={options}
			loading={loading && currentSearchFilter === props.name}
			onValueChange={search}
			onSelectValue={onSelect}
			valuePropName={labelValueTarget ? 'label' : 'value'}
			initialValue={initialValue}
			onDemand
		/>
	);
}

export default ContactWithIncludesField;