import { Grid } from "@material-ui/core";
import { FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Submit } from "src/components/button";
import Form, { TextField } from "src/components/form";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { TPaymentMethod } from "src/core/models/payment-method";
import {
    addPaymentMethod,
    editPaymentMethod,
} from "src/core/store/modules/payment-method/thunks";
import { Modulos } from "src/core/models/modules";
import {
    useActionFormaPagamento,
    useFormaPagamentoInitialValues,
} from "src/hooks/paymentMethod";
import { getLoadingPaymentMethod } from "src/core/store/modules/payment-method/selectors";
import { AppDispatch } from "src/core/store";
import { useTranslation } from "src/locale/i18n";

const FormaDePagamentoForm = () => {
    const { t } = useTranslation();
    useActionFormaPagamento(
        Modulos.Inspection,
        "/configuracoes/fiscalizacao/forma-pagamento"
    );
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const isFetching = useSelector(getLoadingPaymentMethod);
    const initialValues = useFormaPagamentoInitialValues(Modulos.Inspection);

    const isNew = id === "novo";

    const handleSubmit = (
        form: TPaymentMethod,
        { setSubmitting }: FormikHelpers<TPaymentMethod>
    ) => {
        if (isNew) {
            dispatch(
                addPaymentMethod({ ...form, moduloId: Modulos.Inspection })
            );
        } else {
            const values = {
                ...form,
                id: Number(id),
                moduloId: Modulos.Inspection,
            };
            dispatch(editPaymentMethod({ id, values }));
        }
        setSubmitting(false);
    };

    return (
        <ScreenTemplate>
            <Form
                enableReinitialize
                onSubmit={handleSubmit}
                initialValues={initialValues}
            >
                {({ handleSubmit, dirty }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Panel
                            title={
                                isNew
                                    ? t(
                                          "inspection:formaPagamento_registration"
                                      )
                                    : t("inspection:formaPagamento_edit")
                            }
                            slotBottomRight={
                                <Submit isNew={isNew} disabled={!dirty} />
                            }
                            slotBottonRightPermission={isNew ? "add" : "edit"}
                            withPadding
                        >
                            {!isFetching && (
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label={t("inspection:form.method")}
                                            name="descricao"
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </Panel>
                    </form>
                )}
            </Form>
        </ScreenTemplate>
    );
};

export default FormaDePagamentoForm;
