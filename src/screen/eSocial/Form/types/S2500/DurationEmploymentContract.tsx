import { Grid } from "@material-ui/core";
import {
    SelectField,
	DateField,
    TextField
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "N", label: "Não" },
];
const DurationEmploymentContract = ({index}:{index:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Duração do Contrato de Trabalho" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.duracaoTpContr`}
                        label={"Tipo de contrato de trabalho"}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 511)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<DateField 
                        name={`infoContr.${index}.duracaoDtTerm`}
                        label={"Data do término do contrato - prazo determinado"} 
                    />
				</Grid>
				<Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.clauAssec`}
                        label={"Indicar se o contrato por prazo determinado contém cláusula assecuratória do direito recíproco de rescisão antes da data de seu término. - Campo"}
						options={yesNoOption}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <TextField
                        name={`infoContr.${index}.objDet`}
                        label={"Indicação do objeto determinante da contratação por prazo determinado (obra, serviço, safra, etc.)"}
                        maxLength={255}
                    />
                </Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default DurationEmploymentContract;
