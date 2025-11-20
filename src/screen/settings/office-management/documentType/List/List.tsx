import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
  getErrorMessageOfficeManagementDocumentType,
  getListFiltersOfficeManagementDocumentType,
  getListOfficeManagementDocumentType,
  getStatusOfficeManagementDocumentType,
  getLoadingOfficeManagementDocumentType,
} from "src/core/store/modules/office-management-document-type/selectors";
import {
  editOfficeManagementDocumentType,
  fetchOfficeManagementDocumentType,
} from "src/core/store/modules/office-management-document-type/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementDocumentType } from "src/core/models/office-management-document-type";
import { useRegisterDefault } from "src/hooks";

const DocumentType = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();
  const { page, pageSize } = usePagination();

  const list = useSelector(getListOfficeManagementDocumentType);
  const filters = useSelector(getListFiltersOfficeManagementDocumentType);
  const loading = useSelector(getLoadingOfficeManagementDocumentType);

  useRegisterDefault({
    action: "officeManagementDocumentType",
    getStatus: getStatusOfficeManagementDocumentType,
    getErrorMessage: getErrorMessageOfficeManagementDocumentType,
    route: "",
    updateInListCallback: () =>
      dispatch(
        fetchOfficeManagementDocumentType({ ...filters, page, pageSize })
      ),
  });

  useEffect(() => {
    dispatch(fetchOfficeManagementDocumentType({ ...filters, page, pageSize }));
  }, [dispatch, page, pageSize, filters]);

  const handleChange = ({
    isActive,
    ...row
  }: TOfficeManagementDocumentType) => {
    if (row.id)
      dispatch(
        editOfficeManagementDocumentType({ ...row, isActive: !isActive })
      );
  };

  const columns: ColumnData[] = [
    { label: t("settings:control.id"), field: "id" },
    { label: t("settings:documentType.documentType"), field: "name" },
    {
      label: t("provisions:orderStatus.status"),
      field: "isActive",
      type: "switch-button",
      onChange: handleChange,
    },
  ];

  const onEdit = ({ id }: TOfficeManagementDocumentType) => {
    history.push(`/configuracoes/gestao-escritorio/documento/${id}`);
  };

  return (
    <>
      <Panel title={t("settings:documentType.documentTypeList")}>
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

export default DocumentType;
