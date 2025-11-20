import { Grid } from "@material-ui/core";
import { TextField, SelectField } from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import AccordionPanel from "src/components/AccordionPanel";

const EventIdentification = () => {
	const list = useSelector(getListESocialRegistrationTable);

	return (
		<AccordionPanel title="Identificação do evento" startExpanded>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<SelectField
						name="indRetif"
						label={"Tipo Evento"}
						options={list
							.filter(({ eSocialTableNumber }) => eSocialTableNumber === 500)
							?.map(({ description, code }) => ({
								label: description,
								value: code,
							}))}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						name="tpAmb"
						label={"Identificação do ambiente"}
						options={list
							.filter(({ eSocialTableNumber }) => eSocialTableNumber === 501)
							?.map(({ description, code }) => ({
								label: description,
								value: code,
							}))}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						name="procEmi"
						label={"Processo de emissão do evento"}
						options={list
							.filter(({ eSocialTableNumber }) => eSocialTableNumber === 502)
							?.map(({ description, code }) => ({
								label: description,
								value: code,
							}))}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						name="verProc"
						label={"Versão do processo de emissão do evento"}
						maxLength={100}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						name="nrRecibo"
						label={"Número do recibo"}
						maxLength={23}
					/>
				</Grid>
			</Grid>
		</AccordionPanel>
	);
};

export default EventIdentification;
