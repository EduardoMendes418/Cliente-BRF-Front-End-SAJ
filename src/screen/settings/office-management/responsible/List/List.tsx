import { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
  getErrorMessageOfficeManagementResponsible,
  getListFiltersOfficeManagementResponsible,
  getListOfficeManagementResponsible,
  getStatusOfficeManagementResponsible,
  getLoadingOfficeManagementResponsible,
} from "src/core/store/modules/office-management-responsible/selectors";
import {
  editOfficeManagementResponsible,
  fetchOfficeManagementResponsible,
} from "src/core/store/modules/office-management-responsible/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementResponsible } from "src/core/models/office-management-responsible";
import { useRegisterDefault } from "src/hooks";
import { useAreasWitchGroups } from "src/hooks/fetchLists";

const List = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();
  const { page, pageSize } = usePagination();
	const { areasDEJUROptions } = useAreasWitchGroups();

  const list = useSelector(getListOfficeManagementResponsible);
  const filters = useSelector(getListFiltersOfficeManagementResponsible);
  const loading = useSelector(getLoadingOfficeManagementResponsible);

  useRegisterDefault({
    action: "officeManagementResponsible",
    getStatus: getStatusOfficeManagementResponsible,
    getErrorMessage: getErrorMessageOfficeManagementResponsible,
    route: "",
    updateInListCallback: () =>
      dispatch(
        fetchOfficeManagementResponsible({ ...filters, page, pageSize })
      ),
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
    dispatch(fetchOfficeManagementResponsible({ ...filters, page, pageSize }));
  }, [dispatch, page, pageSize, filters]);

  const handleChange = ({ isActive, ...row }: TOfficeManagementResponsible) => {
    if (row.id)
      dispatch(
        editOfficeManagementResponsible({ ...row, isActive: !isActive })
      );
  };

  const columns: ColumnData[] = [
    { label: t("settings:control.id"), field: "id" },
    { label: t("settings:responsibleLegalArea.name"), field: "name" },
    { label: t("settings:responsibleLegalArea.areaDejur"), field: "dejurArea" },
    {
      label: t("provisions:orderStatus.status"),
      field: "isActive",
      type: "switch-button",
      onChange: handleChange,
    },
  ];

  const onEdit = ({ id }: TOfficeManagementResponsible) => {
    history.push(`/configuracoes/gestao-escritorio/responsavel/${id}`);
  };

  return (
    <>
      <Panel
        title={t("settings:responsibleLegalArea.responsibleLegalAreaList")}
      >
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
