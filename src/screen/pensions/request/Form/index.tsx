import { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { CircularProgress, Grid } from "@material-ui/core";
import moment from "moment";

import Form from "src/components/form";
import Logs from "src/components/Logs";
import { Submit } from "src/components/button";
import Attachments from "src/components/Attachments";
import { t } from "src/locale/i18n";

import {
    getPaymentSearch,
    getFolderInfoPayment,
    getStatusPayment,
    getItemPayment,
    getPaymentAccounting,
} from "src/core/store/modules/inspection/selectors";
import {
    TPaymentDataGuides,
    TTypeForm,
    TComplementData,
} from "src/core/models/payment";
import {
    TPaymentDatasDefault,
    TPaymentFavoredData,
} from "src/core/models/inspection";
import { formatTo, getFullDate } from "src/core/utils/func";
import AccountingData from "src/components/AccountingData";
import CancelButton from "src/components/button/Cancel";
import {
    statusTextApprovalsFlow,
    STATUS_APPROVALS_FLOW,
} from "src/core/utils/constants";
import { getLoadingParameterization } from "src/core/store/modules/parameterization/selectors";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

type TItem = (TPaymentFavoredData | TPaymentDataGuides) & TComplementData;

type Props = {
    hasItem: boolean;
    showEmptyForm?: boolean;
    form: TTypeForm;
    onSubmit: any;
    validationSchema?: any;
    children: ReactNode;
    item?: TItem;
    customInitialValues: TPaymentDatasDefault;
    isApprovalLegalControl: boolean;
    isApprovalInternalLawyer: boolean;
};

const FormCore = ({
    hasItem,
    item,
    showEmptyForm,
    form,
    onSubmit,
    validationSchema,
    customInitialValues,
    isApprovalLegalControl,
    isApprovalInternalLawyer,
    children,
}: Props) => {
    const folder = useSelector(getFolderInfoPayment);
    const accounting = useSelector(getPaymentAccounting);
    const { folderNumber, formaPagamentoId, tipoPagamentoId } =  useSelector(getPaymentSearch);
    const status = useSelector(getStatusPayment);
    const itemPay = useSelector(getItemPayment);
    const isSaving = status === "saving";
    const { id: userId } = useSelector(getDataCurrentUser) as any;
    const requesterId = useMemo(() => itemPay?.requesterId, [itemPay]) as any;

    const isLoadingParametrization = useSelector(getLoadingParameterization);

    const editable =
        !isApprovalLegalControl &&
        !isApprovalInternalLawyer &&
        (userId === requesterId || requesterId === undefined) &&
        (!hasItem ||
            item?.statusFlowId === STATUS_APPROVALS_FLOW.RETURNED ||
            item?.statusApprovalId === STATUS_APPROVALS_FLOW.RETURNED);

    const initialValues = {
        form,
        folderNumber,
        formaPagamentoId,
        tipoPagamentoId,
        dataSolicitacao: showEmptyForm ? null : moment().format("YYYY-MM-DD"),
        dataPagamento: null,
        advogadoInterno: folder.internalLawyer,
        advogadoInternoId: folder.internalLawyerId,
        observacao: "",
        files: [] as any,
        filesIsGuide: [] as any,
        ...customInitialValues,
        ...item,
        cep: (item as TPaymentFavoredData)?.cep
            ? formatTo("cep", (item as TPaymentFavoredData).cep)
            : "",
        periodoApuracao: getFullDate((item as any)?.periodoApuracao),
    };

    if (isLoadingParametrization)
        return <CircularProgress className="margin-top-16 align-center" />;

    return (
        <Form
            enableReinitialize
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            permission={editable ? undefined : false}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit} noValidate>
                    {children}
                    <Attachments label={"Anexo guia"} name="filesIsGuide" id="filesIsGuide" accept=".pdf" disabled={!editable} multiple={false} />
                    <Attachments name="files" id="files" disabled={!editable} />
                    {hasItem && <AccountingData accountingData={accounting} title={t("accounting.title")} />}
                    <Logs
                        possibleApprovers={item?.possibleApprovers}
                        statuses={statusTextApprovalsFlow}
                        statusOrder={["flow", "approvalCenter"]}
                    />
                    {editable && (
                        <Grid
                            container
                            justifyContent="flex-end"
                            className="margin-top-16"
                            spacing={2}
                        >
                            <Grid item>{<CancelButton />}</Grid>
                            <Grid item>
                                <Submit submitting={isSaving} />
                            </Grid>
                        </Grid>
                    )}
                </form>
            )}
        </Form>
    );
};

export default FormCore;
