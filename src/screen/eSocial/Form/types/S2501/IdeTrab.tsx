import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import FormArray from "src/components/FormArray";
import { TextField, DateField, CurrencyField, MaskField, SelectField } from "src/components/form";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import CalcTrib from "./CalcTrib";
import InfoCRIRRF from "./infoCRIRRF";

const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "", label: "Não" },
];

const IdeTrab = () => {
	const list = useSelector(getListESocialRegistrationTable);

	return (
		<FormArray
			lable="Identificação do trabalhador"
			name="ideTrab"
			lableChild="Trabalhador"
			initialValues={{
				cpfTrab: "",
				dtLaudo: null,
				calcTrib: []
			}}
			renderChildren={(index: number) => (
				<>
					<Grid container spacing={3}>
						<Grid item xs={12} md={3}>
							<MaskField
								label={"Número do CPF do trabalhador."}
								name={`ideTrab.${index}.cpfTrab`}
								mask={"999.999.999-99"}
								maskChar={null}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<DateField
								name={`ideTrab.${index}.dtLaudo`}
								label={"Data da moléstia grave atribuída pelo laudo"}
							/>
						</Grid>
					</Grid>
					<FormArray
						lable="Informações de dependentes não cadastrados pelo S-2200/S-2205/S-2300."
						name="infoDep"
						lableChild="dependente"
						initialValues={{
							cpfDep: "",
							dtNascto: null,
							nome: "",
							depIRRF: "",
							tpDep: "",
							descrDep: ""
						}}
						renderChildren={(indexInfoDep: number) => (
							<>
								<Grid container spacing={3}>
									<Grid item xs={12} md={3}>
										<MaskField 
											label={"Número de inscrição no CPF."}
											name={`ideTrab.${index}.infoDep.${indexInfoDep}.cpfDep`}
											mask={"999.999.999-99"}
											maskChar={null}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateField
											name={`ideTrab.${index}.infoDep.${indexInfoDep}.dtNascto`}
											label={"Data de nascimento"}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											name={`ideTrab.${index}.infoDep.${indexInfoDep}.nome`}
											label={"Nome do dependente."}
											maxLength={70}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<SelectField
											name={`ideTrab.${index}.infoDep.${indexInfoDep}.depIRRF`}
											label={"Somente informar este campo em caso de dependente do trabalhador para fins de dedução de seu rendimento tributável pelo Imposto de Renda."}
											options={yesNoOption}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name={`ideTrab.${index}.infoDep.${indexInfoDep}.tpDep`}
											label={"Tipo de dependente."}
											options={list
												.filter(
													({ eSocialTableNumber }) => eSocialTableNumber === 7
												)
												?.map(({ description, code }) => ({
													label: description,
													value: code,
												}))}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name={`ideTrab.${index}.infoDep.${indexInfoDep}.descrDep`}
											label={"Informar a descrição da dependência."}
											maxLength={100}
										/>
									</Grid>
								</Grid>

							</>
						)}
					/>

					<CalcTrib indexTrab={index}/>
					<InfoCRIRRF indexTrab={index} />
				</>
			)}
		/>
	);
};

export default IdeTrab;

