import { Grid } from "@material-ui/core";
import { Formik } from "formik";
import FieldColumn from "src/components/FieldColumn";
import { DateField } from "src/components/form";
import Panel from "src/components/Panel";
import TableComponent from "src/components/Table";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import { t } from "src/locale/i18n";

const breadcrumbs = [
  { label: t("dashboard"), url: "/" },
  { label: t("pension:request.title"), url: "/pensoes" },
  { label: t("pagamentos") },
];

const RequestPensionsPayments = () => {
  const columns = [
    { label: t("pension:request.payments.SAPDateProvision"), field: "" },
    {
      label: t("pension:request.payments.SAPDocumentNumberProvision"),
      field: "",
    },
    { label: t("pension:request.payments.SAPProvisionedAmount"), field: "" },
  ];

  const initialValues = {
    dateBegin: null,
    dateEnd: null,
  };

  const onSubmit = (values: {
    dateBegin: string | null;
    dateEnd: string | null;
  }) => {};

  return (
    <ScreenTemplate breadcrumbsPath={breadcrumbs}>
      <Panel
        title={t("solicitacaoPagamento:dadosFavorecido.title")}
        withPadding
      >
        <Grid container>
          <Grid item xs={3}>
            <FieldColumn label={t("personInformation.cpf")} value="" />
          </Grid>
          <Grid item xs={3}>
            <FieldColumn label={t("personInformation.name")} value="" />
          </Grid>
          <Grid item xs={3}>
            <FieldColumn label={t("personInformation.birthDate")} value="" />
          </Grid>
        </Grid>
      </Panel>

      <Panel title={t("pension:request.payments.paymentPeriod")} withPadding>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                  <DateField
                    name="dateBegin"
                    label={t("solicitacaoPagamento:irTable.from")}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <DateField
                    name="dateEnd"
                    label={t("solicitacaoPagamento:irTable.to")}
                  />
                </Grid>
                <Grid item md={1} xs={2}>
                  <Submit type="search" />
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
        <TableComponent columns={columns} rows={[]} />
      </Panel>
    </ScreenTemplate>
  );
};

export default RequestPensionsPayments;
