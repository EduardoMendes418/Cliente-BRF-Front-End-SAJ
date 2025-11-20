import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
  getListFiltersOfficeManagementStatus,
  getLoadingOfficeManagementStatus,
} from "src/core/store/modules/office-management-status/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TOfficeManagementStatusFilters } from "src/core/models/office-management-status";
import { fetchOfficeManagementStatus } from "src/core/store/modules/office-management-status/thunks";

const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { page, pageSize } = usePagination();
  const loading = useSelector(getLoadingOfficeManagementStatus);
  const savedFilters = useSelector(getListFiltersOfficeManagementStatus);

  const onSubmit = (
    { ...values }: TOfficeManagementStatusFilters,
    { setSubmitting }: FormikHelpers<TOfficeManagementStatusFilters>
  ) => {
    const filter = rejectNoValues({ ...values, page, pageSize });
    dispatch(actions.officeManagementStatus.setFilters(filter));
    dispatch(fetchOfficeManagementStatus({ ...values, page, pageSize }));
    setSubmitting(false);
  };

  const initialValues: TOfficeManagementStatusFilters = {
    name: "",
    ...(savedFilters ?? {}),
  };

  return (
    <Panel title={t("settings:status.searchStatus")} withPadding>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting, dirty, submitCount }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField label={t("settings:status.status")} name="name" />
              </Grid>
              <Grid item md={1} xs={2}>
                <Submit
                  type="search"
                  submitting={loading || isSubmitting}
                  disabled={!dirty}
                />
              </Grid>
            </Grid>
            <Clean action="officeManagementStatus" />
          </form>
        )}
      </Formik>
    </Panel>
  );
};

export default Search;
