import { Grid } from "@material-ui/core";
import { DateField, DateFieldYearMonth, FormikContext, NumericField } from "src/components/form";
import FormArray from "src/components/FormArray";
import CalculationBasesNotYetDeclared from "./CalculationBasesNotYetDeclared";
import RetirementBenefitFinancing from "./RetirementBenefitFinancing";
import BasisGeneratingGuide from "./BasisGeneratingGuide";
import CalculationBasesSocialSecurityContributionFGTS from "./CalculationBasesSocialSecurityContributionFGTS";
import { IdePeriodoType } from "src/core/models/eSocial";
import { MainDiv } from "../styled";
import FileUploader from "../../common/FileUploader";
import { useFormikContext } from "formik";
import HourMinuteField from "src/components/form/HourMinuteField";

const IdentificationPeriodCalculationBasesRefer = ({
	index: indexPai,
}: {
	index: number;
}) => {
	const { values, setFieldValue } = useFormikContext<FormikContext>()
	return (
		<FormArray
			slotBottomLeft={<FileUploader
				returnFile={(idePeriodoFile) => {
					const finalIdePeriodo = values.idePeriodo?.length ? [...values.infoContr[indexPai].idePeriodo, ...idePeriodoFile] : [...idePeriodoFile]
					setFieldValue(`infoContr.${indexPai}.idePeriodo`, finalIdePeriodo);
				}}
				s2500
			/>}
			name={`infoContr.${indexPai}.idePeriodo`}
			lable="Identificação do período ao qual se referem as bases de cálculo"
			lableChild="Período das bases de cálculo"
			initialValues={{
				id: 0,
				perRef: null,
				vrBcCpMensal: "",
				vrBcCp13: "",
				grauExp: "",
				vrBcFGTSProcTrab: "",
				vrBcFGTSSefip: "",
				vrBcFGTSDecAnt: "",
				codCateg: "",
				vrBcCPrev: "",
				////////////
				/* infoInterm: null */
				////////////
				/* hrsTrab:"",
				dia: "", */
			}}
			renderChildren={(index: number) => (
				<MainDiv>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<DateFieldYearMonth
								name={`infoContr.${indexPai}.idePeriodo.${index}.perRef`}
								label={
									"Informar o mês/ano (formato AAAA-MM) de referência das informações"
								}
								views={["year", "month"]}
								format="MM/yyyy"
								monthYear={true}
							/>
						</Grid>
					</Grid>
					<CalculationBasesNotYetDeclared index={index} indexPai={indexPai} />
					<RetirementBenefitFinancing index={index} indexPai={indexPai} />
					<BasisGeneratingGuide index={index} indexPai={indexPai} />
					<CalculationBasesSocialSecurityContributionFGTS index={index} indexPai={indexPai} />
					<FormArray
						name={`infoContr.${indexPai}.idePeriodo.${index}.infoInterm`}
						hideCounter={true}
						lable="Informações relativas ao trabalho intermitente"
						lableChild="Dia trabalhado"
						initialValues={{
							dia: "",
							hrsTrab: ""
						}}
						renderChildren={(indexDia: number) => {
							return (
								<>
									<div style={{ width: "100%" }}>
									<Grid container spacing={3}>
										<Grid item md={6} xs={12}>
                    						<NumericField
                        						name={`infoContr.${indexPai}.idePeriodo.${index}.infoInterm.${indexDia}.dia`}
                       						 label={"Dia do mês efetivamente trabalhado pelo empregado com contrato de trabalho intermitente."}
												maxLength={2}	
											/>
                						</Grid>
										<Grid item md={6} xs={12}>
                    						<HourMinuteField
                        						name={`infoContr.${indexPai}.idePeriodo.${index}.infoInterm.${indexDia}.hrsTrab`}
                        						label={"Horas trabalhadas no dia pelo empregado com contrato de trabalho intermitente."}
                    						/> 
                						</Grid>
            						</Grid>
									</div>
					</>
				);
			}}
		/>
				</MainDiv>
			)}
		/>
	);
};

export default IdentificationPeriodCalculationBasesRefer;

