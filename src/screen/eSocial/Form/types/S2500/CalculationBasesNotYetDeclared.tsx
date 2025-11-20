import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import AccordionPanel from "src/components/AccordionPanel";
import {
    CurrencyFieldFocus, FormikContext
} from "src/components/form";

const CalculationBasesNotYetDeclared = ({index, indexPai}: {index:number, indexPai:number}) => {
    return (
        <AccordionPanel 
            title="Bases de cálculo de contribuição previdenciária e FGTS decorrentes de processo trabalhista e ainda não declaradas no eSocial."
            startExpanded 
            ativateBorder
        >
            <Grid container spacing={3}>
				<Grid item md={6} xs={12}>
                    <CurrencyFieldFocus
                        name={`infoContr.${indexPai}.idePeriodo.${index}.vrBcCpMensal`}
                        label={"Valor da base de cálculo da contribuição previdenciária sobre a remuneração mensal do trabalhador."}
                    />
                </Grid>
				<Grid item md={6} xs={12}>
                    <CurrencyFieldFocus
                        name={`infoContr.${indexPai}.idePeriodo.${index}.vrBcCp13`}
                        label={"Valor da base de cálculo da contribuição previdenciária sobre a remuneração do trabalhador referente ao 13º salário"}
                    />
                </Grid>
				{/* <Grid item md={6} xs={12}>
                    <CurrencyField
                        name={`infoContr.${indexPai}.idePeriodo.${index}.baseCalculoVrBcFgts`}
                        label={"Valor da base de cálculo do FGTS sobre a remuneração do trabalhador (sem 13° salário)."}
                    />
                </Grid>
				<Grid item md={6} xs={12}>
                    <CurrencyField
                        name={`infoContr.${indexPai}.idePeriodo.${index}.baseCalculoVrBcFgts13`}
                        label={"Valor da base de cálculo do FGTS sobre a remuneração do trabalhador sobre o 13º salário."}
                    />
                </Grid> */}
            </Grid>

        </AccordionPanel>
    );
};

export default CalculationBasesNotYetDeclared;
