import { Grid } from "@material-ui/core";
import {
    TextField,
    DateField,
    NumericField,
    SelectField,
    CurrencyField,
    DateFieldYearMonth,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
import { getListESocialReasonsForDismissal } from "src/core/store/modules/e-social-reasons-for-dismissal/selectors";

const TerminationInformation = ({ index }: { index: number }) => {
    const list = useSelector(getListESocialRegistrationTable);
	const dismissal = useSelector(getListESocialReasonsForDismissal);
    return (
        <AccordionPanel title="Informações de Desligamento" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <DateFieldYearMonth
                        name={`infoContr.${index}.dtDeslig`}
                        label={"Data de desligamento do vínculo (último dia trabalhado)."}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.mtvDeslig`}
                        label={
                            "Motivo do desligamento"
                        }
                        options={dismissal?.map((item: any) => ({value: item.code, label: item.description}))}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <DateFieldYearMonth
                        name={`infoContr.${index}.dtProjFimAPI`}
                        label={"Data projetada para o término do aviso prévio indenizado."}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.pensAlim`}
                        label={
                            "Indicativo de pensão alimentícia para fins de retenção de FGTS"
                        }
                        options={list
                            .filter(
                                ({ eSocialTableNumber }) => eSocialTableNumber === 516
                            )
                            ?.map(({ description, code }) => ({
                                label: description,
                                value: code,
                            }))}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <NumericField
                        name={`infoContr.${index}.percAliment`}
                        label={
                            "Valor percentual a ser destinado a pensão alimentícia."
                        }
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${index}.vrAlim`}
                        label={
                            "Valor da pensão alimentícia"
                        }
                    />
                </Grid>
            </Grid>
        </AccordionPanel>
    );
};

export default TerminationInformation;
