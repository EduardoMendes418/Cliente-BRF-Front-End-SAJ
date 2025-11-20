import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import FieldColumn from "src/components/FieldColumn";

import { getPensionRequestByID } from "src/core/store/modules/pensions/request-pensions/selectors";

const FavoredData = ({ id }: { id: number }) => {
  const { t } = useTranslation();
  const item = useSelector(getPensionRequestByID(Number(id)));

  return (
    <Panel title={t("solicitacaoPagamento:dadosFavorecido.title")} withPadding>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <FieldColumn label={"CPF"} value={item?.cpf} />
        </Grid>
        <Grid item md={4} xs={12}>
          <FieldColumn label={"Nome"} value={item?.fullName} />
        </Grid>
        <Grid item md={4} xs={12}>
          <FieldColumn
            label={"Data de nascimento"}
            type={"date"}
            value={item?.bornDate}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default FavoredData;
