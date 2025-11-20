import { Dispatch, SetStateAction, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { Clean, Submit } from "src/components/button";
import { Formik, FormikHelpers } from "formik";

import { TextField, TOptionsSelect} from "src/components/form";
import Panel from "src/components/Panel";
import SearchInfo from "src/components/SearchInfo";
import FieldColumn from "src/components/FieldColumn";

import { useDispatch, useSelector } from "react-redux";
import { actions } from "src/core/store";
import { useTranslation } from "src/locale/i18n";
import {
    getProcessStatus,
    getProcessError,
} from "src/core/store/modules/process/selectors";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import { TPayment } from "src/core/models/inspection";
import { statusTextApprovalsFlow } from "src/core/utils/constants";

type TSearchForm = {
    folderNumber: string;
    valorTotalGuia: any; 
};

type Props = {
    item?: TPayment;
    loading: boolean;
    hasItem: boolean;
    paymentMethodSelectedOptions: TOptionsSelect[];
    setSubmitWithoutFolder: Dispatch<SetStateAction<boolean>>
};

const Search = ({
    item,
    loading,
    hasItem,
    setSubmitWithoutFolder,
}: Props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const closed = useSelector(getProcessStatus);
    const error = useSelector(getProcessError);
 
    const initialValues: TSearchForm = {
        folderNumber: "",
        valorTotalGuia: '',
        ...item,
    };

    useEffect(() => {
        item?.tipoPagamentoId &&
            dispatch(actions.inspection.setPaymentTypeId(item.tipoPagamentoId));
        item?.formaPagamentoId &&
            dispatch(
                actions.inspection.setPaymentMethodId(item.formaPagamentoId)
            );
    }, [dispatch, item]);

    const onSubmit = (
        { folderNumber }: TSearchForm,
        { setSubmitting }: FormikHelpers<TSearchForm>
    ) => {
        if(folderNumber.length === 0){
            setSubmitWithoutFolder(true)
            setSubmitting(false);
        }
        dispatch(fetchProcessFolder({ folderNumber }));
        setSubmitting(false);
    };

    return (
        <Panel title={t("solicitacaoPagamento:title")} withPadding>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item md={3} xs={12}>
                                <TextField
                                    name="folderNumber"
                                    label={t("form.CTG")}
                                    readOnly={hasItem}
                                />
                            </Grid> 
                            {hasItem && (
                                <Grid item md={3} xs={12} sm={6}>
                                    <FieldColumn
                                        label={t("inspection:resquest.requestStatus")}
                                        value={
                                            item?.statusApprovalId === 8 ||
                                            item?.statusApprovalId === 0 ? statusTextApprovalsFlow[item?.statusApprovalId ?? 0]
                                                : (item?.statusFlowId === 1 && item?.statusApprovalId === -1 ? "Aprovado internamente" : (statusTextApprovalsFlow as any)[item?.statusFlowId ?? 0])
                                        }
                                    />
                                </Grid>
                            )}
                            {!hasItem && (
                                <Grid item md={1} xs={2}>
                                    <Submit
                                        type="search"
                                        submitting={loading}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        {!hasItem && (
                            <Clean
                                action="inspection"
                                disabled={false}
                            />
                        )}
                    </form>
                )}
            </Formik>
            {!loading && <SearchInfo error={error} closed={closed} />}
        </Panel>
    );
};

export default Search;
