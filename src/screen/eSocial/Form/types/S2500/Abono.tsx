import { Grid } from "@material-ui/core";
import {
	SelectField,
	DateField,
	DateFieldYearMonth,
} from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import FormArray from "src/components/FormArray";

const Abono = ({
	index: indexPai,
}: {
	index: number;
}) => {
	const list = useSelector(getListESocialRegistrationTable);
	return (
		<FormArray
			name={`infoContr.${indexPai}.abono`}
			lable="Informações de identificação do(s) ano(s)-base em que houve indenização substitutiva de abono salarial."
			lableChild="Ano"
			initialValues={{
				id: 0,
				anoBase: null
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<div style={{ width: "100%" }}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<DateFieldYearMonth
										name={`infoContr.${indexPai}.abono.${index}.anoBase`}
										label={
											"Ano"
										}
										views={['year']}
										format="YYYY"
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

export default Abono;

