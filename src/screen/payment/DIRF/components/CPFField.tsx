import { Grid } from "@material-ui/core";
import { useCallback, useState } from "react";

import { ContactsAutocompleteField } from "src/components/form";
import { t } from "src/locale/i18n";

import { TContact } from "src/core/models/contacts";

const CPFField = ({ name = "cpf", label = "CPF", verifyContacts = true }: { name?: string, label?: string, verifyContacts?: boolean }) => {
	const [customCpfError, setCustomCpfError] = useState('');

	const onSelectContact = (contact: TContact) => {
		setCustomCpfError('')
	}

	const onChangeCpf = useCallback((value: string) => {
		if (verifyContacts)
			setCustomCpfError(!!value ? t('validations.invalidField') : t('required'));
	}, [setCustomCpfError, verifyContacts]);



	return (
		<Grid item xs={12} md={3}>
			<ContactsAutocompleteField
				filter='cpfCnpj'
				name={name}
				maskType='cpf'
				label={label}
				required
				onSelectContact={onSelectContact}
				customError={customCpfError}
				onChange={onChangeCpf}
			/>
		</Grid>
	)
}

export default CPFField;