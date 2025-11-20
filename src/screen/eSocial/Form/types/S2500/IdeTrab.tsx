import { Grid } from "@material-ui/core";
import AccordionPanel from "src/components/AccordionPanel";
import { TextField, DateField, MaskField } from "src/components/form";
// import FormArray from "src/components/FormArray";

const IdeTrab = () => {
	return (
		<AccordionPanel title="Informação do trabalhador" startExpanded>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<MaskField 
						name="cpfTrab" 
						label={"Número do CPF do trabalhador"}
						mask={"999.999.999-99"}
						maskChar={null}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField name="nmTrab" label={"Nome do trabalhador"} />
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField name="dtNascto" label={"Data de nascimento"} />
				</Grid>
			</Grid>

			{/* <FormArray
				lable="Dependentes"
				name="dependente"
				lableChild="Dependente"
				initialValues={{cpfDep: '', nmDep: '', tpDep: '', descDep: '', id: 0, eventLaunchId: 0}}
				renderChildren={(index: number) => (
					<>
						<Grid item md={3} xs={12}>
							<TextField
								name={`dependente.${index}.cpfDep`}
								label={"Número do CPF do dependente"}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								name={`dependente.${index}.nmDep`}
								label={"Nome do dependente"}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								name={`dependente.${index}.tpDep`}
								label={"Tipo de dependente"}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								name={`dependente.${index}.descDep`}
								label={"Informação da descrição da dependência"}
							/>
						</Grid>
					</>
				)}
			/> */}
		</AccordionPanel>
	);
};

export default IdeTrab;
