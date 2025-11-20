import { Grid } from "@material-ui/core";
import {
	SelectField,
	DateField,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";
import { getListESocialWorkerCategory } from "src/core/store/modules/e-social-worker-category/selectors";
import { MainDiv } from "../styled";

const MudCategAtiv = ({
	index: indexPai,
}: {
	index: number;
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	const worker = useSelector(getListESocialWorkerCategory);

	return (
		<FormArray
			name={`infoContr.${indexPai}.mudCategAtiv`}
			lable="Informação do novo código de categoria e/ou da nova natureza da atividade, no caso de reconhecimento judicial nesse sentido"
			lableChild="Código de categoria"
			initialValues={{
				codCateg: "",
				natAtividade: "",
				dtRemun: null,
				dscSalVar: "",
				id: 0, 
				eventLaunchId: null
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`infoContr.${indexPai}.mudCategAtiv.${index}.codCateg`}
										label={"Código da categoria do trabalhador"}
										options={worker?.map((item: any) => ({value: item.code, label: item.description}))}

									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										name={`infoContr.${indexPai}.mudCategAtiv.${index}.natAtividade`}
										label={"Natureza da atividade"}
										options={list
											.filter(
												({ eSocialTableNumber }) => eSocialTableNumber === 506
											)
											?.map(({ description, code }) => ({
												label: description,
												value: code,
											}))}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										name={`infoContr.${indexPai}.mudCategAtiv.${index}.dtMudCategAtiv`}
										label={
											"Data a partir da qual foi reconhecida a nova categoria e/ou a nova natureza da atividade."
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

export default MudCategAtiv;

