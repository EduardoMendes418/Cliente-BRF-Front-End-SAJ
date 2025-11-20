import { Grid } from "@material-ui/core";
import {
	SelectField,
    CurrencyField,
    CurrencyFieldFocus
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
import { getListESocialWorkerCategory } from "src/core/store/modules/e-social-worker-category/selectors";

const CalculationBasesSocialSecurityContributionFGTS = ({index, indexPai}: {index:number, indexPai:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
	const worker = useSelector(getListESocialWorkerCategory);


    return (
        <AccordionPanel 
            title="Bases de cálculo de contribuição previdenciária já declaradas anteriormente em GFIP ou no evento S-1200 (exclusivamente para remuneração de trabalhador sem cadastro no S-2300), no caso de reconhecimento de mudança de código de categoria." 
            startExpanded
            ativateBorder
        >
            <Grid container spacing={3}>
				<Grid item md={6} xs={12}>
                    <SelectField
                        name={`infoContr.${indexPai}.idePeriodo.${index}.codCateg`}
                        label={"Preencher com o código da categoria do trabalhador declarado no período de referência."}
                        options={worker?.map((item: any) => ({value: item.code, label: item.description}))}

                    />
                </Grid>
				<Grid item md={6} xs={12}>
                    <CurrencyFieldFocus
                        name={`infoContr.${indexPai}.idePeriodo.${index}.vrBcCPrev`}
                        label={"Valor da remuneração do trabalhador a ser considerada para fins previdenciários declarada em GFIP ou em S-1200 de trabalhador sem cadastro no S-2300."}
                    />
                </Grid>
				{/* <Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${indexPai}.idePeriodo.${index}.baseMudCategVrBcFgts`}
                        label={"Valor da base de cálculo do FGTS sobre a remuneração do trabalhador declarada em GFIP ou em S-1200 de trabalhador sem cadastro no S-2300 (sem 13° salário)."}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${indexPai}.idePeriodo.${index}.baseMudCategVrBcFgts13`}
                        label={"Valor da base de cálculo do FGTS sobre a remuneração do trabalhador sobre o 13º salário declarada em GFIP ou em S-1200 de trabalhador sem cadastro no S-2300."}
                    />
                </Grid> */}
            </Grid>

        </AccordionPanel>
    );
};

export default CalculationBasesSocialSecurityContributionFGTS;
