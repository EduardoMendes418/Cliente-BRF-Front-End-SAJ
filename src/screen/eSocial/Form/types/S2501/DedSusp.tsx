import { Grid } from "@material-ui/core";
import { TextField, DateField, CurrencyField, MaskField, SelectField } from "src/components/form";
import FormArray from "src/components/FormArray";

const DedSusp = ({ prefix }: { prefix: string }) => {
	return (
		<FormArray
			lable="Detalhamento das deduções com exigibilidade suspensa."
			name="dedSusp"
			lableChild="dedução"
			initialValues={{
				indTpDeducao: "",
				vlrDedSusp: "",
				benefPen: []
			}}
			renderChildren={(index: number) => (
				<>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<SelectField
								name={`${prefix}.dedSusp.${index}.indTpDeducao`}
								label={"Indicativo do tipo de dedução."}
								options={[
									{ label: "Previdência oficial", value: 1 },
									{ label: "Pensão alimentícia", value: 5 },
									{ label: "Dependentes", value: 7 },
								]}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<CurrencyField
								name={`${prefix}.dedSusp.${index}.vlrDedSusp`}
								label={
									"Valor da dedução da base de cálculo do imposto de renda com exigibilidade suspensa."
								}
							/>
						</Grid>
					</Grid>
					<FormArray
						lable="Informação das deduções suspensas por dependentes e beneficiários da pensão alimentícia."
						name="benefPen"
						lableChild="dedução"
						initialValues={{
							cpfDep: "",
							vlrDepenSusp: "",
						}}
						renderChildren={(indexBenefPen: number) => (
							<>
								<Grid container spacing={3}>
									<Grid item xs={12} md={3}>
										<MaskField 
											label={"Número de inscrição no CPF."}
											name={`${prefix}.dedSusp.${index}.benefPen.${indexBenefPen}.cpfDep`}
											mask={"999.999.999-99"}
											maskChar={null}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`${prefix}.dedSusp.${index}.benefPen.${indexBenefPen}.vlrDepenSusp`}
											label={
												"Valor da dedução relativa a dependentes ou a pensão alimentícia com exigibilidade suspensa."
											}
										/>
									</Grid>
								</Grid>

							</>
						)}
					/>

				</>
			)}
		/>
	);
};

export default DedSusp;

