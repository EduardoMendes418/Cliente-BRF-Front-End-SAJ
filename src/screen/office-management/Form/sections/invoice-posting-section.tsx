import { Grid } from "@material-ui/core";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { useTranslation } from "src/locale/i18n";
import moment from "moment";
import { useSelector } from "react-redux";
import { getItemOfficeManagementPayment } from "src/core/store/modules/office-management-payment/selectors";
import {
  useOfficeManagementDocuments,
} from "src/hooks/fetchLists";
import { OfficeManagementTypeEnum } from "../../utils/getOfficeManagementType";

const InvoicePostingSection = () => {
  const { t } = useTranslation();
  const item = useSelector(getItemOfficeManagementPayment);
  const { documentsAsOptions } = useOfficeManagementDocuments();

  const document = documentsAsOptions.find(
    (el) => el.value === item?.documentTypeId
  );

  if (!(item && item.stage! > OfficeManagementTypeEnum.invoicePosting))
    return null;

  return (
    <Panel title={t("officeManagement:lawyerReview.representante")} withPadding>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:registerDate")}
            value={item ? moment(item!.registerDate).format("DD/MM/YYYY") : "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:requestPayment.socialReason")}
            value={item?.company?.name ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:note")}
            value={item?.invoiceNumber ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:noteData")}
            value={
              item
                ? moment(item!.invoiceIssuanceDate).format("DD/MM/YYYY")
                : "-"
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            type="currency"
            label={t("officeManagement:noteValue")}
            value={item?.invoiceTotalAmount ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:documentType")}
            value={document?.label ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:legalRepresentative")}
						value={item?.legalResponsibleControl?.name ?? '-'}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <FieldColumn
            label={t("officeManagement:obs")}
            value={item?.externalOfficeObservation ?? "-"}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default InvoicePostingSection;
