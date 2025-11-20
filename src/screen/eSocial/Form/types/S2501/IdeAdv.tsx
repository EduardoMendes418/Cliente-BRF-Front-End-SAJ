import { Grid } from "@material-ui/core";
import {
	SelectField,
	CurrencyField,
	TextField,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";
import { MainDiv } from "../styled";

const IdeAdv = ({
	index: indexPai,
	indexTrab
}: {
	index: number;
	indexTrab: number;
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	return (
		<FormArray
			name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.ideAdv`}
			lable="Identificação dos advogados"
			lableChild="Advogado"
			initialValues={{
				id: 0,
				tpInsc: 1,
				nrInsc: "01.838.723/0001-27",
				vlrAdv: "",
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.ideAdv.${index}.tpInsc`}
										label={"Tipo de inscrição do advogado / Sociedade de advogados"}
										options={[{label: "CNPJ", value: 1},{label: "CPF", value: 2}]}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.ideAdv.${index}.nrInsc`}
										label={
											"Número da inscrição do advogado / Sociedade de advogados"
										}
										maxLength={14}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<CurrencyField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.ideAdv.${index}.vlrAdv`}
										label={
											"Valor da despesa com o advogado"
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
export default IdeAdv;

