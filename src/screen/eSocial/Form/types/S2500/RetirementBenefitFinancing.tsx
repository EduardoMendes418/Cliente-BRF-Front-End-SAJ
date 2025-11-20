import { Grid } from "@material-ui/core";
import {
    SelectField,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";

const RetirementBenefitFinancing = ({index, indexPai}: {index:number, indexPai:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Grupo referente ao detalhamento do grau de exposição do trabalhador aos agentes nocivos que ensejam a cobrança da contribuição adicional para financiamento dos benefícios de aposentadoria" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <SelectField
                        name={`infoContr.${indexPai}.idePeriodo.${index}.grauExp`}
                        label={"Código que representa o grau de exposição a agentes nocivos"}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 2)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
            </Grid>
        </AccordionPanel>
    );
};

export default RetirementBenefitFinancing;
