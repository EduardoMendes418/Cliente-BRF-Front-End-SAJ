import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import ScreenTemplate from "src/components/Screen";
import Search from "./common/Search";
import FormDefault from "./types/default/Form";
import {
    getProcessFolderData,
    getItemPayment,
    getStatusPayment,
    getHasItem,
    getErrorMessage,
    getPaymentSearch,
    getLoadingPayment,
} from "src/core/store/modules/inspection/selectors";
import {
    getProcessFormData,
    getProcessIsFetching,
} from "src/core/store/modules/process/selectors";
import { actions } from "src/core/store/";
import {
    getPaymentInspection,
    getPaymentInspectionAccounting,
    updateStatusPaymentInspectionRequest,
} from "src/core/store/modules/inspection/thunks";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { TTypeForm } from "src/core/models/payment";
import { TPayment } from "src/core/models/inspection";

import { fetchBanks } from "src/core/store/modules/banks/thunks";
import ProcessFormData from "src/components/ProcessFormData";
import { t, useTranslation } from "src/locale/i18n";
import { useRegisterDefault } from "src/hooks";
import { usePaymentTypeMethod } from "src/hooks/fetchLists";
import { getListPaymentType } from "src/core/store/modules/payment-type/selectors";
import { WRITE_OFF_PROVISION_BALANCE } from "src/screen/settings/constants";
import { Modulos } from "src/core/models/modules";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import ApprovalForm from "./components/ApprovalForm";

type TForm = {
    typeForm: TTypeForm;
    item: TPayment;
    hasItem: boolean;
    isApprovalLegalControl: boolean;
    isApprovalInternalLawyer: boolean;
    submitWithoutFolder?: boolean
};

const getForm = ({ item, typeForm, submitWithoutFolder, ...props }: TForm) => {
    switch (item?.form || typeForm) {
        case "default":
            return (
                <FormDefault item={item} {...props} submitWithoutFolder={submitWithoutFolder}/>
            );
        case "guia":
            return (
                <FormDefault item={item} {...props} submitWithoutFolder={submitWithoutFolder}/>
            );
        default:
            return <FormDefault item={item} {...props} submitWithoutFolder={submitWithoutFolder}/>;
    }
};

const writeOffProvisionBalanceMessage = {
    [WRITE_OFF_PROVISION_BALANCE.NONE]: "",
    [WRITE_OFF_PROVISION_BALANCE.PARTIAL]: t(
        "solicitacaoPagamento:approval.partialProvisionMessage"
    ),
    [WRITE_OFF_PROVISION_BALANCE.TOTAL]: t(
        "solicitacaoPagamento:approval.totalProvisionMessage"
    ),
};

const PaymentForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { id } = useParams<{ id: string }>();
    const isNew = id === "novo";

    const item = useSelector(getItemPayment);
    const hasItem = useSelector(getHasItem);
    const processFolderDataItem = useSelector(getProcessFolderData);
    const loadingItem = useSelector(getLoadingPayment);
    const { formaPagamentoId, tipoPagamentoId } = useSelector(getPaymentSearch);
    const paymentTypes = useSelector(getListPaymentType);
    const [submitWithoutFolder, setSubmitWithoutFolder] = useState<boolean>(false);
    const isPaymentRequest = pathname.includes('solicitacao')

    const loadingFolder = useSelector(getProcessIsFetching);
    const processFolderDataFolder = useSelector(getProcessFormData);

    const loading = loadingItem || (isNew && loadingFolder);
    const hasFolder =
        !!processFolderDataFolder.processKey && !processFolderDataFolder.closed;
    const processFolderData = isNew
        ? processFolderDataFolder
        : processFolderDataItem;

    const { typeForm, paymentMethodSelectedAsOptions } = usePaymentTypeMethod(
        tipoPagamentoId,
        formaPagamentoId
    );

    useEffect(() => {
        dispatch(
            fetchPaymentType({
                notPaginate: true,
                modulo: Modulos.Inspection,
                status: true,
            })
        );
        return () => {
            dispatch(actions.parameterization.clear());
            dispatch(actions.inspection.clear());
            dispatch(actions.process.clear());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isNew) dispatch(actions.process.clear());
        else if (id) {
            dispatch(fetchBanks());
            dispatch(getPaymentInspection(Number(id)));
            dispatch(getPaymentInspectionAccounting(Number(id)));
        }
    }, [dispatch, isNew, id]);

    useRegisterDefault({
        action: "inspection",
        getStatus: getStatusPayment,
        getErrorMessage,
    });

    const isApprovalLegalControl = pathname.startsWith(
        "/fiscalizacao/aprovacao-controle-juridico"
    );
    const isApprovalInternalLawyer = pathname.startsWith(
        "/fiscalizacao/aprovacao-advogado-interno"
    );

    const writeOffProvisionBalance =
        paymentTypes?.find(({ id }) => id === tipoPagamentoId)
            ?.abaterSaldoProvisao ?? 0;

    return (
        <ScreenTemplate>
            <Search
                item={item}
                loading={loading}
                hasItem={hasItem}
                paymentMethodSelectedOptions={paymentMethodSelectedAsOptions}
                setSubmitWithoutFolder={setSubmitWithoutFolder}
            />
            {((isNew && submitWithoutFolder) || hasItem || hasFolder) && (
                <>
                    <ProcessFormData processData={processFolderData} />
                    {getForm({
                        typeForm,
                        item,
                        hasItem,
                        isApprovalLegalControl,
                        isApprovalInternalLawyer,
                        submitWithoutFolder
                    })}
                    {(isApprovalLegalControl ||
                        isApprovalInternalLawyer ||
                        [
                            STATUS_APPROVALS_FLOW.APPROVED,
                            STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
                        ].includes(item.statusFlowId ?? -1)) && (
                        <ApprovalForm
                            item={item}
                            isApprovalLegalControl={isApprovalLegalControl}
                            isPaymentRequest={isPaymentRequest}
                            isApprovalInternalLawyer={isApprovalInternalLawyer}
                            page={t("Pagamentos:page")}
                            updateStatus={(value) => {
                                dispatch(
                                    updateStatusPaymentInspectionRequest(value)
                                );
                            }}
                            approvalConfirmationMessage={
                                isApprovalInternalLawyer ? (writeOffProvisionBalanceMessage as any)[writeOffProvisionBalance] : undefined
                            }
							moduloId={8}
                            
                        />
                    )}
                </>
            )}
        </ScreenTemplate>
    );
};

export default PaymentForm;
