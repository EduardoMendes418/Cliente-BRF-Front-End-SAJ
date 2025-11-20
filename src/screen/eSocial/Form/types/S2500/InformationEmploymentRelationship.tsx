import { Grid } from "@material-ui/core";
import {
    SelectField,
	DateField,
    DateFieldYearMonth,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";

const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "N", label: "Não" },
];

const InformationEmploymentRelationship = ({index}:{index:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Informações sobre o vínculo trabalhista" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.tpRegTrab`}
                        label={"Tipo de regime trabalhista."}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 508)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<DateFieldYearMonth
                        name={`infoContr.${index}.dtAdm`}
                        label={"Data de admissão do trabalhador"} 
                    />
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
                        name={`infoContr.${index}.tpRegPrev`}
						label={
							"Tipo de regime previdenciário"
						}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 509)?.map(({description, code}) => ({label: description, value: code}))}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.tmpParc`}
                        label={"Código relativo ao tipo de contrato em tempo parcial."}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 510)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default InformationEmploymentRelationship;
