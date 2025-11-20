import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
  getErrorMessageOfficeManagementStatus,
  getListOfficeManagementStatus,
  getListFiltersOfficeManagementStatus,
  getStatusOfficeManagementStatus,
  getLoadingOfficeManagementStatus,
} from "src/core/store/modules/office-management-status/selectors";
import {
  editOfficeManagementStatus,
  fetchOfficeManagementStatus,
} from "src/core/store/modules/office-management-status/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementStatus } from "src/core/models/office-management-status";
import { useRegisterDefault } from "src/hooks";

const Status = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();
  const { page, pageSize } = usePagination();

  const list = useSelector(getListOfficeManagementStatus);
  const filters = useSelector(getListFiltersOfficeManagementStatus);
  const loading = useSelector(getLoadingOfficeManagementStatus);

  useRegisterDefault({
    action: "officeManagementStatus",
    getStatus: getStatusOfficeManagementStatus,
    getErrorMessage: getErrorMessageOfficeManagementStatus,
    route: "",
    updateInListCallback: () =>
      dispatch(fetchOfficeManagementStatus({ ...filters, page, pageSize })),
  });

  useEffect(() => {
    dispatch(fetchOfficeManagementStatus({ ...filters, page, pageSize }));
  }, [dispatch, page, pageSize, filters]);

  const handleChangeStatus = ({
    isActive,
    ...row
  }: TOfficeManagementStatus) => {
    if (row.id)
      dispatch(editOfficeManagementStatus({ ...row, isActive: !isActive }));
  };

  const columns: ColumnData[] = [
    { label: t("settings:control.id"), field: "id" },
    { label: t("settings:status.statusName"), field: "name" },
    {
      label: t("provisions:orderStatus.status"),
      field: "isActive",
      type: "switch-button",
      onChange: handleChangeStatus,
    },
  ];

  const onEdit = ({ id }: TOfficeManagementStatus) => {
    history.push(`/configuracoes/gestao-escritorio/status/${id}`);
  };

  return (
    <>
      <Panel title={t("settings:status.statusList")} >
        <TableComponent
          onEdit={onEdit}
          columns={columns}
          rows={list}
          isLoading={loading}
        />
      </Panel>
      <Pagination />
    </>
  );
};

export default Status;
