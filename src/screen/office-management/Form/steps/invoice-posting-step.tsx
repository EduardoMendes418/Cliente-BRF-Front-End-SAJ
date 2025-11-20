import { useDispatch, useSelector } from "react-redux";
import Attachments from "src/components/Attachments";
import { Submit } from "src/components/button";
import {
  OfficeManagementPaymentStatus,
  TOfficeManagementPayment,
} from "src/core/models/office-management-payment";
import {
  getItemOfficeManagementPayment,
  getLoadingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import RequestPaymentSection from "../sections/request-payment-section";
import Form, {
  CurrencyField,
  DateField,
  SelectField,
  TextField,
} from "src/components/form";
import { useMemo } from "react";
import Logs from "src/components/Logs";
import moment from "moment";
import Panel from "src/components/Panel";
import { Grid } from "@material-ui/core";
import { useTranslation } from "src/locale/i18n";
import { addOfficeManagementPaymentExternalOffice } from "src/core/store/modules/office-management-payment/thunks";
import LawyerReviewSection from "../sections/lawyer-review-section";
import { toNumber } from "src/core/utils/func";
import {
  useOfficeManagementControl,
  useOfficeManagementDocuments
} from "src/hooks/fetchLists";

const InvoicePostingStep = () => {
  const item = useSelector(getItemOfficeManagementPayment);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { documentsAsOptions } = useOfficeManagementDocuments();
  const { controlAsOptions } = useOfficeManagementControl();

  const loading = useSelector(getLoadingOfficeManagementPayment);

  const initialValues: TOfficeManagementPayment = useMemo(() => {
    const initialValues = {
      id: item?.id,
      filesSolicitation: item ? item.filesSolicitation : [],
      companyId: item?.companyId,
      registerDate: moment().format("DD/MM/YYYY").toString(),
      invoiceNumber: "",
      company: { name: item ? item?.company?.name : "" },
      invoiceTotalAmount: item?.preInvoiceTotalAmount,
      invoiceIssuanceDate: "",
      externalOfficeObservation: "",
      documentTypeId: "",
      legalResponsibleControlId: "",
      files: [] as unknown as FileList,
    } as TOfficeManagementPayment;
    return initialValues;
  }, [item]);

  const onSubmit = (values: TOfficeManagementPayment, actions: any) => {
    const newValues = {
      ...item,
      invoiceNumber: toNumber(values.invoiceNumber!),
      invoiceTotalAmount: toNumber(values.invoiceTotalAmount!),
      invoiceIssuanceDate: new Date(values.invoiceIssuanceDate!),
      externalOfficeObservation: values.externalOfficeObservation,
      documentTypeId: values.documentTypeId,
      legalResponsibleControlId: values.legalResponsibleControlId,
      files: values.files,
      registerDate: new Date(),
    } as TOfficeManagementPayment;
    dispatch(addOfficeManagementPaymentExternalOffice(newValues));
    actions.setSubmitting(false);
  };

  return (
    <Form enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
      {({
        handleSubmit,
        isSubmitting,
        dirty,
        setSubmitting,
        setFieldValue,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <RequestPaymentSection />

          <Attachments
            disabled
            label=""
            name="filesSolicitation"
            id="filesSolicitation"
            multiple
          />

          <LawyerReviewSection />

          <Logs
            logs={item?.treatedLogs}
            statuses={OfficeManagementPaymentStatus}
            statusOrder={["flow", "approvalCenter"]}
          />

          <Panel
            title={t("officeManagement:lawyerReview.representante")}
            withPadding
            loading={loading}
          >
            <Grid container spacing={3}>
              <Grid item md={3} xs={12}>
                <TextField
                  label={t("officeManagement:registerDate")}
                  disabled
                  name="registerDate"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label={t("officeManagement:requestPayment.socialReason")}
                  name="company.name"
                  disabled
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label={t("officeManagement:note")}
                  name="invoiceNumber"
                  type="number"
                  required
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <DateField
                  label={t("officeManagement:noteData")}
                  name="invoiceIssuanceDate"
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={3} xs={12}>
                <CurrencyField
                  label={t("officeManagement:noteValue")}
                  name="invoiceTotalAmount"
				  disabled
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <SelectField
                  label={t("officeManagement:documentType")}
                  name="documentTypeId"
                  options={documentsAsOptions}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <SelectField
                  required
                  label={t("officeManagement:legalResponsibleControlId")}
                  name="legalResponsibleControlId"
                  options={controlAsOptions}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <TextField
                  required
                  label={t("officeManagement:obs")}
                  name="externalOfficeObservation"
                />
              </Grid>
            </Grid>
          </Panel>

          <Attachments
            label=""
            panelConfig={{
              slotBottomRight: (
                <Submit submitting={isSubmitting} disabled={!dirty} />
              ),
              slotBottonRightPermission: true,
            }}
            name="files"
            id="files"
            multiple
          />
        </form>
      )}
    </Form>
  );
};

export default InvoicePostingStep;
