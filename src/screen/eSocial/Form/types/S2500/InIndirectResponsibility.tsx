import { Grid } from "@material-ui/core";
import {
	DateField,
	MaskField,
    SelectField,
	TextField,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
import { useFormikContext } from "formik";

const InIndirectResponsibility = () => {
	const list = useSelector(getListESocialRegistrationTable);
	const { values } = useFormikContext<any>();


    const changeMask = (ideRespTpInsc: string): string | undefined => {
		switch (ideRespTpInsc) {
			case "1":
				return "2";
			case "2":
			case "3":
			case "4":
				return "1";
			default:
				return undefined;
		}
	};

    return (
        <AccordionPanel title="Informações de identificação do contribuinte (responsável direto), caso tenha havido imposição de responsabilidade indireta" startExpanded>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name="ideRespTpInsc"
                        label={"Tipo de inscrição do empregador / contribuinte"}
						options={list.filter(({eSocialTableNumber})=> eSocialTableNumber === 5)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item xs={12} md={3}>
					{/* <ContactField
						label={"Nome do contribuinte"}
						name="ideRespNrInsc"
                        contactType={calculateContactType(values.ideEmpregadorTpInsc)}
					/> */}
					<MaskField
						label={"Nome do contribuinte"}
						name="ideRespNrInsc" 
						mask={changeMask(values.ideRespTpInsc) === "1" ? "999.999.999-99" : "99.999.999/9999-99"}
						maskChar={null}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						label={"Data de admissão contribuinte"}
						name="ideRespDtAdmRespDir"
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						label={"Matrícula contribuinte"}
						name="ideRespMatRespDir"
						maxLength={30}
					/>
				</Grid>
				{/* <Grid item md={3} xs={12}>
					<TextField
                        name="ideRespNrInsc"
                        label={"Número da inscrição do contribuinte"}
						maxLength={14}
                    />
                </Grid> */}
            </Grid>

        </AccordionPanel>
    );
};

export default InIndirectResponsibility
;
