import { Grid } from "@material-ui/core";
import { TextField, DateField, CurrencyField, DateFieldYearMonth, FormikContext } from "src/components/form";
import FormArray from "src/components/FormArray";
import InfoCRContrib from "./InfoCRContrib";
import InfoComplIRRF from "./InfoComplIRRF";
import PenAlim from "./PenAlim";
import InfoRRA from "./InfoRRA";
import IdeAdv from "./IdeAdv";
import FileUploader from "../../common/FileUploader";
import { useFormikContext } from "formik";

const CalcTrib = ({indexTrab}: {indexTrab:number}) => {
	const { values, setFieldValue } = useFormikContext<FormikContext>()

	return (
		<FormArray
			lable="Identificação do trabalhador, do período e da base de cálculo dos tributos."
			name={`ideTrab.${indexTrab}.calcTrib`}
			slotBottomLeft={<FileUploader
				returnFile={(idePeriodoFile, isSlsx2501, generateLine) => {
					const finalIdePeriodo = values.ideTrab?.length ? [...values.ideTrab[indexTrab]?.calcTrib, ...idePeriodoFile] : [...idePeriodoFile]
					finalIdePeriodo.splice(-1, 1)
					setFieldValue(`ideTrab.${indexTrab}.calcTrib`, finalIdePeriodo);
					setFieldValue(`ideTrab.${indexTrab}.infoCRIRRF`, idePeriodoFile.pop())
					setFieldValue(`calcularValorSegurado`, isSlsx2501)
					setFieldValue(`generateLine`, generateLine)
				}}
				s2500={false}
			/>}
			lableChild="Base de cálculo"
			initialValues={{
				id: 0,
				cpfTrab: "",
				perRef: "",
				vrBcCpMensal: "",
				vrBcCp13: "",
				infoCRContrib: [],
				// penAlim: [],
				// descRRA: "",
				// qtdMesesRRA: "",
				// vlrDespCustas: "",
				// vlrDespAdvogados: "",
				// ideAdv: []
			}}
			renderChildren={(index: number) => (
				<>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<DateFieldYearMonth
								name={`ideTrab.${indexTrab}.calcTrib.${index}.perRef`}
								label={
									"Informar o mês/ano (formato AAAA-MM) de referência das informações"
								}
								views={["year", "month"]}
								format="MM/yyyy"
								monthYear={true}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<CurrencyField
								name={`ideTrab.${indexTrab}.calcTrib.${index}.vrBcCpMensal`}
								label={"Valor da base de cálculo da contribuição previdenciária sobre a remuneração mensal do trabalhador."}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<CurrencyField
								name={`ideTrab.${indexTrab}.calcTrib.${index}.vrBcCp13`}
								label={"Valor da base de cálculo da contribuição previdenciária sobre a remuneração do trabalhador referente ao 13º salário"}
							/>
						</Grid>
					</Grid>

					{/* <InfoCRIRRF index={index} indexTrab={indexTrab} /> */}
					<InfoCRContrib index={index} indexTrab={indexTrab} />
	
				</>
			)}
		/>
	);
};

export default CalcTrib;

