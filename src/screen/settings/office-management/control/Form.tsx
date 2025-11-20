import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Form, { SelectField } from "src/components/form";
import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";

import { useTranslation } from "src/locale/i18n";
import {
  getOfficeManagementControl,
  addOfficeManagementControl,
  editOfficeManagementControl,
} from "src/core/store/modules/office-management-control/thunks";

import {
  getItemOfficeManagementControl,
  getLoadingOfficeManagementControl,
  getStatusOfficeManagementControl as getStatus,
  getErrorMessageOfficeManagementControl as getErrorMessage,
} from "src/core/store/modules/office-management-control/selectors";

import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import { TOfficeManagementControl } from "src/core/models/office-management-control";
import { useUsersActives } from "src/hooks/fetchLists";

const ControlForm = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isNew = id === "novo";

  const loading = useSelector(getLoadingOfficeManagementControl);
  const item = useSelector(getItemOfficeManagementControl);
  const { usersActivesAsOptionsById } = useUsersActives();

	const nameOptions = useMemo(() => usersActivesAsOptionsById.map(x => ({...x, value: x.label})), [usersActivesAsOptionsById]);

  useRegisterDefault({
    action: "officeManagementControl",
    getStatus,
    getErrorMessage,
  });

  useEffect(() => {
    const idNumber = parseInt(id);
    if (!item && !isNaN(idNumber)) {
      dispatch(getOfficeManagementControl(idNumber));
    }
  }, [dispatch, id, item]);

  useEffect(
    () => () => dispatch(actions.officeManagementControl.setItem(undefined)),
    [dispatch]
  );

  const onSubmit = (values: TOfficeManagementControl, actions: any) => {
    if (isNew) {
      try {
        dispatch(addOfficeManagementControl(values));
      } catch (error) {
        dispatch(actions.officeManagementControl.setStatusInitial());
      }
    } else dispatch(editOfficeManagementControl({ ...values, id: Number(id) }));

    actions.setSubmitting(false);
  };

  const initialValues: TOfficeManagementControl = useMemo(() => {
    const initialValues = {
      isActive: true,
      name: "",
    } as TOfficeManagementControl;
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
              title={t("settings:control.controlRegistration")}
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
                  <SelectField
                    label={t("settings:responsibleLegalArea.name")}
                    name="name"
                    options={nameOptions}
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

export default ControlForm;
