import { Grid } from "@material-ui/core";
import {
    SelectField,
	DateField,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";


const TsveTerminationInformation = ({index}: {index: number}) => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Informações de Término do Tsve (Trabalhador sem vínculo empregatício)" startExpanded ativateBorder>
            <Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<DateField 
                        name={`infoContr.${index}.infoTermDtTerm`}
                        label={"Data de término"} 
                    />
				</Grid>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.mtvDesligTSV`}
                        label={"Motivo do término do diretor não empregado, com FGTS"}
						options={list.filter(({eSocialTableNumber})=> eSocialTableNumber === 515)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default TsveTerminationInformation;
