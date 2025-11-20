import { Grid } from "@material-ui/core";
import {
	SelectField,
	DateField,
	CurrencyField,
	TextField,
	DateFieldYearMonth,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";
import { MainDiv } from "../styled";

const RemunerationInformationPaymentFrequency = ({
	index: indexPai,
}: {
	index: number;
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	return (
		<FormArray
			name={`infoContr.${indexPai}.remuneracao`}
			lable="Remuneraçoes"
			lableChild="Remuneração"
			initialValues={{
				dtRemun: null,
				vrSalFx: "",
				undSalFixo: "",
				dscSalVar: "",
				id: 0, 
				eventLaunchId: null
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<DateFieldYearMonth
										name={`infoContr.${indexPai}.remuneracao.${index}.dtRemun`}
										label={
											"Data a partir da qual as informações de remuneração e periodicidade de pagamento estão vigentes"
										}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<CurrencyField
										name={`infoContr.${indexPai}.remuneracao.${index}.vrSalFx`}
										label={
											"Salário base do trabalhador, correspondente à parte fixa da remuneração em compFim."
										}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<SelectField
										name={`infoContr.${indexPai}.remuneracao.${index}.undSalFixo`}

										label={"Unidade de pagamento da parte fixa da remuneração"}
										options={list
											.filter(
												({ eSocialTableNumber }) => eSocialTableNumber === 507
											)
											?.map(({ description, code }) => ({
												label: description,
												value: code,
											}))}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										name={`infoContr.${indexPai}.remuneracao.${index}.dscSalVar`}
										label={
											"Descrição do salário por tarefa ou variável e como este é calculado."
										}
										maxLength={1000}
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

export default RemunerationInformationPaymentFrequency;

