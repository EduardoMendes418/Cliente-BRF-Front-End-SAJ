import { Grid } from "@material-ui/core";
import { TextField } from "src/components/form";
import FormArray from "src/components/FormArray";

const RelatedObservationsEmploymentContract = ({
	index: indexPai,
}: {
	index: number;
}) => {
	return (
		
		<FormArray
			name={`infoContr.${indexPai}.observacoes`}
			lable="Observações Relacionadas do Contrato de Trabalho"
			lableChild="Observação"
			initialValues={{
				observacao: "",
				id: 0, 
				eventLaunchId: null
			}}
			renderChildren={(index: number) => {
				return (
					<Grid container spacing={3}>
						<Grid item md={12} xs={12}>
							<TextField
								name={`infoContr.${indexPai}.observacoes.${index}.observacao`}
								label={"Observação"}
								maxLength={255}
							/>
						</Grid>
					</Grid>
				);
			}}
		/>
	);
};

export default RelatedObservationsEmploymentContract;

