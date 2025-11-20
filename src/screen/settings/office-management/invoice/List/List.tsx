import { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
  getErrorMessageOfficeManagementInvoice,
  getListFiltersOfficeManagementInvoice,
  getListOfficeManagementInvoice,
  getStatusOfficeManagementInvoice,
  getLoadingOfficeManagementInvoice,
} from "src/core/store/modules/office-management-invoice/selectors";
import {
  editOfficeManagementInvoice,
  fetchOfficeManagementInvoice,
} from "src/core/store/modules/office-management-invoice/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementInvoice } from "src/core/models/office-management-invoice";
import { useRegisterDefault } from "src/hooks";
import { useAreasWitchGroups } from "src/hooks/fetchLists";

const List = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();
  const { page, pageSize } = usePagination();
  const { areasDEJUROptions } = useAreasWitchGroups();

  const list = useSelector(getListOfficeManagementInvoice);
  const filters = useSelector(getListFiltersOfficeManagementInvoice);
  const loading = useSelector(getLoadingOfficeManagementInvoice);

  useRegisterDefault({
    action: "officeManagementInvoice",
    getStatus: getStatusOfficeManagementInvoice,
    getErrorMessage: getErrorMessageOfficeManagementInvoice,
    route: "",
    updateInListCallback: () =>
      dispatch(fetchOfficeManagementInvoice({ ...filters, page, pageSize })),
  });

  const rows = useMemo(
    () =>
      list.map((item) => {
        const findedArea = areasDEJUROptions.find(
          (op) => op.value === item.areaId
        );

        return {
          ...item,
          dejurArea: findedArea?.label,
        };
      }),
    [list, areasDEJUROptions]
  );

  useEffect(() => {
    dispatch(fetchOfficeManagementInvoice({ ...filters, page, pageSize }));
  }, [dispatch, page, pageSize, filters]);

  const handleChange = ({ isActive, ...row }: TOfficeManagementInvoice) => {
    if (row.id)
      dispatch(editOfficeManagementInvoice({ ...row, isActive: !isActive }));
  };

  const columns: ColumnData[] = [
    { label: t("settings:control.id"), field: "id" },
    { label: t("settings:invoice.nature"), field: "description" },
    { label: t("settings:invoice.areaDejur"), field: "dejurArea" },
    { label: t("settings:invoice.requestSap"), field: "typeRequestSAP" },
    {
      label: t("settings:invoice.natureCategory"),
      field: "categoryRequestSAP",
    },
    {
      label: t("provisions:orderStatus.status"),
      field: "isActive",
      type: "switch-button",
      onChange: handleChange,
    },
  ];

  const onEdit = ({ id }: TOfficeManagementInvoice) => {
    history.push(`/configuracoes/gestao-escritorio/nota-fiscal/${id}`);
  };

  return (
    <>
      <Panel title={t("settings:invoice.list")}>
        <TableComponent
          onEdit={onEdit}
          columns={columns}
          rows={rows}
          isLoading={loading}
        />
      </Panel>
      <Pagination />
    </>
  );
};

export default List;
