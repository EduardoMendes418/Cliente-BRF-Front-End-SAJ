import { Grid } from "@material-ui/core";
import {
	DateField,
	TextField,
} from "src/components/form";
import FormArray from "src/components/FormArray";
import { getListESocialWorkerCategory } from "src/core/store/modules/e-social-worker-category/selectors";
import { MainDiv } from "../styled";

const UnicContr = ({
	index: indexPai,
}: {
	index: number;
}) => {
	return (
		<FormArray
			name={`infoContr.${indexPai}.unicContr`}
			lable="Informações dos vínculos/contratos incorporados, no caso de reconhecimento de unicidade contratual"
			lableChild="Vínculo/Contrato"
			initialValues={{
				matUnic: "",
				codCateg: "",
				dtInicio: null,
				id: 0, 
				eventLaunchId: null
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<TextField
										name={`infoContr.${indexPai}.unicContr.${index}.matUnic`}
										label={
											"Matrícula incorporada"
										}
										maxLength={30}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name={`infoContr.${indexPai}.unicContr.${index}.codCateg`}
										label={
											"Código da categoria do trabalhador"
										}
										maxLength={3}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										name={`infoContr.${indexPai}.unicContr.${index}.dtInicio`}
										label={
											"Data de início de TSVE"
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

export default UnicContr;

