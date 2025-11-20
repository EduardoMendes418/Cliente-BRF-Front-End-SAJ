import { Grid } from "@material-ui/core";
import {
	SelectField,
	CurrencyField,
	TextField,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";

const InfoCRIRRFIdeAdv = ({
	indexInfoCRIRRF,
	indexTrab
}: {
	indexInfoCRIRRF: number,
	indexTrab: number
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	return (
		<FormArray
			name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.ideAdv`}
			lable="Identificação dos advogados"
			lableChild="advogado"
			initialValues={{
				id: 0,
				tpInsc: 1,
				nrInsc: "01.838.723/0001-27",
				vlrAdv: "",
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<div style={{ width: "100%" }}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.ideAdv.${index}.tpInsc`}
										label={"Tipo de inscrição do advogado / Sociedade de advogados"}
										options={[{label: "CNPJ", value: 1},{label: "CPF", value: 2}]/* list
											.filter(
												({ eSocialTableNumber }) => eSocialTableNumber === 9999
											)
											?.map(({ description, code }) => ({
												label: description,
												value: code,
											})) */}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.ideAdv.${index}.nrInsc`}
										label={
											"Número da inscrição do advogado / Sociedade de advogados"
										}
										maxLength={14}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<CurrencyField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.ideAdv.${index}.vlrAdv`}
										label={
											"Valor da despesa com o advogado"
										}
									/>
								</Grid>
								
							</Grid>
						</div>
					</>
				);
			}}
		/>
	);
};
export default InfoCRIRRFIdeAdv;

