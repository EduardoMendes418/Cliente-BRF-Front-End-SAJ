import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import {
  getErrorMessageOfficeManagementPayment,
  getListFiltersOfficeManagementPayment,
  getListOfficeManagementPayment,
  getStatusOfficeManagementPayment,
  getLoadingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import { fetchOfficeManagementPayment } from "src/core/store/modules/office-management-payment/thunks";

import { useTranslation } from "src/locale/i18n";
import { TOfficeManagementPayment } from "src/core/models/office-management-payment";
import { useRegisterDefault } from "src/hooks";
import {
  getOfficeManagementType,
  OfficeManagementStageStatusList,
  OfficeManagementTypeEnum,
} from "../utils/getOfficeManagementType";
import moment from "moment";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

const List = ({ pathname }: { pathname: string }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [stage] = useState(getOfficeManagementType(pathname));

  const dispatch = useDispatch();
  const { page, pageSize } = usePagination();

  const list = useSelector(getListOfficeManagementPayment);
  const filters = useSelector(getListFiltersOfficeManagementPayment);
  const loading = useSelector(getLoadingOfficeManagementPayment);
  const { id } = useSelector(getDataCurrentUser);

  useRegisterDefault({
    action: "officeManagementPayment",
    getStatus: getStatusOfficeManagementPayment,
    getErrorMessage: getErrorMessageOfficeManagementPayment,
    route: "",
    updateInListCallback: () => {
      return dispatch(
        fetchOfficeManagementPayment({
          ...filters,
          page,
          pageSize,
          stage,
          userFilter: id ? String(id) : "",
        })
      );
    },
  });

  useEffect(() => {
    dispatch(
      fetchOfficeManagementPayment({
        page,
        pageSize,
        stage,
      })
    );
  }, [dispatch, page, pageSize, stage]);

  const columns: ColumnData[] = [
    {
      label: t("officeManagement:requestPayment.requestNumber"),
      field: "id",
    },
    {
      label: t("officeManagement:requestPayment.requestData"),
      field: "requestDate",
    },
    {
      label: t("officeManagement:requestPayment.socialReason"),
      field: "companyName",
    },
    {
      label: t("officeManagement:requestPayment.preInvoiceNumber"),
      field: "preInvoiceNumber",
    },
    {
      label: t("officeManagement:inHouseLawyer"),
      field: "internalLawyerName",
    },
    {
      label: t("officeManagement:requestPayment.status"),
      field: "aprovalStatus",
    },
  ];

  const rows = useMemo(
    () =>
      list.map((item: any) => {
        return {
          ...item,
          internalLawyerName: item.internalLawyer.name,
          companyName: item.company.name,
          aprovalStatus: (OfficeManagementStageStatusList as any)[item.stage!],
          requestDate: item.requestDate
            ? moment(new Date(item.requestDate)).format("DD/MM/YYYY")
            : null,
          isViewButtonHidden:
            stage === OfficeManagementTypeEnum.requestPayment
              ? item.stage === OfficeManagementTypeEnum.requestPayment
              : true,
          isEditButtonHidden:
            stage === OfficeManagementTypeEnum.requestPayment
              ? item.stage !== OfficeManagementTypeEnum.requestPayment
              : false,
        };
      }),
    [list, stage]
  );

  const onEdit = ({ id }: TOfficeManagementPayment) => {
    history.push(`${pathname}/${id}`);
  };

  return (
    <>
      <Panel title={t("officeManagement:list")}>
        <TableComponent
          onEdit={onEdit}
          columns={columns}
          rows={rows}
          isLoading={loading}
          onVisualize={onEdit}
        />
      </Panel>
      <Pagination />
    </>
  );
};

export default List;
