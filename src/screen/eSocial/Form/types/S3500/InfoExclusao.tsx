import { Grid } from "@material-ui/core";
import { TextField, SelectField } from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import AccordionPanel from "src/components/AccordionPanel";

const InfoExclusao = () => {
	const list = useSelector(getListESocialRegistrationTable);

	return (
		<AccordionPanel title="Grupo que identifica o evento objeto da exclusão." startExpanded>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<TextField
						name="tpEvento"
						label={"Preencher com o tipo de evento (S-2500 ou S-2501)"}
						maxLength={6}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						name="nrRecEvt"
						label={"Preencher com o número do recibo do evento que será excluído"}
						maxLength={23}
					/>
				</Grid>
			</Grid>
		</AccordionPanel>
	);
};

export default InfoExclusao;
