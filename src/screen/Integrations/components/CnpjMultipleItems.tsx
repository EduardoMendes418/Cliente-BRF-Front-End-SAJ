import { Grid } from "@material-ui/core";
import { useCallback, useState } from "react";
import CheckboxesAutocompleteMaskedField from "./CheckboxesAutocompleteMaskedField";
import { useContact } from "src/hooks/contacts";
import { t } from "src/locale/i18n";

const CNPJ_LENGTH = 18;

const CnpjMultipleItems: React.FC = () => {
	const [cnpj, setCnpj] = useState("");
	const { cpfOptions } = useContact(cnpj);
	const handleInputChange = useCallback((value: string) => {
		if (value.length === CNPJ_LENGTH) {
			setCnpj(value)
		}
	}, []);

	const cnpjFormat = (cnpj: string) =>
		cnpj
			.replace(/\D/g,"")
			.replace(/(\d{2})(\d)/,"$1.$2")
			.replace(/(\d{3})(\d)/,"$1.$2")
			.replace(/(\d{3})(\d)/,"$1/$2")
			.replace(/(\d{4})(\d{1,2})$/,"$1-$2")


	return (
		<Grid item xs={12} md={3}>
			<CheckboxesAutocompleteMaskedField
				onChange={handleInputChange}
				name="cnpjs"
				options={cpfOptions}
				label={t("integrations:request.form.cnpj")}
				maxlength={CNPJ_LENGTH}
				maskFunction={cnpjFormat}
			/>
		</Grid>
	);
};

export default CnpjMultipleItems;
