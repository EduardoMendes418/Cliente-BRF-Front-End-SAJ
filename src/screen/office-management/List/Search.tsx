import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { CurrencyField, DateField, SelectField, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { usePagination } from "src/hooks/pagination";
import {
  getListFiltersOfficeManagementPayment,
  getLoadingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import { actions } from "src/core/store";
import { rejectNoValues, valuesToNumber } from "src/core/utils/func";
import { OfficeManagementPaymentReportStatus, TOfficeManagementPaymentFilter } from "src/core/models/office-management-payment";
import { fetchOfficeManagementPayment } from "src/core/store/modules/office-management-payment/thunks";
import { useEffect, useState } from "react";
import { getOfficeManagementType } from "../utils/getOfficeManagementType";
import { useLocation } from "react-router-dom";
import { useGroupedAreas, useGroupedAreasById } from "src/hooks/fetchLists";
import ContactField from "src/components/ContactField";
import { CONTACT_SEARCH, CONTACT_TYPE } from "src/core/utils/constants";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { page, pageSize } = usePagination();
  const { groupedAreasAsOptions } = useGroupedAreas();
  const loading = useSelector(getLoadingOfficeManagementPayment);
  const savedFilters = useSelector(getListFiltersOfficeManagementPayment);
  const { groupedAreasByIdAsOptions } = useGroupedAreasById();
  const locate = useLocation();
  const [stage] = useState(getOfficeManagementType(locate.pathname));

  const statusAsOptions = [
	{
		label: OfficeManagementPaymentReportStatus[0],
		value: 0
	},
	{
		label: OfficeManagementPaymentReportStatus[1],
		value: 1
	},
	{
		label: OfficeManagementPaymentReportStatus[2],
		value: 2
	},
	{
		label: OfficeManagementPaymentReportStatus[-1],
		value: -1
	}

  ]

   const onSubmit = (
    { ...values }: TOfficeManagementPaymentFilter,
    { setSubmitting }: FormikHelpers<TOfficeManagementPaymentFilter>
  ) => {

	 const correctedValue = valuesToNumber<TOfficeManagementPaymentFilter>(
		["InvoiceTotalAmount"],
		values
	);

	 if(correctedValue.InvoiceTotalAmount === 0){
		delete correctedValue.InvoiceTotalAmount
	}   
	
    const filter = rejectNoValues({ ...correctedValue, page, pageSize });
	
    dispatch(actions.officeManagementPayment.setFilters(filter));
    dispatch(
      fetchOfficeManagementPayment({ ...correctedValue, page, pageSize, stage })
    );
    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(actions.officeManagementPayment.setFilters());
  }, [dispatch]);


  const initialValues: TOfficeManagementPaymentFilter = {
    requestDate: null,
    id: "",
	InvoiceIssuanceDateStart: null,
	CompanyId: null,
	PaymentDateStart: null,
	SapCreationDateStart: null,
	InvoiceTotalAmount: "",
	AreaDejurId: [], 
	preInvoiceNumber: "",
	status: "",
	InternalLawyer: null,
    ...(savedFilters ?? {}),
  };

  return (
    <Panel title={t("officeManagement:search")} withPadding>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting, dirty, resetForm }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  label={t("officeManagement:requestPayment.requestNumber")}
                  name="id"
                />
              </Grid>

              <Grid item md={3} xs={12}>
                <DateField
                  name="requestDate"
                  label={t("officeManagement:requestPayment.requestData")}
                />
              </Grid>
			  {
				stage === 1 ? (
					<>
				<Grid item md={3} xs={12}>
                 	<TextField
                  	type="number"
                 	 label={t("officeManagement:note")}
                  	name="preInvoiceNumber"
                	/>
              </Grid>
			  	<Grid item md={3} xs={12}>
			  		<DateField
					name="InvoiceIssuanceDateStart"
					label={t("officeManagement:noteData")}
			  	/>
			  </Grid>
				<Grid item md={3} xs={12}>
					<GroupedSelectFiledMultiple
					label={t("officeManagement:requestPayment.officeSocialReason")}
					name="CompanyId"
					options={groupedAreasByIdAsOptions}
					/>
				</Grid>
		      <Grid item xs={12} md={3}>
					<CurrencyField
					label={t('officeManagement:requestPayment.value')}
					name="InvoiceTotalAmount"
					/>
			  </Grid>
				<Grid item md={3} xs={12}>
					<GroupedSelectFiledMultiple
						label={t("officeManagement:areaDejurId")}
						name="AreaDejurId" 
						options={groupedAreasAsOptions}
						multiple
					/>
			  </Grid>
				<Grid item md={3} xs={12}>
					<ContactField
					name='internalLawyer'
					label={t('officeManagement:inHouseLawyer')}
					contactType={CONTACT_TYPE.PERSON}
					setInvalidValueWhenTyping
					contactSearch={CONTACT_SEARCH.InternalLawyer}
					/>
			  </Grid>
				<Grid item md={3} xs={12}>
					<SelectField
					label={t("officeManagement:status")}
					name="status"
					options={statusAsOptions}
					/>
			  </Grid>
			  	<Grid item md={3} xs={12}>
			  		<DateField
					name="SapCreationDateStart"
					label={t("officeManagement:requestPayment.SAPEntryDate")}
			  	/>
			  </Grid>
				<Grid item md={3} xs={12}>
					<DateField
					name="PaymentDateStart"
					label={t("officeManagement:paymentDate")}
			  	/>
			  </Grid>
				
			</>
				): null
			  }
			  {
				stage === 2 || 3 || 4 || 5 ? <>
				 <Grid item md={3} xs={12}>
					<GroupedSelectFiledMultiple
					label={"Razão social"}
					name="CompanyId"
					options={groupedAreasByIdAsOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
                 	<TextField
                  	type="number"
                 	label={"Número da pré-fatura"}
                  	name="preInvoiceNumber"
                	/>
              </Grid>
			 
				<Grid item md={3} xs={12}>
					<ContactField
					name='InternalLawyer'
					label={t('officeManagement:inHouseLawyer')}
					contactType={CONTACT_TYPE.PERSON}
					setInvalidValueWhenTyping
					contactSearch={CONTACT_SEARCH.InternalLawyer}
					/>
			  </Grid>
				</> : null
			  }
              <Grid item md={1} xs={2}>
                <Submit
                  type="search"
                  submitting={loading || isSubmitting}
                  disabled={!dirty}
                />
              </Grid>
            </Grid>
            <Clean onClick={() => {
				resetForm()
				dispatch(
					fetchOfficeManagementPayment({ page, pageSize, stage })
				  )
				}} action="officeManagementPayment" />
          </form>
        )}
      </Formik>
    </Panel>
  );
};

export default Search;
