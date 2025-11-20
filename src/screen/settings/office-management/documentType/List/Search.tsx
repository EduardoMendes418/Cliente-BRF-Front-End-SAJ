import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
  getListFiltersOfficeManagementDocumentType,
  getLoadingOfficeManagementDocumentType,
} from "src/core/store/modules/office-management-document-type/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TOfficeManagementDocumentTypeFilter } from "src/core/models/office-management-document-type";
import { fetchOfficeManagementDocumentType } from "src/core/store/modules/office-management-document-type/thunks";

const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { page, pageSize } = usePagination();
  const loading = useSelector(getLoadingOfficeManagementDocumentType);
  const savedFilters = useSelector(getListFiltersOfficeManagementDocumentType);

  const onSubmit = (
    { ...values }: TOfficeManagementDocumentTypeFilter,
    { setSubmitting }: FormikHelpers<TOfficeManagementDocumentTypeFilter>
  ) => {
    const filter = rejectNoValues({ ...values, page, pageSize });
    dispatch(actions.officeManagementDocumentType.setFilters(filter));
    dispatch(fetchOfficeManagementDocumentType({ ...values, page, pageSize }));
    setSubmitting(false);
  };

  const initialValues: TOfficeManagementDocumentTypeFilter = {
    name: "",
    ...(savedFilters ?? {}),
  };

  return (
    <Panel
      title={t("settings:documentType.documentTypeRegistration")}
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
                  label={t("settings:documentType.documentType")}
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
            <Clean action="officeManagementDocumentType" />
          </form>
        )}
      </Formik>
    </Panel>
  );
};

export default Search;
