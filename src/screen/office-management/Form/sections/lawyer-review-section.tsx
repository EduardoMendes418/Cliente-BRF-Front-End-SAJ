import { Grid } from "@material-ui/core";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { useTranslation } from "src/locale/i18n";
import moment from "moment";
import { useSelector } from "react-redux";
import { getItemOfficeManagementPayment } from "src/core/store/modules/office-management-payment/selectors";
import { OfficeManagementTypeEnum } from "../../utils/getOfficeManagementType";

const LawyerReviewSection = () => {
  const { t } = useTranslation();
  const item = useSelector(getItemOfficeManagementPayment);

  if (
    !(item && item.stage! > OfficeManagementTypeEnum.lawyerReview) &&
    !item?.internalLawyerObservation?.length &&
    !item
  )
    return null;

  return (
    <Panel title={t("officeManagement:inHouseLawyer")} withPadding>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:lawyerReview.analysisDate")}
            value={item?.analysisDate ? moment(item.analysisDate).format("DD/MM/YYYY") : "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:inHouseLawyer")}
            value={item?.internalLawyer?.name ?? "-"}
          />
        </Grid>
        <Grid item md={5} xs={12}>
          <FieldColumn
            label={t("officeManagement:lawyerReview.representante")}
            value={item?.externalOffice?.name ?? "-"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <FieldColumn
            label={t("officeManagement:obs")}
            value={item?.internalLawyerObservation ?? "-"}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default LawyerReviewSection;
