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
  getOfficeManagementDocumentType,
  addOfficeManagementDocumentType,
  editOfficeManagementDocumentType,
} from "src/core/store/modules/office-management-document-type/thunks";

import {
  getItemOfficeManagementDocumentType,
  getLoadingOfficeManagementDocumentType,
  getStatusOfficeManagementDocumentType as getStatus,
  getErrorMessageOfficeManagementDocumentType as getErrorMessage,
} from "src/core/store/modules/office-management-document-type/selectors";

import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import { TOfficeManagementDocumentType } from "src/core/models/office-management-document-type";

const DocumentTypeForm = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isNew = id === "novo";

  const loading = useSelector(getLoadingOfficeManagementDocumentType);
  const item = useSelector(getItemOfficeManagementDocumentType);

  useRegisterDefault({
    action: "officeManagementDocumentType",
    getStatus,
    getErrorMessage,
  });

  useEffect(() => {
    const idNumber = parseInt(id);
    if (!item && !isNaN(idNumber)) {
      dispatch(getOfficeManagementDocumentType(idNumber));
    }
  }, [dispatch, id, item]);

  useEffect(
    () => () =>
      dispatch(actions.officeManagementDocumentType.setItem(undefined)),
    [dispatch]
  );

  const onSubmit = (values: TOfficeManagementDocumentType, actions: any) => {
    if (isNew) {
      try {
        dispatch(addOfficeManagementDocumentType(values));
      } catch (error) {
        dispatch(actions.officeManagementDocumentType.setStatusInitial());
      }
    } else
      dispatch(editOfficeManagementDocumentType({ ...values, id: Number(id) }));

    actions.setSubmitting(false);
  };

  const initialValues: TOfficeManagementDocumentType = useMemo(() => {
    const initialValues = {
      isActive: true,
      name: "",
    } as TOfficeManagementDocumentType;
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
              title={t("settings:documentType.documentTypeRegistration")}
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
                    label={t("settings:documentType.documentType")}
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

export default DocumentTypeForm;
