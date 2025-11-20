import { useDispatch, useSelector } from "react-redux";
import MultipleSelectField, {
	TExtraData,
	TMultipleOptionsSelect,
} from "./ComplexSelectField";
import { getContactsWithoutIncludes } from "src/core/store/modules/contacts/selectors";
import { useEffect, useMemo, useState } from "react";
import { fetchLikeAndCpfWithoutIncludes } from "src/core/store/modules/contacts/thunks";
import { actions } from "src/core/store";
import { usePagination } from "src/hooks/pagination";
import { cnpj, cpf } from "cpf-cnpj-validator";

type ContactSelectFieldProps = {
	name: string;
	label: string;
};

const ContactSelectField = (props: ContactSelectFieldProps) => {
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
		],
		[]
	);

	useEffect(() => {
		if (text) {
			dispatch(
				fetchLikeAndCpfWithoutIncludes({
					pageSize: pageSize,
					page: page,
					fragment: text,
				})
			);
		} else {
			dispatch(actions.contacts.clear());
		}
	}, [dispatch, page, pageSize, text]);

	const onSearch = (newText: string) => {
		if (newText !== text) {
			dispatch(actions.pagination.clear());
		}
		setText(newText);
	};

	return (
		<MultipleSelectField
			name={props.name}
			label={props.label}
			options={contactsOptions}
			onSearch={onSearch}
			extraDataHeader={extraDataHeader}
		/>
	);
};

export default ContactSelectField;
