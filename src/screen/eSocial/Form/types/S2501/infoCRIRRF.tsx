import { Grid } from "@material-ui/core";
import {
	SelectField,
	CurrencyField,
	TextField,
	CPFOrCNPJField,
	NumericField
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";
import AccordionPanel from "src/components/AccordionPanel";
import InfoCRIRRFIdeAdv from "./InfoCRIRRFIdeAdv";
import InfoProcRet from "./InfoProcRet";
import { MainDiv } from "../styled";
import FormArrayInfoCrirrf from "src/components/FormArrayInfoCrirrf";

const InfoCRIRRF = ({
	indexTrab
}: {
	indexTrab: number;
}) => {

	const list = useSelector(getListESocialRegistrationTable);

	return (
		<FormArrayInfoCrirrf
			name={`ideTrab.${indexTrab}.infoCRIRRF`}
			lable="Informações de Imposto de Renda, por Código de Receita - CR"
			lableChild="Informação de contribuição da Receita"
			initialValues={{
				id: 0,
				tpCr: "",
				vrCr: "",
				vrCR13: "",
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<CurrencyField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrCr`}
										label={
											"Valor relativo ao Imposto sobre a renda retido na fonte para o código de receita - rendimento mensal"}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<CurrencyField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrCR13`}
										label={"Valor relativo ao Imposto sobre a renda retido na fonte para o código de receita - 13º Salário"}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.tpCr`}
										label={"CR relativo a contribuições sociais devidas à Previdência Social e a Outras Entidades e Fundos (Terceiros), conforme legislação em vigor na competência"}
										options={list
											.filter(
												({ eSocialTableNumber }) => eSocialTableNumber === 517
											)
											?.map(({ description, code }) => ({
												label: description,
												value: code,
											}))}
									/>
								</Grid>
							</Grid>
							<AccordionPanel title="Informações complementares relacionadas a rendimentos tributáveis e a deduções e/ou isenções de acordo com a legislação aplicada ao imposto de renda." startExpanded>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendTrib`}
											label={"Valor do rendimento tributável mensal do Imposto de Renda."}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendTrib13`}
											label={"Valor do rendimento tributável do Imposto de Renda referente ao 13º salário - Tributação exclusiva."}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendMoleGrave`}
											label={"Valor do rendimento isento por ser portador de moléstia grave atestada por laudo médico."}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendMoleGrave13`}
												label={"Valor do rendimento isento por ser portador de moléstia grave atestada por laudo médico - 13º salário."}
											/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendIsenNTrib`}
											label={"Valor de outros rendimentos isentos ou não tributáveis"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrJurosMora`}
											label={"Juros de mora recebidos, devidos pelo atraso no pagamento de remuneração por exercício de emprego, cargo ou função."}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrJurosMora13`}
												label={"Juros de mora recebidos, devidos pelo atraso no pagamento de remuneração por exercício de emprego, cargo ou função - 13º salário"}
											/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendIsen65`}
											label={"Valor de parcela isenta de aposentadoria para beneficiário de 65 anos ou mais."}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrRendIsen65Dec`}
												label={"Valor de parcela isenta de aposentadoria para beneficiário de 65 anos ou mais - 13º salário"}
											/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.descIsenNTrib`}
											label={" Descrição do rendimento isento ou não tributável"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrPrevOficial`}
											label={"Valor referente à previdência oficial"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vrPrevOficial13`}
												label={"Valor referente à previdência oficial - 13º salário"}
											/>
									</Grid>
								</Grid>
								<AccordionPanel title="Rendimentos isentos exclusivos do CR 0561" startExpanded>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
											<CurrencyField
													name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.rendIsen0561.${index}.vlrDiarias`}
													label={"Valor relativo a diárias"}
												/>
									</Grid>
									<Grid item md={3} xs={12}>
											<CurrencyField
													name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.rendIsen0561.${index}.vlrAjudaCusto`}
													label={"Valor relativo a ajuda de custo"}
												/>
									</Grid>
									<Grid item md={3} xs={12}>
											<CurrencyField
													name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.rendIsen0561.${index}.vlrIndResContrato`}
													label={"Valor relativo a indenização e rescisão de contrato, inclusive a título de PDV e acidentes de trabalho"}
												/>
									</Grid>
									<Grid item md={3} xs={12}>
											<CurrencyField
													name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.rendIsen0561.${index}.vlrAbonoPec`}
													label={"Valor relativo ao abono pecuniário"}
												/>
									</Grid>
									<Grid item md={3} xs={12}>
											<CurrencyField
													name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.rendIsen0561.${index}.vlrAuxMoradia`}
													label={"Valor relativo ao auxílio moradia"}
												/>
									</Grid>
									</Grid>
								</AccordionPanel>
							</AccordionPanel>
							<AccordionPanel title="Informações complementares relativas a Rendimentos Recebidos Acumuladamente - RRA." startExpanded ativateBorder>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.descRRA`}
											label={"Descrição dos Rendimentos Recebidos Acumuladamente - RRA"}
											maxLength={50}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.qtdMesesRRA`}
											label={"Número de meses relativo aos Rendimentos Recebidos Acumuladamente - RRA"}
											maxLength={4}
										/>
									</Grid>

								</Grid>
							</AccordionPanel>
							<AccordionPanel title="Detalhamento das despesas com processo judicial" startExpanded ativateBorder>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vlrDespCustas`}
											label={"Preencher com o valor das despesas com custas judiciais"}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<CurrencyField
											name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.vlrDespAdvogados`}
											label={"Preencher com o valor total das despesas com advogado(s)"}
										/>
									</Grid>
								</Grid>
							</AccordionPanel>
							<InfoCRIRRFIdeAdv indexInfoCRIRRF={index} indexTrab={indexTrab} />
							<FormArray
								lable="Dedução do rendimento tributável relativa a dependentes"
								name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.dedDepen`}
								lableChild="Dependente"
								initialValues={{ cpfDepen: '', vlrDecucao: '', id: 0, tpRend: "" }}
								renderChildren={(indexDependente: number) => (
									<>
										<Grid item md={3} xs={12}>
											<SelectField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.dedDepen.${indexDependente}.tpRend`}
												label={"Tipo de rendimento."}
												options={[{ label: "Remuneração mensal", value: 11 }, { label: "13º salário", value: 13 },]}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<CPFOrCNPJField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.dedDepen.${indexDependente}.cpfDepen`}
												label={"Número do CPF do dependente"}
												type="cpf"
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<CurrencyField
												name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.dedDepen.${indexDependente}.vlrDecucao`}
												label={"Valor da dedução referente ao dependente acima identificado"}
											/>
										</Grid>
									</>
								)}
							/> 
							<FormArray
								name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.penAlim`}
								lable="Informação dos beneficiários da pensão alimentícia."
								lableChild="Pensão alimentícia"
								initialValues={{
									id: 0,
									cpfDep: "",
									vlrPensao: "",
									tpRend: ""
								}}
								renderChildren={(indexPenAlim: number) => {
									return (
										<>
											<div style={{ width: "100%" }}>
												<Grid container spacing={3}>
													<Grid item md={3} xs={12}>
														<SelectField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.penAlim.${indexPenAlim}.cpfDepen`}
															label={"Tipo de rendimento."}
															options={[{ label: "Remuneração mensal", value: 11 }, { label: "13º salário", value: 13 },]}
														/>
													</Grid>
													<Grid item md={3} xs={12}>
														<TextField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.penAlim.${indexPenAlim}.cpfDep`}
															label={
																"Número do CPF do dependente/beneficiário da pensão alimentícia"
															}
														/>
													</Grid>
													<Grid item md={3} xs={12}>
														<CurrencyField
															name={`ideTrab.${indexTrab}.infoCRIRRF.${index}.penAlim.${indexPenAlim}.vlrPensao`}
															label={
																"Valor relativo à dedução do rendimento tributável correspondente a pagamento de pensão alimentícia."
															}
														/>
													</Grid>

												</Grid>
											</div>
										</>
									);
								}}
							/> 
							<InfoProcRet indexInfoCRIRRF={index} indexTrab={indexTrab} />

						</MainDiv>
					</>
				);
			}}
		/>
	);
};
export default InfoCRIRRF;

