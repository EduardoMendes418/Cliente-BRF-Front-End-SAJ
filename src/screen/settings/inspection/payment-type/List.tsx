import { Grid } from "@material-ui/core";
import { useEffect, useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Clean, Submit } from "src/components/button";
import { TextField } from "src/components/form";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import TableComponent, { ColumnData } from "src/components/Table";
import { Modulos } from "src/core/models/modules";
import { TPaymentType } from "src/core/models/payment-type";
import { actions } from "src/core/store";
import {
  getErrorMessagePaymentType,
  getListPaymentType,
  getLoadingPaymentType,
  getStatusPaymentType,
} from "src/core/store/modules/payment-type/selectors";
import {
  editPaymentType,
  fetchPaymentType,
} from "src/core/store/modules/payment-type/thunks";
import { useRegisterDefault } from "src/hooks";
import { usePagination } from "src/hooks/pagination";
import { useTranslation } from "src/locale/i18n";

type Search = {
  description: string;
};

const TipoDePagamentoList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ...history } = useHistory();

  const list = useSelector(getListPaymentType);
  const isFetching = useSelector(getLoadingPaymentType);
  const status = useSelector(getStatusPaymentType);

  const { page, pageSize } = usePagination();

  useRegisterDefault({
    action: "paymentType",
    getStatus: getStatusPaymentType,
    getErrorMessage: getErrorMessagePaymentType,
    route: "",
    updateInListCallback: () =>
      dispatch(
        fetchPaymentType({
          page,
          pageSize,
          modulo: Modulos.Inspection,
        })
      ),
  });

  useEffect(() => {
    dispatch(fetchPaymentType({ page, pageSize, modulo: Modulos.Inspection }));
  }, [dispatch, page, pageSize]);

  const rows = useMemo(
    () =>
      list.map((item) => ({
        ...item,
        paymentTypeName: item.financeChartOfAccountsCategory?.name ?? "",
      })),
    [list]
  );
  const handleChange = (row: TPaymentType) => {
    if (!row.id) return;
    const values = {
      ...row,
      status: !row.status,
      moduloId: Modulos.Inspection,
    };
    dispatch(editPaymentType({ id: row.id, values }));
  };

  const columns: ColumnData[] = [
	{
		label: t("inspection:form.id"),
		field: "id",
	},
    {
      label: t("inspection:form.type"),
      field: "paymentTypeName",
    },
    {
      label: t("inspection:form.status"),
      field: "status",
      type: "switch-button",
      onChange: handleChange,
    },
  ];

  const initialValues: Search = { description: "" };

  const handleEdit = (row: TPaymentType) => {
    dispatch(actions.inspectionMethod.setItem(row));
    history.push(`/configuracoes/fiscalizacao/tipo-pagamento/${row.id}`);
  };

  const handleSubmit = (
    value: Search,
    { setSubmitting }: FormikHelpers<Search>
  ) => {
    dispatch(
      fetchPaymentType({
        page,
        pageSize,
        modulo: Modulos.Inspection,
        desc: value.description,
      })
    );
    setSubmitting(false);
  };

  const handleClear = () => {
    dispatch(
      fetchPaymentType({
        page,
        pageSize,
        modulo: Modulos.Inspection,
      })
    );
  };

  return (
    <ScreenTemplate slotTopRight>
      <Panel title={t("inspection:tipoPagamento_search")} withPadding>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={6} xs={10}>
                  <TextField
                    label={t("inspection:form.type")}
                    name="description"
                  />
                </Grid>
                <Grid item>
                  <Submit
                    type="search"
                    submitting={isFetching || status === "saving"}
                  />
                </Grid>
              </Grid>
              <Clean onClick={handleClear} />
            </form>
          )}
        </Formik>
      </Panel>
      <Panel title={t("inspection:tipoPagamento_plural")} withPadding>
        <TableComponent
          onEdit={handleEdit}
          columns={columns}
          rows={rows}
          isLoading={isFetching}
        />
      </Panel>
      <Pagination />
    </ScreenTemplate>
  );
};

export default TipoDePagamentoList;
