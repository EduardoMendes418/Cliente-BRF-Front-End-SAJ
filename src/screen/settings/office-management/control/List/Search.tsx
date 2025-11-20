import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
  getListFiltersOfficeManagementControl,
  getLoadingOfficeManagementControl,
} from "src/core/store/modules/office-management-control/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TOfficeManagementControlFilter } from "src/core/models/office-management-control";
import { fetchOfficeManagementControl } from "src/core/store/modules/office-management-control/thunks";

const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { page, pageSize } = usePagination();
  const loading = useSelector(getLoadingOfficeManagementControl);
  const savedFilters = useSelector(getListFiltersOfficeManagementControl);

  const onSubmit = (
    { ...values }: TOfficeManagementControlFilter,
    { setSubmitting }: FormikHelpers<TOfficeManagementControlFilter>
  ) => {
    const filter = rejectNoValues({ ...values, page, pageSize });
    dispatch(actions.officeManagementControl.setFilters(filter));
    dispatch(fetchOfficeManagementControl({ ...values, page, pageSize }));
    setSubmitting(false);
  };

  const initialValues: TOfficeManagementControlFilter = {
    name: "",
    ...(savedFilters ?? {}),
  };

  return (
    <Panel title={t("settings:control.searchControl")} withPadding>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting, dirty, submitCount }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField label={t("settings:control.name")} name="name" />
              </Grid>
              <Grid item md={1} xs={2}>
                <Submit
                  type="search"
                  submitting={loading || isSubmitting}
                  disabled={!dirty}
                />
              </Grid>
            </Grid>
            <Clean action="officeManagementControl" />
          </form>
        )}
      </Formik>
    </Panel>
  );
};

export default Search;
