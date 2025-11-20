import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Form, { TextField } from "src/components/form";
import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";

import { useTranslation } from "src/locale/i18n";
import {
  getOfficeManagementStatus,
  addOfficeManagementStatus,
  editOfficeManagementStatus,
} from "src/core/store/modules/office-management-status/thunks";
import {
  getItemOfficeManagementStatus,
  getLoadingOfficeManagementStatus,
  getStatusOfficeManagementStatus as getStatus,
  getErrorMessageOfficeManagementStatus as getErrorMessage,
} from "src/core/store/modules/office-management-status/selectors";
import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import { TOfficeManagementStatus } from "src/core/models/office-management-status";

const StatusForm = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isNew = id === "novo";

  const loading = useSelector(getLoadingOfficeManagementStatus);
  const item = useSelector(getItemOfficeManagementStatus);

  useRegisterDefault({
    action: "officeManagementStatus",
    getStatus,
    getErrorMessage,
  });

  useEffect(() => {
    const idNumber = parseInt(id);
    if (!item && !isNaN(idNumber)) {
      dispatch(getOfficeManagementStatus(idNumber));
    }
  }, [dispatch, id, item]);

  useEffect(
    () => () => dispatch(actions.officeManagementStatus.setItem(undefined)),
    [dispatch]
  );

  const onSubmit = (values: TOfficeManagementStatus, actions: any) => {
    if (isNew) {
      try {
        dispatch(addOfficeManagementStatus(values));
      } catch (error) {
        dispatch(actions.officeManagementStatus.setStatusInitial());
      }
    } else dispatch(editOfficeManagementStatus({ ...values, id: Number(id) }));

    actions.setSubmitting(false);
  };

  const initialValues: TOfficeManagementStatus = useMemo(() => {
    const initialValues = {
      isActive: true,
      name: "",
    } as TOfficeManagementStatus;
    return item ? item : initialValues;
  }, [item]);

  return (
    <ScreenTemplate>
      <Form
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({
          handleSubmit,
          isSubmitting,
          dirty,
          setSubmitting,
          setFieldValue,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Panel
              title={t("settings:status.statusRegistration")}
              slotBottomRight={
                <Submit
                  isNew={isNew}
                  submitting={isSubmitting || loading}
                  disabled={!dirty}
                />
              }
              slotBottonRightPermission={isNew ? "add" : "edit"}
              withPadding
            >
              <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={t("settings:status.statusName")}
                    name="name"
                  />
                </Grid>
              </Grid>
            </Panel>
          </form>
        )}
      </Form>
    </ScreenTemplate>
  );
};

export default StatusForm;
