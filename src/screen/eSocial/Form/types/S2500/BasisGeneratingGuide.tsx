import { Grid } from "@material-ui/core";
import AccordionPanel from "src/components/AccordionPanel";
import {
	SelectField,
    CurrencyField,
    CurrencyFieldFocus
} from "src/components/form";

const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "N", label: "Não" },
];
const BasisGeneratingGuide = ({index, indexPai}: {index:number, indexPai:number}) => {
    return (
        <AccordionPanel title="Informações referentes a bases de cálculo de FGTS (valores históricos, sem atualização), inclusive valores de 13º salário, aviso prévio indenizado e seu reflexo sobre o 13º salário, para geração de guia no FGTS Digital. Os campos deste grupo serão somados para compor a base de cálculo para geração de guia." startExpanded ativateBorder>
            <Grid container spacing={3}>
				<Grid item md={3} xs={12}>
                    <CurrencyFieldFocus
                        name={`infoContr.${indexPai}.idePeriodo.${index}.vrBcFGTSProcTrab`}
                        label={"Valor da base de cálculo de FGTS ainda não declarada em SEFIP."}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <CurrencyFieldFocus
                        name={`infoContr.${indexPai}.idePeriodo.${index}.vrBcFGTSSefip`}
                        label={"Valor da base de cálculo de FGTS declarada apenas em SEFIP (não informada no eSocial) e ainda não recolhida"}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<CurrencyFieldFocus
                        name={`infoContr.${indexPai}.idePeriodo.${index}.vrBcFGTSDecAnt`}
						label={
							"Valor da base de cálculo de FGTS declarada anteriormente no eSocial e ainda não recolhida."
						}
					/>
				</Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default BasisGeneratingGuide;
