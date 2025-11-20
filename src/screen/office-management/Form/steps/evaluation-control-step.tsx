import { useDispatch, useSelector } from "react-redux";
import Attachments from "src/components/Attachments";
import { Submit } from "src/components/button";
import {
  OfficeManagementPaymentStatus,
  TOfficeManagementPayment,
  TOfficeManagementPaymentItem,
} from "src/core/models/office-management-payment";
import {
  getItemOfficeManagementPayment,
  getLoadingOfficeManagementPayment,
  getLoadingSavingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import RequestPaymentSection from "../sections/request-payment-section";
import Form, { CurrencyField, DateField, TextField } from "src/components/form";
import { useMemo, useState } from "react";
import Logs from "src/components/Logs";
import Panel from "src/components/Panel";
import { Grid, Box, IconButton } from "@material-ui/core";
import { useTranslation } from "src/locale/i18n";
import LawyerReviewSection from "../sections/lawyer-review-section";
import InvoicePostingSection from "../sections/invoice-posting-section";
import {
  addOfficeManagementPaymentLegalResponsibleControl,
  addOfficeManagementPaymentSendSap,
} from "src/core/store/modules/office-management-payment/thunks";
import EvaluationJuridicalSection from "../sections/evaluation-juridical-section";
import TableComponent, { ColumnData } from "src/components/Table";
import AddIcon from "@material-ui/icons/Add";
import { numberToCurrency } from "src/core/utils/func";

const EvaluationControlStep = () => {
  const item = useSelector(getItemOfficeManagementPayment);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(getLoadingOfficeManagementPayment);
  const loadingSaving = useSelector(getLoadingSavingOfficeManagementPayment);
  const [isSendSap, setisSendSap] = useState(false);

  const initialValues: TOfficeManagementPayment = useMemo(() => {
    const initialValues = {
      solicitation: item ? item.solicitation : "",
      serviceSheet: item ? item.serviceSheet : "",
      paymentDate: item ? item.paymentDate : "",
      companyName: item ? item.companyName : "",
      exercicio: item ? item.exercicio : "",
      docNumberSAP: item ? item.docNumberSAP : "",
      request: item ? item.request : "",
      costExpense: "",
      amount: "",
      itemContract: "",
      paymentItems: item
        ? item.itens?.map((el) => ({
            ...el,
            costExpense: numberToCurrency(el!.costExpense!),
          }))
        : ([] as TOfficeManagementPaymentItem[]),
      itensToDelete: [] as TOfficeManagementPaymentItem[],
      filesSolicitation: item ? item.filesSolicitation : [],
      filesExternalOffice: item ? item.filesExternalOffice : [],
      files: item ? item.filesResponsibleControl : ([] as unknown as FileList),
    } as TOfficeManagementPayment;
    return initialValues;
  }, [item]);

  const onSubmit = (values: TOfficeManagementPayment, actions: any) => {
    const newValues = { ...values };
    newValues.paymentItems = values.paymentItems.filter((el) => !el.id);

    if (isSendSap) {
      dispatch(addOfficeManagementPaymentSendSap(item!.id!));
    } else {
      dispatch(
        addOfficeManagementPaymentLegalResponsibleControl({
          ...item,
          ...newValues,
        })
      );
			setisSendSap(true);
    }

    actions.setSubmitting(false);
  };

  const columns: ColumnData[] = [
    {
      label: t("officeManagement:itemContract"),
      field: "itemContract",
    },
    {
      label: t("officeManagement:amount"),
      field: "amount",
    },
    {
      label: t("officeManagement:costExpense"),
      field: "costExpense",
    },
  ];

  const addPaymentItem = (
    values: TOfficeManagementPayment,
    setFieldValue: any
  ) => {
    const newPaymentItems = [...values.paymentItems];

    const newPaymentItem: TOfficeManagementPaymentItem = {
      tempId: newPaymentItems.length,
      amount: values.amount,
      costExpense: numberToCurrency(values.costExpense),
      itemContract: values.itemContract,
    };

    newPaymentItems.push(newPaymentItem);

    setFieldValue("paymentItems", newPaymentItems);
    setFieldValue("amount", "");
    setFieldValue("costExpense", "");
    setFieldValue("itemContract", "");
  };

  const deletePaymentItem = (
    values: TOfficeManagementPayment,
    setFieldValue: any,
    row: TOfficeManagementPaymentItem
  ) => {
    const newPaymentItems = [...values.paymentItems];
    const idx = newPaymentItems.findIndex((el) => el.tempId === row.tempId);
    const selected = newPaymentItems.find((el) => el.tempId === row.tempId);

    if (selected && selected.id) {
      const newPaymentItemsToDelete = [...values.itensToDelete, selected];
      setFieldValue("itensToDelete", newPaymentItemsToDelete);
    }

    newPaymentItems.splice(idx, 1);
    setFieldValue("paymentItems", newPaymentItems);
  };

  const editPaymentItem = (
    values: TOfficeManagementPayment,
    setFieldValue: any,
    row: TOfficeManagementPaymentItem
  ) => {
    setFieldValue("amount", row.amount);
    setFieldValue("costExpense", row.costExpense);
    setFieldValue("itemContract", row.itemContract);
    deletePaymentItem(values, setFieldValue, row);
  };

  return (
    <Form enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
      {({
        handleSubmit,
        isSubmitting,
        dirty,
        setSubmitting,
        setFieldValue,
        values,
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

          <InvoicePostingSection />

          <Attachments
            disabled
            label=""
            name="filesExternalOffice"
            id="filesExternalOffice"
            multiple
          />

          <EvaluationJuridicalSection />

          <Logs
            logs={item?.treatedLogs}
            statuses={OfficeManagementPaymentStatus}
            statusOrder={["flow", "approvalCenter"]}
          />

          <Panel
            title={t("officeManagement:evaluationControl.title")}
            withPadding
            loading={loading}
          >
            <Grid container spacing={3}>
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  label={t("officeManagement:itemContract")}
                  name="itemContract"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  label={t("officeManagement:amount")}
                  name="amount"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <CurrencyField
                  label={t("officeManagement:costExpense")}
                  name="costExpense"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <IconButton
                  disabled={
                    values.costExpense.length === 0 ||
                    values.amount.length === 0 ||
                    values.itemContract.length === 0
                  }
                  color="primary"
                  type="button"
                  onClick={() => addPaymentItem(values, setFieldValue)}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Box marginY={4}>
              <TableComponent
                columns={columns}
                rows={values.paymentItems}
                isLoading={loading}
                onDelete={(row) =>
                  deletePaymentItem(values, setFieldValue, row)
                }
                onEdit={(row) => editPaymentItem(values, setFieldValue, row)}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:solicitation")}
                  name="request"
                  placeholder=""
                  disabled
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:serviceSheet")}
                  name="serviceSheet"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <DateField
                  label={t("officeManagement:paymentDate")}
                  name="paymentDate"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:companyName")}
                  name="companyName"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:exercicio")}
                  name="exercicio"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:docNumberSAP")}
                  name="docNumberSAP"
                />
              </Grid>
            </Grid>
          </Panel>
          <Attachments
            label=""
            panelConfig={{
              slotBottomRight: (
                <div>
                  <Submit
                    submitting={isSubmitting || loadingSaving}
                    disabled={!dirty}
                    style={{ marginRight: "1rem" }}
                  />
				  	<Submit
                      submitting={isSubmitting || loadingSaving}
                      disabled={!isSendSap}
                      text="integrar sap"
                      type="button"
                    />
                </div>
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

export default EvaluationControlStep;
