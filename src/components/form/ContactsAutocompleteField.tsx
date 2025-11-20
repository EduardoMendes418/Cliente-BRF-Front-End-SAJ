import { useCallback, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { cnpj, cpf } from "cpf-cnpj-validator";
import debounce from "lodash/debounce";

import { AutocompleteField, FormikContext } from "src/components/form";
import { TOptions } from "src/components/form/AutocompleteField";

import {
	fetchContacts,
	fetchContactsWithLike,
	fetchLikeAndCpfWithoutIncludes,
} from "src/core/store/modules/contacts/thunks";
import {
	getIsFetchingContacts,
	getListContacts,
	getFilterContacts,
	getContactsWithoutIncludes,
} from "src/core/store/modules/contacts/selectors";
import { TContact } from "src/core/models/contacts";
import { actions } from "src/core/store";

export type TContactsAutocompleteField = {
	name: string;
	label: string;
	readOnly?: boolean;
	customError?: string;
	onSelectContact: (value: TContact) => void;
	onChange?: (value: string) => void;
	onBlur?: () => void;
	filter:
		| "cpfCnpj"
		| "supplierCode"
		| "internalLawyer"
		| "likeName"
		| "fragment";
	required?: boolean;
	minLength?: number;
	maskType?: "cpf";
	onNotFound?: () => void;
	sendType?: number;
	optionWithSupplierCode?: boolean;
	showSelectedName?: boolean;
	showSapCode?: boolean;
};

const isCpfCnpjValid = (cpfCnpj: string) =>
	cpf.isValid(cpfCnpj) || cnpj.isValid(cpfCnpj);

const ContactsAutocompleteField = ({
	filter,
	onSelectContact,
	onChange,
	minLength,
	maskType,
	onNotFound,
	onBlur,
	sendType,
	optionWithSupplierCode,
	showSelectedName,
	showSapCode,
	...props
}: TContactsAutocompleteField) => {
	const dispatch = useDispatch();
	const { values, initialValues } = useFormikContext<FormikContext>();

	const currentValue = values[props.name];

	const loading = useSelector(getIsFetchingContacts);
	const currentSearchFilter = useSelector(getFilterContacts);
	const contactsList = useSelector(getListContacts);
	const contactsFragment = useSelector(getContactsWithoutIncludes);
	const contacts = filter === "fragment" ? contactsFragment : contactsList;
	
	const optionsWithSupplierCode = useMemo(
		() =>
			contacts.map(({ name, sapCodeCliFor, identificationNumber } : any, index) => ({
				label: showSapCode === true ? sapCodeCliFor : ` ${
				cpf.isValid(identificationNumber)
				? cpf.format(identificationNumber)
				: cnpj.format(identificationNumber)}`,
				value: index,
				description: `Nome: ${name}; Código fornecedor: ${sapCodeCliFor === null ? "-" : sapCodeCliFor}; CPF/CNPJ: ${identificationNumber === ""
				? "-"
				: cpf.isValid(identificationNumber)
				? cpf.format(identificationNumber)
				: cnpj.format(identificationNumber)}`,
			})),
		[currentValue, contacts]
	);



	const options = useMemo(
		() =>
			contacts.map(({ name }, index) => ({
				label: showSelectedName === true ? name : String(currentValue),
				value: index,
				description: name,
			})),
		[currentValue, contacts]
	);


	const clearList = useCallback(
		() => dispatch(actions.contacts.clearList()),
		[dispatch]
	);

	const delayedFetch = useMemo(
		() =>
			debounce((value: string, filter: string) => {
				clearList();
				dispatch(actions.contacts.changeFilter(filter));
				if(filter === "likeName" && sendType){
					dispatch(fetchContactsWithLike({ partName: value, type: sendType }));

				}
				else if (filter === "likeName") {
					dispatch(fetchContactsWithLike({ partName: value }));
				} else if (filter === "fragment") {
					dispatch(
						fetchLikeAndCpfWithoutIncludes({
							fragment: value,
						})
					);
				} else dispatch(fetchContacts({ [filter]: value }));
			}, 500),
		[clearList, dispatch]
	);

	const search = useCallback(
		(value: string) => {

			onChange && onChange(value);

			if (
				!value || value === "" || value === " " ||
				(filter === "cpfCnpj" && !isCpfCnpjValid(value)) ||
				(minLength && value.length < minLength)
			)
				return;

			delayedFetch(value, filter);
		},
		[onChange, filter, minLength, delayedFetch]
	);

	const onSelect = (selectedItem: TOptions | null) => {
		if (!selectedItem) return;
		const selectedContact = (contacts as any)[selectedItem.value];
		onSelectContact(selectedContact);
	};

	useEffect(() => {
		if (initialValues[props.name])
			delayedFetch(initialValues[props.name], filter);
		
	}, []);

	useEffect(() => {
		if (contacts && contacts.length === 0) {
			onNotFound?.();
		}
	}, [contacts, onNotFound]);

	useEffect(() => () => clearList(), [clearList]);
	return (
		<AutocompleteField
			{...props}
			options={optionWithSupplierCode === true ? optionsWithSupplierCode : options}
			loading={loading && currentSearchFilter === filter}
			maskType={ maskType ? maskType : filter === "cpfCnpj" ? "cpfCnpj" : undefined}
			onValueChange={search}
			onSelectValue={onSelect}
			onlyNumbers={filter !== "likeName" && filter !== "fragment"}
			minLength={minLength}
			valuePropName="label"
			onDemand
			onBlur={onBlur}
		/>
	);
};

export default ContactsAutocompleteField;