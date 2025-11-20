import { Grid } from "@material-ui/core";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { useTranslation } from "src/locale/i18n";
import moment from "moment";
import { useSelector } from "react-redux";
import { getItemOfficeManagementPayment } from "src/core/store/modules/office-management-payment/selectors";

import {
  OfficeManagementStageStatus,
  OfficeManagementTypeEnum,
} from "../../utils/getOfficeManagementType";

const RequestPaymentSection = () => {
  const { t } = useTranslation();
  const item = useSelector(getItemOfficeManagementPayment);

  if (!(item && item.stage! > OfficeManagementTypeEnum.requestPayment))
    return null;

  return (
    <Panel
      title={t("officeManagement:requestPayment.requestPayment")}
      withPadding
    >
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:requestPayment.requestData")}
            value={item ? moment(item!.requestDate).format("DD/MM/YYYY") : "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:requestPayment.socialReason")}
            value={item ? item.company?.name : "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:inHouseLawyer")}
            value={item ? item.internalLawyer?.name : "-"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            type="currency"
            label={t("officeManagement:invoiceValue")}
            value={item?.preInvoiceTotalAmount ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:status")}
            value={item ? (OfficeManagementStageStatus as any)[item?.stage!] : "-"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <FieldColumn
            label={t("officeManagement:obs")}
            value={item?.observation ?? "-"}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default RequestPaymentSection;
