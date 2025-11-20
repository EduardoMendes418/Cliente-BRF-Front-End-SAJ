import { Grid } from "@material-ui/core";
import {
	SelectField,
	CurrencyField,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";
import { MainDiv } from "../styled";

const InfoCRContrib = ({
	index: indexPai,
	indexTrab
}: {
	index: number;
	indexTrab: number;
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	return (
		<FormArray
			name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.infoCRContrib`}
			lable="Código de Receita - CR relativo a Imposto de Renda Retido na Fonte"
			lableChild="Informação de contribuição"
			initialValues={{
				id: 0,
				tpCr: "",
				vrCr: "",
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<CurrencyField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.infoCRContrib.${index}.vrCr`}
										label={
											"Valor correspondente ao Código de Receita - CR"
										}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.infoCRContrib.${index}.tpCr`}
										label={"CR relativo a contribuições sociais devidas à Previdência Social e a Outras Entidades e Fundos (Terceiros), conforme legislação em vigor na competência"}
										options={list
											.filter(
												({ eSocialTableNumber }) => eSocialTableNumber === 29  
											)
											?.map(({ description, code }) => ({
												label: description,
												value: code,
											}))}
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

export default InfoCRContrib;

