import { useCallback, useState } from "react";
import { useFormikContext } from "formik";
import { Grid } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";

import FieldColumn from "src/components/FieldColumn";
import {
	FormikContext,
	ContactsAutocompleteField,
	SelectField,
} from "src/components/form";

import { t } from "src/locale/i18n";
import { TContact } from "src/core/models/contacts";

type InternalLawyerFieldProp = {
	readonly?: boolean;
};

const InternalLawyerField = (props: InternalLawyerFieldProp) => {
	const { values, setFieldValue } = useFormikContext<FormikContext>();
	const [customError, setCustomError] = useState("");
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const {
		location: { pathname },
	} = useHistory();

	const renderApprovalFlow = pathname.includes("fiscalizacao");

	const approvalFlowOptions = [
		{
			value: 1,
			label: "Barreiras Fiscais",
		},
		{
			value: 2,
			label: "Fiscalização e Suporte",
		},
	];

	const onSelectContact = useCallback(
		(contact: TContact) => {
			setFieldValue("advogadoInternoSearch", "");
			setFieldValue("advogadoInterno", contact.name);
			setFieldValue("advogadoInternoId", contact.id);
			setCustomError("");
		},
		[setFieldValue, setCustomError]
	);

	const onChange = useCallback(
		(value: string) => {
			setFieldValue("advogadoInternoSearch", " ");
			setCustomError(!!value ? t("validations.invalidField") : t("required"));
		},
		[setFieldValue, setCustomError]
	);

	return (
		<>
			<Grid item md={3} xs={12}>
				<ContactsAutocompleteField
					name={isNew ? "advogadoInternoSearch" : "advogadoInternoId"}
					filter="likeName"
					label={
						isNew
							? t("solicitacaoPagamento:dadosPagamento.internalLawyerSearch")
							: t("solicitacaoPagamento:dadosPagamento.internalLawyerCode")
					}
					onSelectContact={onSelectContact}
					customError={customError}
					onChange={onChange}
					readOnly={props.readonly === true}
					sendType={1}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<FieldColumn
					label={t("solicitacaoPagamento:dadosPagamento.advogadoInterno")}
					value={values.advogadoInterno}
				/>
			</Grid>
			{renderApprovalFlow ? (
				<Grid item md={3} xs={12}>
					<SelectField
						required
						name="fluxoAprovacao"
						label={t("solicitacaoPagamento:dadosPagamento.fluxoAprovacao")}
						options={approvalFlowOptions}
						readOnly={props.readonly === true}
					/>
				</Grid>
			) : null}
		</>
	);
};

export default InternalLawyerField;
