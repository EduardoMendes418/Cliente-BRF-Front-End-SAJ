import { Grid } from "@material-ui/core";
import { TextField, DateField, MaskField } from "src/components/form";
import AccordionPanel from "src/components/AccordionPanel";

const IdeProcTrab = () => {
	return (
		<AccordionPanel title="Grupo que identifica o evento objeto da exclusão." startExpanded>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<TextField
						name="nrProcTrab"
						label={"Número do processo trabalhista, da ata ou número de identificação da conciliação"}
						maxLength={20}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<MaskField 
						name="cpfTrab" 
						label={"Número do CPF do trabalhador"}
						mask={"999.999.999-99"}
						maskChar={null}
						maxLength={14}
					/>
				</Grid>
				<Grid item md={6} xs={12}>
					<DateField
						name={`perApurPgto`}
						label={
							"Mês/ano em que é devida a obrigação de pagar a parcela prevista no acordo/sentença"
						}
						views={["year", "month"]}
					/>
				</Grid>
			</Grid>
		</AccordionPanel>
	);
};

export default IdeProcTrab;
