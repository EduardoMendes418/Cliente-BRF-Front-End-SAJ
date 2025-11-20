import { useDispatch, useSelector } from "react-redux";
import Attachments from "src/components/Attachments";
import {
  OfficeManagementPaymentStatus,
  TOfficeManagementPayment,
} from "src/core/models/office-management-payment";
import {
  getItemOfficeManagementPayment,
  getLoadingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import RequestPaymentSection from "../sections/request-payment-section";
import Form, { SelectField, TextField } from "src/components/form";
import { useMemo } from "react";
import Logs from "src/components/Logs";
import moment from "moment";
import Panel from "src/components/Panel";
import { Button, Grid, CircularProgress } from "@material-ui/core";
import { useTranslation } from "src/locale/i18n";
import { addOfficeManagementPaymentLawyerReview } from "src/core/store/modules/office-management-payment/thunks";

import { useUsersActives } from "src/hooks/fetchLists";

const LawyerReviewStep = () => {
  const item = useSelector(getItemOfficeManagementPayment);
  const loading = useSelector(getLoadingOfficeManagementPayment);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { usersActivesAsOptionsById } = useUsersActives();

  const initialValues: TOfficeManagementPayment = useMemo(() => {
    const initialValues = {
      id: item?.id,
      filesSolicitation: item ? item.filesSolicitation : [],
      analysisDate: moment().format("DD/MM/YYYY").toString(),
      externalOfficeId: item ? item?.requester?.id.toString() : "",
      aprovalStatus: -1,
      internalLawyerObservation: "",
      internalLawyer: {
        name: item ? item?.internalLawyer?.name : "",
      },
    } as TOfficeManagementPayment;
    return initialValues;
  }, [item]);

  const actionButtons = [
    {
      name: "return",
      label: t("approval.return"),
    },

    {
      name: "reject",
      label: t("approval.reject"),
    },
    {
      name: "approve",
      label: t("approval.approve"),
    },
  ];

  const onSubmit = (values: TOfficeManagementPayment, actions: any) => {
    dispatch(addOfficeManagementPaymentLawyerReview(values));
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
          <Logs
            logs={item?.treatedLogs}
            statuses={OfficeManagementPaymentStatus}
            statusOrder={["flow", "approvalCenter"]}
          />
          <Panel
            title={t("officeManagement:inHouseLawyer")}
            withPadding
            loading={loading}
            slotBottomRight={
              <Grid container justifyContent="flex-end" spacing={2}>
                {actionButtons.map(({ label, name }, index) => (
                  <Grid item key={index}>
                    {
                      isSubmitting === true ? <CircularProgress /> :
                      <Button
                      disabled={isSubmitting}
                      color="primary"
                      variant={"contained"}
                      type="submit"
                      onClick={() => {
                        if (name === "return")
                          setFieldValue("aprovalStatus", 2);
                        else if (name === "reject")
                          setFieldValue("aprovalStatus", 0);
                        else setFieldValue("aprovalStatus", 1);
                      }}
                    >
                      {label}
                    </Button>
                    }
                      
                  </Grid>
                ))}
              </Grid>
            }
            slotBottonRightPermission={true}
          >
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:lawyerReview.analysisDate")}
                  disabled
                  name="analysisDate"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  label={t("officeManagement:inHouseLawyer")}
                  name="internalLawyer.name"
                  required
                  disabled
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <SelectField
                  label={t("officeManagement:lawyerReview.representante")}
                  name="externalOfficeId"
                  required
                  options={usersActivesAsOptionsById}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <TextField
                  required
                  label={t("officeManagement:obs")}
                  name="internalLawyerObservation"
                />
              </Grid>
            </Grid>
          </Panel>
        </form>
      )}
    </Form>
  );
};

export default LawyerReviewStep;
