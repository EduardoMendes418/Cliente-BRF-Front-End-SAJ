import { Grid } from "@material-ui/core";
import AccordionPanel from "src/components/AccordionPanel";
import { TextField, CurrencyField, SelectField, CPFOrCNPJField } from "src/components/form";
import FormArray from "src/components/FormArray";
import { MainDiv } from "../styled";

const InfoComplIRRF = ({
	index: indexPai,
	indexTrab
}: {
	index: number;
	indexTrab: number;
}) => {
	return (
		<MainDiv>
			<AccordionPanel title="Informações complementares de imposto de renda retido na fonte" startExpanded ativateBorder>
				<Grid container spacing={3}>

					<Grid item md={3} xs={12}>
						<CurrencyField
							name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.vlrDedPensao`}
							label={"Valor do somatório das deduções referentes à pensão alimentícia"}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<CurrencyField
							name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.vlrDedDepen`}
							label={"Valor do somatório das deduções por dependentes"}
						/>
					</Grid>
				</Grid>

				<FormArray
					lable="Dedução do rendimento tributável relativa a dependentes"
					name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.dedDepen`}
					lableChild="Dependente"
					initialValues={{ cpfDepen: '', vlrDeducao: '', id: 0 }}
					renderChildren={(index: number) => (
						<>
							<Grid item md={3} xs={12}>
								<SelectField
									name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.dedDepen.${index}.tpRend`}
									label={"Tipo de rendimento."}
									options={[{ label: "Remuneração mensal", value: 11 }, { label: "13º salário", value: 13 },]}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<CPFOrCNPJField
									name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.dedDepen.${index}.cpfDepen`}
									label={"Número do CPF do dependente"}
									type="cpf"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<CurrencyField
									name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.dedDepen.${index}.vlrDeducao`}
									label={"Valor da dedução referente ao dependente acima identificado"}
								/>
							</Grid>
						</>
					)}
				/>
			</AccordionPanel>
		</MainDiv>
	);
};

export default InfoComplIRRF;
