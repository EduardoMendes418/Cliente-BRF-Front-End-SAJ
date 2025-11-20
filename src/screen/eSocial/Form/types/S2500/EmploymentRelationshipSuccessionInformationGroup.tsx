import { Grid } from "@material-ui/core";
import {
    SelectField,
	DateField,
	TextField
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";

const EmploymentRelationshipSuccessionInformationGroup = ({index}:{index:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Grupo de informações da sucessão de vínculo trabalhista / estatutário" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.sucessaoVincTpInsc`}
                        label={"Código correspondente ao tipo de inscrição"}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 5)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <TextField
                        name={`infoContr.${index}.sucessaoVincNrInsc`}
                        label={"Informar o número de inscrição do empregador anterior, de acordo com o tipo de inscrição indicado no campo sucessaoVinc/tpInsc."}
						maxLength={6}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <TextField
                        name={`infoContr.${index}.matricAnt`}
                        label={"Matrícula do trabalhador no empregador anterior."}
						maxLength={30}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<DateField 
                        name={`infoContr.${index}.dtTransf`}
                        label={"Preencher com a data da transferência do empregado para o empregador declarante."}
                    />
				</Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default EmploymentRelationshipSuccessionInformationGroup;
