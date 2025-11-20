import { useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

import TableComponent, { ColumnData } from "src/components/Table";
import Panel from "src/components/Panel";
import Pagination from "src/components/Pagination";

import {
    getListBusinessCombinationAccounting,
    getLoadingBusinessCombinationAccounting,
} from "src/core/store/modules/business-combination-accounting/selectors";
import { useTranslation } from "src/locale/i18n";
import { statusTexBC } from "src/screen/closure/business-combination/constants";

const List = () => {
    const { t } = useTranslation();

    const list = useSelector(getListBusinessCombinationAccounting);
    const loading = useSelector(getLoadingBusinessCombinationAccounting);
    const rows = useMemo(
        () =>
            list.map((item) => ({
                ...item,
                monthCompetence: moment(item.competence).format("MM/yyyy"),
                date: moment(item.createdDate).format("DD/MM/yyyy"),
                hour: moment(item.createdDate).format("HH:mm"),
                statusText: (statusTexBC as any)[item.status],
                dejurArea: item.area?.path,
                requestingUser: item.requester?.name,
            })),
        [list]
    );

    const columns: ColumnData[] = [
        { label: t("closure:businesCombination.list.id"), field: "id" },
        {
            label: t("closure:businesCombination.list.monthOfCompetence"),
            field: "monthCompetence",
        },
        {
            label: t("closure:businesCombination.search.dejurArea"),
            field: "dejurArea",
        },
        {
            label: t("closure:businesCombination.list.requestingUser"),
            field: "requestingUser",
        },
        { label: t("closure:businesCombination.list.date"), field: "date" },
        { label: t("closure:businesCombination.list.hour"), field: "hour" },
        { label: t("closure:closingRoutine.list.status"), field: "statusText" },
    ];

    return (
        <>
            <Panel title={t("closure:businesCombination.list.title")}>
                <TableComponent columns={columns} rows={rows} isLoading={loading} />
            </Panel>
            <Pagination />
        </>
    );
};

export default List;
