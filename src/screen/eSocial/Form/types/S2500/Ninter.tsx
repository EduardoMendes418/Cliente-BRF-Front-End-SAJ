import { Grid } from "@material-ui/core";
import {
    TextField,
    SelectField,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";

const Ninter = () => {
	const list = useSelector(getListESocialRegistrationTable);
    return (
        <AccordionPanel title="Informações do processo judicial ou de demanda submetida à comissão de conciliação prévia (ccp) ou ao número intersindical de conciliação trabalhista (ninter)" startExpanded>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name="origem"
                        label={"Origem do processo / Demanda"}
						options={list.filter(({eSocialTableNumber})=> eSocialTableNumber === 503)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<TextField
                        name="nrProcTrab"
                        label={"Número do processo trabalhista, da ata ou número de identificação da conciliação."}
						maxLength={20}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<TextField
                        name="obsProcTrab"
                        label={"Informações complementares do processo ou da demanda."}
						maxLength={1000}
                    />
                </Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default Ninter;
