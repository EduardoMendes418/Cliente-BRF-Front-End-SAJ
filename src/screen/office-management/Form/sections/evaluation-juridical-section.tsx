import { Grid } from "@material-ui/core";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { useTranslation } from "src/locale/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getItemOfficeManagementPayment } from "src/core/store/modules/office-management-payment/selectors";
import {
  useAreasDEJUR,
  useOfficeManagementInvoices,
  useListCostCenter,
  useOfficeManagementControl,
} from "src/hooks/fetchLists";
import { useEffect, useMemo } from "react";
import { getHierarchyList } from "src/core/store/modules/hierarchy/selectors";
import { fetchHierarchy } from "src/core/store/modules/hierarchy/thunks";
import { OfficeManagementTypeEnum } from "../../utils/getOfficeManagementType";

const EvaluationJuridicalSection = () => {
  const { t } = useTranslation();
  const item = useSelector(getItemOfficeManagementPayment);
  const dispatch = useDispatch();

  const { allowedAreasAsOptions: areasDEJUROptions } = useAreasDEJUR();
  const hierarchy = useSelector(getHierarchyList);
  const { natureInvoicesAsOptions } = useOfficeManagementInvoices();
  const { costCenterList } = useListCostCenter();
  const { controlAsOptions } = useOfficeManagementControl();

  useEffect(() => {
    dispatch(fetchHierarchy({}));
  }, [item, dispatch, areasDEJUROptions]);

  const responsibleAsOption = useMemo(
    () =>
      controlAsOptions.find(
        (el) => el.value === item?.legalResponsibleControlId
      ),
    [controlAsOptions, item]
  );

  const areaDEJUROption = useMemo(
    () => areasDEJUROptions.find((el) => el.value === item?.areaDejurId),
    [areasDEJUROptions, item]
  );

  const costCenterOption = useMemo(
    () =>
      costCenterList.find((el) => {
        return el.id === item?.costCenterId;
      }),
    [costCenterList, item]
  );

  const hierarchyOption = useMemo(
    () =>
      hierarchy.find((el) => {
        return el.approver === item?.approverIdSAP;
      }),
    [hierarchy, item]
  );

  const natureInvoicesAsOption = useMemo(
    () =>
      natureInvoicesAsOptions.find((el) => {
        return el.value === item?.natureInvoiceId;
      }),
    [natureInvoicesAsOptions, item]
  );

  if (!(item && item.stage! > OfficeManagementTypeEnum.evaluationJuridical))
    return null;

  return (
    <Panel title={t("officeManagement:lawyerReview.representante")} withPadding>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:cliforSAP")}
            value={item?.cliforSAP ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:areaDejurId")}
            value={areaDEJUROption?.label ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:natureInvoiceId")}
            value={natureInvoicesAsOption?.label ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:contractSAP")}
            value={item?.contractSAP ?? "-"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:centroSAP")}
            value={item?.centroSAP ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:contaRazao")}
            value={item?.contaRazao ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:costCenterId")}
            value={costCenterOption?.costCenter ?? "-"}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:approverIdSAP")}
            value={hierarchyOption?.approverName ?? "-"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FieldColumn
            label={t("officeManagement:legalResponsibleControlId")}
            value={responsibleAsOption?.label ?? "-"}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <FieldColumn
            label={t("officeManagement:obs")}
            value={item?.legalResponsibleObservation ?? "-"}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default EvaluationJuridicalSection;
