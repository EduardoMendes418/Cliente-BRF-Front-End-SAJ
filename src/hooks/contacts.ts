import { debounce } from "@material-ui/core";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOptionsSelect } from "src/components/form";
import {
	getListContacts, getMultipleListContacts,
} from "src/core/store/modules/contacts/selectors";
import {
	fetchContacts,
	fetchContactsWithLikeWithoutIncludes,
} from "src/core/store/modules/contacts/thunks";

export const useContact = (cpf: string) => {
	const dispatch = useDispatch();
	const contacts = useSelector(getListContacts);

	useEffect(() => {
		dispatch(
			fetchContacts({
				cpfCnpj: cpf,
			})
		);
	}, [cpf, dispatch]);

	const options: TOptionsSelect[] = useMemo(
		() => contacts.map((x) => ({ label: x.cpfCnpj, value: x.cpfCnpj })),
		[contacts]
	);

	return {
		contacts,
		cpfOptions: options,
	};
};

export const useContactByName = (name: string) => {
	const dispatch = useDispatch();
	const contacts = useSelector(getMultipleListContacts);

	const contactFetch = useRef(
		debounce(
			(contactName: string) =>
				dispatch(
					fetchContactsWithLikeWithoutIncludes({
						partName: contactName,
						field: "name"
					})
				),
			1500
		)
	);

	useEffect(() => {
		contactFetch.current?.(name);
	}, [dispatch, name]);

	const options: TOptionsSelect[] = useMemo(
		() => (contacts["name"] ?? []).map((x) => ({ label: x.name, value: x.id })),
		[contacts]
	);

	return {
		contacts,
		conatctOptions: options,
	};
};
