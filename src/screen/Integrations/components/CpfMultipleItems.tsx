import { Grid } from "@material-ui/core";
import { useCallback, useState } from "react";
import CheckboxesAutocompleteMaskedField from "./CheckboxesAutocompleteMaskedField";
import { useContact } from "src/hooks/contacts";
import { t } from "src/locale/i18n";

const CPF_LENGTH = 14;

const CpfMultipleItems: React.FC = () => {
	const [cpf, setCpf] = useState("");
	const { cpfOptions } = useContact(cpf);
	const handleInputChange = useCallback((value: string) => {
		if (value.length === CPF_LENGTH) {
			setCpf(value)
		}
	}, []);

	const cpfFormat = (cpf: string) =>
		cpf
			.replace(/\D/g,"")
			.replace(/(\d{3})(\d)/,"$1.$2")
			.replace(/(\d{3})(\d)/,"$1.$2")
			.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

	return (
		<Grid item xs={12} md={3}>
			<CheckboxesAutocompleteMaskedField
				onChange={handleInputChange}
				name="cpf"
				options={cpfOptions}
				label={t("integrations:request.form.cpf")}
				maxlength={CPF_LENGTH}
				maskFunction={cpfFormat}
			/>
		</Grid>
	);
};

export default CpfMultipleItems;
