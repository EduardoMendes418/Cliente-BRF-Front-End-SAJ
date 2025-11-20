import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";

import { ContactsAutocompleteField } from "src/components/form";
import { t } from "src/locale/i18n";

import { TContact } from "src/core/models/contacts";
import { TPensionPayeeData } from "src/core/models/pensions";

const CPFField = () => {
    const { values, setValues, setFieldValue, submitCount } =
        useFormikContext<TPensionPayeeData>();
    const [customCpfError, setCustomCpfError] = useState("");

    const onSelectContact = (contact: TContact) => {
        setValues({
            ...values,
            favoredId: contact.id,
            fullName: contact.name,
            cpf: contact.cpfCnpj ?? "",
            bornDate: contact.birthDate,
        });
        setCustomCpfError("");
    };

    const onChangeCpf = useCallback(
        (value: string) => {
            setFieldValue("favoredId", "");
            setCustomCpfError(
                !!value ? t("validations.invalidField") : t("required")
            );
        },
        [setFieldValue, setCustomCpfError]
    );

    useEffect(() => {
        if (submitCount === 1 && !values.favoredId && !customCpfError)
            setCustomCpfError(t("required"));
    }, [submitCount, customCpfError, values.favoredId]);

    return (
        <Grid item xs={12} md={3}>
            <ContactsAutocompleteField
                filter="cpfCnpj"
                name="cpf"
                maskType="cpf"
                label={t("personInformation.cpf")}
                onSelectContact={onSelectContact}
                customError={customCpfError}
                onChange={onChangeCpf}
                readOnly
            />
        </Grid>
    );
};

export default CPFField;
