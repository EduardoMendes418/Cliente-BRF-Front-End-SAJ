import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Form, { SelectField, TextField } from "src/components/form";
import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";

import { useTranslation } from "src/locale/i18n";
import {
  getOfficeManagementInvoice,
  addOfficeManagementInvoice,
  editOfficeManagementInvoice,
} from "src/core/store/modules/office-management-invoice/thunks";

import {
  getItemOfficeManagementInvoice,
  getLoadingOfficeManagementInvoice,
  getStatusOfficeManagementInvoice as getStatus,
  getErrorMessageOfficeManagementInvoice as getErrorMessage,
} from "src/core/store/modules/office-management-invoice/selectors";

import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import { TOfficeManagementInvoice } from "src/core/models/office-management-invoice";
import { useGroupedAreas } from "src/hooks/fetchLists";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const InvoiceForm = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isNew = id === "novo";

  const loading = useSelector(getLoadingOfficeManagementInvoice);
  const item = useSelector(getItemOfficeManagementInvoice);

  const { groupedAreasAsOptions } = useGroupedAreas();

  useRegisterDefault({
    action: "officeManagementInvoice",
    getStatus,
    getErrorMessage,
  });

  useEffect(() => {
    const idNumber = parseInt(id);
    if (!item && !isNaN(idNumber)) {
      dispatch(getOfficeManagementInvoice(idNumber));
    }
  }, [dispatch, id, item]);

  useEffect(
    () => () => dispatch(actions.officeManagementInvoice.setItem(undefined)),
    [dispatch]
  );

  const onSubmit = (values: TOfficeManagementInvoice, actions: any) => {
    if (isNew) {
      try {
        dispatch(addOfficeManagementInvoice(values));
      } catch (error) {
        dispatch(actions.officeManagementInvoice.setStatusInitial());
      }
    } else dispatch(editOfficeManagementInvoice({ ...values, id: Number(id) }));

    actions.setSubmitting(false);
  };

  const initialValues: TOfficeManagementInvoice = useMemo(() => {
    const initialValues = {
      isActive: true,
      typeRequestSAP: "",
      categoryRequestSAP: "",
      description: "",
      areaId: isNew ? undefined : 0,
    } as TOfficeManagementInvoice;
    return item ? item : initialValues;
  }, [isNew, item]);


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
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Panel
              title={t("settings:invoice.registration")}
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
                    label={t("settings:invoice.nature")}
                    name="description"
										required
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <GroupedSelectFiledMultiple
                    label={t("settings:invoice.areaDejur")}
                    name="areaId"
                    options={groupedAreasAsOptions}
										required
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={t("settings:invoice.requestSap")}
                    name="typeRequestSAP"
										required
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={t("settings:invoice.natureCategory")}
                    name="categoryRequestSAP"
										required
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

export default InvoiceForm;
