import { Grid } from "@material-ui/core";
import {
    SelectField,
	TextField
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";

const IdentificationEstablishmentResponsible = ({index}: {index:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Identificação do estabelecimento responsável pelo pagamento ao trabalhador dos valores informados neste evento" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.ideEstabTpInsc`}
                        label={"Tipo de inscrição do empregador / contribuinte"}
						options={list.filter(({eSocialTableNumber})=> eSocialTableNumber === 5)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <TextField
                        name={`infoContr.${index}.ideEstabNrInsc`}
                        label={"Número da inscrição do estabelecimento do contribuinte"}
						maxLength={255}
                    />
                </Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default IdentificationEstablishmentResponsible;
