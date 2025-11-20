import { useEffect, useMemo, SyntheticEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import { IconButton } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import Link from "@material-ui/core/Link";

import {
    getListPensionsPayment,
    getLoadingPayment,
    getFiltersPayment,
} from "src/core/store/modules/payment/selectors";
import { fetchPensionPayment } from "src/core/store/modules/payment/thunks";
import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import {
    statusTextApprovalsFlow,
    STATUS_APPROVALS_FLOW,
} from "src/core/utils/constants";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { Modulos } from "src/core/models/modules";
import moment from "moment";
import api from "src/core/api/payment-type";
import { TOptionsSelect } from "src/components/form";
import { IconDiv } from "./styled";

const ListPaymentsMini = ({
    pathname,
    id,
    setIsPaymentScreen,
}: {
    pathname: string;
    id: number;
    setIsPaymentScreen: (isPaymentScreen: boolean) => void;
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ...history } = useHistory();
    const preventDefault = (event: SyntheticEvent) => {
        event.preventDefault();
        setIsPaymentScreen(true);
    };

    const { page, pageSize } = usePagination();
    const items = useSelector(getListPensionsPayment);
    const loading = useSelector(getLoadingPayment);
    const paymentfilters = useSelector(getFiltersPayment);
    const { id: userId } = useSelector(getDataCurrentUser);
	const [paymentTypesOptions, setPaymentTypesOptions] = useState<TOptionsSelect[]>([])

	const apifetch = async () =>{
		try{
			const response = await api.list({
				modulo: Modulos.Pagamento,
			  });
			 
			  setPaymentTypesOptions(response.data.items.map((x: any) => {
				return {
					label: x.financeChartOfAccountsCategory?.name ?? "",
					value: x.id
				}
			  }))
		} catch {}
	}

    useEffect(() => {
        const { legalDepartmentAreaId, ...filters } =
            paymentfilters[pathname] ?? {};
        const result = rejectNoValues({
            ...filters,
            page,
            limit: 5,
            id,
        });
        dispatch(fetchPensionPayment(result));
		apifetch()
    }, [dispatch, paymentfilters, page, pageSize, pathname, id]);

    const columns: ColumnData[] = [
        {
            label: "Anexos",
            field: "custom",
            type: "custom",
            component: ({ files }: any) =>
                files &&
                files.length !== 0 && (
                    <IconDiv>
                        <IconButton
                            color="default"
                            size="small"
                            onClick={() =>
                                files.map(({ path }: any) =>
                                    window.open(path, "_blank")
                                )
                            }
                        >
                            <AttachmentIcon color="action" />
                        </IconButton>
                    </IconDiv>
                ),
        },
        { label: "Tipo do pagamento pensão", field: "formaPagamento" },
        {
            label: t("solicitacaoPagamento:dadosPagamento.dataPagamento"),
            field: "dataPagamento",
            type: "date",
        },
        { label: "Valor pagamento", field: "valueSap", type: "currency" },
        { label: "Status", field: "status" },
        { label: "Data lançamento SAP", field: "releaseDateSap", type: "date" },
        { label: "N° documento SAP", field: "documentNumberSap" },
        { label: "Data comprovante", field: "receiptDate", type: "date" },
    ];

    const handleAction = (row: any) => {
        history.push(`${pathname}/${row.id}`);
    };

    const rows = useMemo(
        () =>
            items.map(
                ({
                    statusFlowId,
                    statusApprovalId,
                    requesterId,
                    tipoPagamentoId,
                    accountingSAPResponses,
                    valorPrincipal,
                    ...item
                }) => {
                    const isApprovalLegalControl = false;
                    const isApprovalInternalLawyer = false;

                    let isEditButtonVisible = false;

                    if (
                        (isApprovalLegalControl &&
                            [
                                STATUS_APPROVALS_FLOW.NONE,
                                STATUS_APPROVALS_FLOW.REQUESTED,
                            ].includes(statusFlowId)) ||
                        (isApprovalInternalLawyer &&
                            STATUS_APPROVALS_FLOW.APPROVED === statusFlowId) ||
                        (!isApprovalLegalControl &&
                            !isApprovalInternalLawyer &&
                            (statusFlowId === STATUS_APPROVALS_FLOW.RETURNED ||
                                statusApprovalId ===
                                    STATUS_APPROVALS_FLOW.RETURNED) &&
                            userId === requesterId)
                    )
                        isEditButtonVisible = true;

                    let status = "";
                    statusApprovalId === 8
                        ? (status = statusTextApprovalsFlow[8])
                        : (status = statusTextApprovalsFlow[statusFlowId]);

                    if (
                        statusFlowId ===
                            STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
                        statusApprovalId === STATUS_APPROVALS_FLOW.NONE
                    )
                        status = "Aprovado internamente";

                    if (
                        statusFlowId ===
                            STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE &&
                        statusApprovalId ===
                            STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
                    )
                        status = "Aprovado";

					if(statusApprovalId === 0 && statusFlowId === 1){
						status = "Reprovado"
					}
					
					if(statusApprovalId === (-1 || null) && statusFlowId === 1){
						status = "Aprovado Advogado Interno"
					}

                    let sap = {
                        value: "",
                        message: "",
                        releaseDate: "",
                        documentNumber: "",
                        createdDate: "",
                    };
                    if (
                        accountingSAPResponses &&
                        accountingSAPResponses.length > 0
                    )
                        sap = { ...accountingSAPResponses[0] };

                    return {
                        ...item,
                        status,
                        statusFlowId,
                        isViewButtonHidden: isEditButtonVisible,
                        isEditButtonHidden: true,
                        formaPagamento: paymentTypesOptions.find(
                            ({ value }) => tipoPagamentoId === value
                        )?.label,
                        valueSap: valorPrincipal ?? "",
                        statusSap: sap?.message ?? "",
                        releaseDateSap:
                            sap?.releaseDate !== undefined
                                ? moment(sap?.releaseDate, "YYYYMMDD")
                                : "",
                        documentNumberSap: sap?.documentNumber ?? ""
                    };
                }
            ),
        [items, userId, paymentTypesOptions]
    );

    return (
        <Panel
            title={"Pagamentos"}
            slotTopRightPermission={"edit"}
            slotTopRight={
                <Link href="#" onClick={preventDefault} color="textSecondary">
                    Ver todos
                </Link>
            }
        >
            <TableComponent
                columns={columns}
                rows={rows}
                isLoading={loading}
                onEdit={handleAction}
                onVisualize={handleAction}
            />
        </Panel>
    );
};

export default ListPaymentsMini;
