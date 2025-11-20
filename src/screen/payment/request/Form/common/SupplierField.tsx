import { useCallback, useEffect } from "react";
import { useFormikContext } from "formik";
import { Grid } from "@material-ui/core";

import FieldColumn from "src/components/FieldColumn";
import { ContactsAutocompleteField, FormikContext } from "src/components/form";
import { TContact } from "src/core/models/contacts";

type SupplierFieldProp = {
	readonly?: boolean
}

const SupplierField = (props: SupplierFieldProp) => {
	
	const { values, setFieldValue } = useFormikContext<FormikContext>();

	const onSelectContact = useCallback(
		(contact: TContact) => {
			setFieldValue("fornecedor", contact?.name);
			setFieldValue("fornecedorId", contact?.sapCodeCliFor);
			setFieldValue("cpf", contact?.identificationNumber)
		},
		[setFieldValue]
	);

	return (
		<>
			<Grid item md={3} xs={12}>
				<ContactsAutocompleteField
					name={"fornecedorId"}
					filter="fragment"
					label={"Fornecedor"}
					onSelectContact={onSelectContact}
					readOnly={props.readonly === true}
					optionWithSupplierCode
					showSapCode={true}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<FieldColumn
					label={"Nome do fornecedor"}
					value={values.fornecedor}
				/>
			</Grid>
		</>
	);

}

export default SupplierField;