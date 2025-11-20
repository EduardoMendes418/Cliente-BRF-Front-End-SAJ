import { Grid } from "@material-ui/core";
import {
	SelectField,
	CurrencyField,
	TextField,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";
import DedSusp from "./DedSusp";

const InfoProcRet = ({
	indexInfoCRIRRF,
	indexTrab
}: {
	indexInfoCRIRRF: number,
	indexTrab: number
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	return (
		<FormArray
			name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet`}
			lable="Informações de valores relacionados a não retenção de tributos ou a depósitos judiciais."
			lableChild="Valor relacionado"
			initialValues={{
				id: 0,
				tpProcRet: "",
				nrProcRet: "",
				codSusp: "",
				infoValores: [],
				dedSusp: []
			}}
			renderChildren={(indexInfoProcRet: number) => {
				return (
					<>
						<div style={{ width: "100%" }}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.tpProcRet`}
										label={"Preencher com o código correspondente ao tipo de processo."}
										options={[
											{
												value: 1,
												label: "Administrativo"
											},
											{
												value: 2,
												label: "Judicial"
											},
										]}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.nrProcRet`}
										label={
											"Informar o número do processo administrativo/judicial."
										}
										maxLength={21}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.codSusp`}
										label={
											"ICódigo do indicativo da suspensão, atribuído pelo empregador em S-1070."
										}
										maxLength={14}
									/>
								</Grid>
							</Grid>
							<FormArray
								name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores`}
								lable="Informações de valores relacionados a não retenção de tributos ou a depósitos judiciais"
								lableChild="Informações de valor"
								initialValues={{
									indApuracao: "",
									vlrNRetido: "",
									vlrDepJud: "",
									vlrCmpAnoCal: "",
									vlrCmpAnoAnt: "",
									vlrRendSusp: "",
								}}
								renderChildren={(indexInfoValores: number) => {
									return (
										<>
											<div style={{ width: "100%" }}>
												<Grid container spacing={3}>
													<Grid item md={3} xs={12}>
														<SelectField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}.indApuracao`}
															label={"Indicativo de período de apuração"}
															options={[{ label: "Mensal", value: 1 }, { label: "Anual (13° salário)", value: 2 },]}
														/>
													</Grid>										
													<Grid item md={3} xs={12}>
														<CurrencyField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}.vlrNRetido`}
															label={
																"Valor da retenção que deixou de ser efetuada em função de processo administrativo ou judicial."
															}
														/>
													</Grid>
													<Grid item md={3} xs={12}>
														<CurrencyField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}.vlrDepJud`}
															label={
																"Valor do depósito judicial em função de processo administrativo ou judicial"
															}
														/>
													</Grid>
													<Grid item md={3} xs={12}>
														<CurrencyField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}.vlrCmpAnoCal`}
															label={
																"Valor da compensação relativa ao ano calendário em função de processo judicial."
															}
														/>
													</Grid>
													<Grid item md={3} xs={12}>
														<CurrencyField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}.vlrCmpAnoAnt`}
															label={
																"Valor da compensação relativa a anos anteriores em função de processo judicial."
															}
														/>
													</Grid>
													<Grid item md={3} xs={12}>
														<CurrencyField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}.vlrRendSusp`}
															label={
																"Valor do rendimento com exigibilidade suspensa"
															}
														/>
													</Grid>
												</Grid>
												<DedSusp prefix={`ideTrab.${indexTrab}.infoCRIRRF.${indexInfoCRIRRF}.infoProcRet.${indexInfoProcRet}.infoValores.${indexInfoValores}`} />
											</div>
										</>
									);
								}}
							/>
						</div>
					</>
				);
			}}
		/>
	);
};
export default InfoProcRet;

