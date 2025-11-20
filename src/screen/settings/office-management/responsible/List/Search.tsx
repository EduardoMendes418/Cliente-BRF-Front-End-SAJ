import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
  getListFiltersOfficeManagementResponsible,
  getLoadingOfficeManagementResponsible,
} from "src/core/store/modules/office-management-responsible/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TOfficeManagementResponsibleFilter } from "src/core/models/office-management-responsible";
import { fetchOfficeManagementResponsible } from "src/core/store/modules/office-management-responsible/thunks";

const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { page, pageSize } = usePagination();
  const loading = useSelector(getLoadingOfficeManagementResponsible);
  const savedFilters = useSelector(getListFiltersOfficeManagementResponsible);

  const onSubmit = (
    { ...values }: TOfficeManagementResponsibleFilter,
    { setSubmitting }: FormikHelpers<TOfficeManagementResponsibleFilter>
  ) => {
    const filter = rejectNoValues({ ...values, page, pageSize });
    dispatch(actions.officeManagementResponsible.setFilters(filter));
    dispatch(fetchOfficeManagementResponsible({ ...values, page, pageSize }));
    setSubmitting(false);
  };

  const initialValues: TOfficeManagementResponsibleFilter = {
    name: "",
    ...(savedFilters ?? {}),
  };

  return (
    <Panel
      title={t("settings:responsibleLegalArea.searchResponsibleLegalArea")}
      withPadding
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting, dirty, submitCount }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField
                  label={t("settings:responsibleLegalArea.name")}
                  name="name"
                />
              </Grid>
              <Grid item md={1} xs={2}>
                <Submit
                  type="search"
                  submitting={loading || isSubmitting}
                  disabled={!dirty}
                />
              </Grid>
            </Grid>
            <Clean action="officeManagementResponsible" />
          </form>
        )}
      </Formik>
    </Panel>
  );
};

export default Search;
