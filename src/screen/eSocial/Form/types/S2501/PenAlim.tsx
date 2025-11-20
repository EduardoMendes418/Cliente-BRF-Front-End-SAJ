import { Grid } from "@material-ui/core";
import {
	CurrencyField,
	SelectField,
	TextField
} from "src/components/form";
import FormArray from "src/components/FormArray";
import { MainDiv } from "../styled";

const PenAlim = ({
	index: indexPai,
	indexTrab
}: {
	index: number;
	indexTrab: number;
}) => {
	return (
		<FormArray
			name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.penAlim`}
			lable="Informação dos beneficiários da pensão alimentícia."
			lableChild="Pensão alimentícia"
			initialValues={{
				id: 0,
				cpfDep: "",
				vlrPensao: "",
				tpRend: ""
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.penAlim.${index}.tpRend`}
										label={"Tipo de rendimento."}
										options={[{ label: "Remuneração mensal", value: 11 }, { label: "13º salário", value: 13 },]}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.penAlim.${index}.cpfDep`}
										label={
											"Número do CPF do dependente/beneficiário da pensão alimentícia"
										}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<CurrencyField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.penAlim.${index}.vlrPensao`}
										label={
											"Valor relativo à dedução do rendimento tributável correspondente a pagamento de pensão alimentícia."
										}
									/>
								</Grid>
								
							</Grid>
						</MainDiv>
					</>
				);
			}}
		/>
	);
};

export default PenAlim;

