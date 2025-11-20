import { Grid } from "@material-ui/core";
import { MaskField, SelectField, TextField } from "src/components/form";
import { useSelector } from "react-redux";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";
import AccordionPanel from "src/components/AccordionPanel";
import { useFormikContext } from "formik";

const InProvidingInformation = () => {

	const list = useSelector(getListESocialRegistrationTable);
	const { values } = useFormikContext<any>();

	const calculateContactType = (ideEmpregadorTpInsc: string): string | undefined => {
		switch (ideEmpregadorTpInsc) {
			case "1":
				return "2";
			case "2":
			case "3":
			case "4":
				return "1";
			default:
				return undefined;
		}
	};

	return (
		<AccordionPanel
			title="Informações de identificação do empregador ou do contribuinte que está prestando informações"
			startExpanded
		>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<SelectField
						name="ideEmpregadorTpInsc"
						label={"Tipo de inscrição do empregador / contribuinte"}
						options={list
							.filter(({ eSocialTableNumber }) => eSocialTableNumber === 5)
							?.map(({ description, code }) => ({
								label: description,
								value: code,
							}))}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<MaskField 
						label={"Nome do empregador/Contribuinte"}
						name="ideEmpregadorNrInsc"
						mask={calculateContactType(values.ideEmpregadorTpInsc) === "1" ? "999.999.999-99" : "99.999.999/9999-99"}
						maskChar={null}
					/>
					{/* <ContactField
						label={"Nome do empregador/Contribuinte"}
						name="ideEmpregadorNrInsc"
						contactType={calculateContactType(values.ideEmpregadorTpInsc)}
					/> */}
				</Grid>
				{/* <Grid item md={3} xs={12}>
					<TextField
						name="ideEmpregadorNrInsc"
						label={"Número da inscrição do empregador"}
						maxLength={14}
					/>
				</Grid> */}
				<Grid item md={3} xs={12}>
					<TextField
						name="nrProcTrab"
						label={"Número do processo trabalhista, da ata ou número de identificação da conciliação."}
						maxLength={20}
					/>
				</Grid>
			</Grid>
		</AccordionPanel>
	);
};

export default InProvidingInformation;
