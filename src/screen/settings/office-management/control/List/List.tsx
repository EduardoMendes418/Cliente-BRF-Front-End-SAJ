import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
  getErrorMessageOfficeManagementControl,
  getListFiltersOfficeManagementControl,
  getListOfficeManagementControl,
  getStatusOfficeManagementControl,
  getLoadingOfficeManagementControl,
} from "src/core/store/modules/office-management-control/selectors";
import {
  editOfficeManagementControl,
  fetchOfficeManagementControl,
} from "src/core/store/modules/office-management-control/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementControl } from "src/core/models/office-management-control";
import { useRegisterDefault } from "src/hooks";

const List = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();
  const { page, pageSize } = usePagination();

  const list = useSelector(getListOfficeManagementControl);
  const filters = useSelector(getListFiltersOfficeManagementControl);
  const loading = useSelector(getLoadingOfficeManagementControl);

  useRegisterDefault({
    action: "officeManagementControl",
    getStatus: getStatusOfficeManagementControl,
    getErrorMessage: getErrorMessageOfficeManagementControl,
    route: "",
    updateInListCallback: () =>
      dispatch(fetchOfficeManagementControl({ ...filters, page, pageSize })),
  });

  useEffect(() => {
    dispatch(fetchOfficeManagementControl({ ...filters, page, pageSize }));
  }, [dispatch, page, pageSize, filters]);

  const handleChange = ({ isActive, ...row }: TOfficeManagementControl) => {
    if (row.id)
      dispatch(editOfficeManagementControl({ ...row, isActive: !isActive }));
  };

  const columns: ColumnData[] = [
    { label: t("settings:control.id"), field: "id" },
    { label: t("settings:control.name"), field: "name" },
    {
      label: t("provisions:orderStatus.status"),
      field: "isActive",
      type: "switch-button",
      onChange: handleChange,
    },
  ];

  const onEdit = ({ id }: TOfficeManagementControl) => {
    history.push(`/configuracoes/gestao-escritorio/controle/${id}`);
  };

  return (
    <>
      <Panel title={t("settings:control.controlList")}>
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

export default List;
