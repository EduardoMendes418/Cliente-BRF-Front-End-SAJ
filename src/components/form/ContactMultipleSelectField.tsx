import { useDispatch, useSelector } from "react-redux";
import MultipleSelectField, {
	TExtraData,
	TMultipleOptionsSelect,
} from "./MultipleSelectField";
import { getContactsWithoutIncludes } from "src/core/store/modules/contacts/selectors";
import { useEffect, useMemo, useState } from "react";
import { fetchLikeAndCpfWithoutIncludes } from "src/core/store/modules/contacts/thunks";
import { actions } from "src/core/store";
import { usePagination } from "src/hooks/pagination";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";

type ContactMultipleSelectFieldProps = {
	name: string;
	label: string;
	disabled?: boolean;
	typeOfLinkWithTheProcess?: TYPE_LINK_WITH_PROCESS;
	contactType?: CONTACT_TYPE;
};

const ContactMultipleSelectField = (props: ContactMultipleSelectFieldProps) => {
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const [text, setText] = useState("");

	const contacts = useSelector(getContactsWithoutIncludes);

	const contactsOptions = useMemo<TMultipleOptionsSelect[]>(
		() =>
			contacts.slice().map((x) => ({
				label: x.name,
				value: x.id.toString(),
				extraData: [
					{
						text:
							!x.identificationNumber || x.identificationNumber === ""
								? "-"
								: cpf.isValid(x.identificationNumber)
								? cpf.format(x.identificationNumber)
								: cnpj.format(x.identificationNumber),
						width: "9rem",
					},
					{
						text: x.sapCodeCliFor,
						width: "9rem"
					}
					
				],
			})),
		[contacts]
	);

	const extraDataHeader = useMemo<TExtraData[]>(
		() => [
			{
				text: "CPF / CNPJ",
				width: "9rem",
			},
			{
				text: "Código Fornecedor",
				width: "9rem"
			}
		],
		[]
	);

	useEffect(() => {
		if(text && props.contactType){
			dispatch(fetchLikeAndCpfWithoutIncludes({
				fragment: text,
				contactType: props.contactType,
				typeOfLinkWithTheProcess: props.typeOfLinkWithTheProcess}))
		}
		else if (text) {
			dispatch(
				fetchLikeAndCpfWithoutIncludes({
					pageSize: pageSize,
					page: page,
					fragment: text,
					typeOfLinkWithTheProcess: props.typeOfLinkWithTheProcess
				})
			);
		} else {
			dispatch(actions.contacts.clear());
		}
	}, [dispatch, page, pageSize, props.typeOfLinkWithTheProcess, text]);

	const onSearch = (newText: string) => {
		if (newText !== text) {
			dispatch(actions.pagination.clear());
		}
		setText(newText);
	};

	return (
		<MultipleSelectField
			disabled={props.disabled}
			name={props.name}
			label={props.label}
			options={contactsOptions}
			onSearch={onSearch}
			extraDataHeader={extraDataHeader}
		/>
	);
};

export default ContactMultipleSelectField;
