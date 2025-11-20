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
  getOfficeManagementResponsible,
  addOfficeManagementResponsible,
  editOfficeManagementResponsible,
} from "src/core/store/modules/office-management-responsible/thunks";

import {
  getItemOfficeManagementResponsible,
  getLoadingOfficeManagementResponsible,
  getStatusOfficeManagementResponsible as getStatus,
  getErrorMessageOfficeManagementResponsible as getErrorMessage,
} from "src/core/store/modules/office-management-responsible/selectors";

import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import { TOfficeManagementResponsible } from "src/core/models/office-management-responsible";
import { useGroupedAreas, useUsersActives } from "src/hooks/fetchLists";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const ResponsibleForm = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { usersActivesAsOptionsById } = useUsersActives();

  const isNew = id === "novo";

  const loading = useSelector(getLoadingOfficeManagementResponsible);
  const item = useSelector(getItemOfficeManagementResponsible);

	const nameSelectOptions = useMemo(() => usersActivesAsOptionsById.map(x => ({...x, value: x.label})), [usersActivesAsOptionsById])


  const { groupedAreasAsOptions } = useGroupedAreas();

  useRegisterDefault({
    action: "officeManagementResponsible",
    getStatus,
    getErrorMessage,
  });

  useEffect(() => {
    const idNumber = parseInt(id);
    if (!item && !isNaN(idNumber)) {
      dispatch(getOfficeManagementResponsible(idNumber));
    }
  }, [dispatch, id, item]);

  useEffect(
    () => () =>
      dispatch(actions.officeManagementResponsible.setItem(undefined)),
    [dispatch]
  );

  const onSubmit = (values: TOfficeManagementResponsible, actions: any) => {
    if (isNew) {
      try {
        dispatch(addOfficeManagementResponsible(values));
      } catch (error) {
        dispatch(actions.officeManagementResponsible.setStatusInitial());
      }
    } else
      dispatch(editOfficeManagementResponsible({ ...values, id: Number(id) }));

    actions.setSubmitting(false);
  };

  const initialValues: TOfficeManagementResponsible = useMemo(() => {
    const initialValues = {
      isActive: true,
      name: "",
      areaId: 0,
    } as TOfficeManagementResponsible;
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
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Panel
              title={t(
                "settings:responsibleLegalArea.responsibleLegalAreaRegistration"
              )}
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
                    options={nameSelectOptions}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <GroupedSelectFiledMultiple
                    label={t("settings:responsibleLegalArea.areaDejur")}
                    name="areaId"
                    options={groupedAreasAsOptions}
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

export default ResponsibleForm;
