import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getPensionRequestListFilters,
    getPensionRequestRows,
    getPensionRequestStatus,
} from "src/core/store/modules/pensions/request-pensions/selectors";
import { fetchPensionRequest } from "src/core/store/modules/pensions/request-pensions/thunks";
import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import { useTranslation } from "src/locale/i18n";
import Pagination from "src/components/Pagination";
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";
import { useHistory } from "react-router-dom";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import { getPensionCategoriesAsOptions } from "src/core/store/modules/pensions/request-pensions/selectors";
import { useAreasWitchGroups, usePaymentMethod } from "src/hooks/fetchLists";
import { statusTextApprovalsFlow } from "src/core/utils/constants";

const List = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const { page, pageSize } = usePagination();
    const items = useSelector(getPensionRequestRows);
    const status = useSelector(getPensionRequestStatus);
    const filters = useSelector(getPensionRequestListFilters);
    const pensionCategoryOptions = useSelector(getPensionCategoriesAsOptions);
    const { areasDEJUROptions } = useAreasWitchGroups();
    const { allPaymentMethodAsOptions } = usePaymentMethod(Modulos.Pension);

    const rows = useMemo(
        () =>
            items.map((item) => ({
                ...item,
                pensionCategory: pensionCategoryOptions.find(
                    ({ value }) => item.pensionCategoryId === value
                )?.label,
                paymentFormat: allPaymentMethodAsOptions.find(
                    ({ value }) => item.paymentFormatId === value
                )?.label,
                status: statusTextApprovalsFlow[item.statusFlowId ?? -1],
                isViewButtonHidden: item.requestStatus === 1,
                isEditButtonHidden: item.requestStatus !== 1,
            })),
        [items, pensionCategoryOptions, allPaymentMethodAsOptions]
    );

    useEffect(() => {
        dispatch(
            fetchPaymentMethod({ moduloId: Modulos.Pension, notPaginate: true })
        );
        dispatch(
            fetchPaymentType({ modulo: Modulos.Pension, notPaginate: true })
        );
    }, [dispatch]);

    useEffect(() => {
        const result = rejectNoValues({ ...filters, page, pageSize });
        dispatch(
            fetchPensionRequest({
                ...result,
                statusFlowIds: [1],
                statusApprovalIds: [1],
            })
        );
    }, [dispatch, page, pageSize, filters]);

    const columns: ColumnData[] = [
        { label: t("pension:request.requestNumber"), field: "id" },
        {
            label: t("pension:request.requestDate"),
            field: "requestDate",
            type: "date",
        },
        { label: "Pasta CTG", field: "folderNumber" },
        { label: t("form.area"), field: "area" },
        {
            label: "Processo",
            field: "processNumber",
            type: "number",
        },
        {
            label: t("pension:request.nameOppositeParty"),
            field: "parteContraria",
        },
        {
            label: "Categoria da pensão",
            field: "pensionCategory",
        },
        {
            label: "Forma de pagamento",
            field: "paymentFormat",
        },
		{
			label: "Data início pagamento pensão",
			field: "paymentStartDate"
		}
    ];

    const handleView = (row: any) => {
        history.push(`/pensoes/gestao-da-solicitacao-pensao/${row.id}`);
    };

    return (
        <>
            <Panel title={t("pension:request.list.title")}>
                <TableComponent
                    columns={columns}
                    rows={rows}
                    isLoading={status === "fetching"}
                    onEdit={handleView}
                    onVisualize={handleView}
                />
            </Panel>
            <Pagination />
        </>
    );
};

export default List;
