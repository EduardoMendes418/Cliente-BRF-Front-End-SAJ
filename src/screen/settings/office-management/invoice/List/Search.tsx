import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { SelectField, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
  getListFiltersOfficeManagementInvoice,
  getLoadingOfficeManagementInvoice,
} from "src/core/store/modules/office-management-invoice/selectors";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { TOfficeManagementInvoiceFilter } from "src/core/models/office-management-invoice";
import { fetchOfficeManagementInvoice } from "src/core/store/modules/office-management-invoice/thunks";
import { useGroupedAreas } from "src/hooks/fetchLists";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { page, pageSize } = usePagination();
  const loading = useSelector(getLoadingOfficeManagementInvoice);
  const savedFilters = useSelector(getListFiltersOfficeManagementInvoice);
  const { groupedAreasAsOptions } = useGroupedAreas();

  const onSubmit = (
    { ...values }: TOfficeManagementInvoiceFilter,
    { setSubmitting }: FormikHelpers<TOfficeManagementInvoiceFilter>
  ) => {
    const filter = rejectNoValues({ ...values, page, pageSize });
    dispatch(actions.officeManagementInvoice.setFilters(filter));
    dispatch(fetchOfficeManagementInvoice({ ...values, page, pageSize }));
    setSubmitting(false);
  };

  const initialValues: TOfficeManagementInvoiceFilter = {
    description: "",
    areaId: 0,
    ...(savedFilters ?? {}),
  };

  return (
    <Panel title={t("settings:invoice.search")} withPadding>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting, dirty }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField
                  label={t("settings:invoice.nature")}
                  name="description"
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <GroupedSelectFiledMultiple
                  label={t("settings:invoice.areaDejur")}
                  name="areaId"
                  options={groupedAreasAsOptions}
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
            <Clean action="officeManagementInvoice" />
          </form>
        )}
      </Formik>
    </Panel>
  );
};

export default Search;
