import { Grid } from "@material-ui/core";
import AccordionPanel from "src/components/AccordionPanel";
import { TextField, CurrencyField } from "src/components/form";
import { MainDiv } from "../styled";

const InfoRRA = ({
	index: indexPai,
	indexTrab
}: {
	index: number;
	indexTrab: number;
}) => {
	return (
		<MainDiv>
			<AccordionPanel title="Informações complementares relativas a Rendimentos Recebidos Acumuladamente - RRA." startExpanded ativateBorder>
				<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<TextField 
							name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.descRRA`}
							label={"Valor do somatório das deduções por dependentes"} 
							maxLength={50}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField 
							name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.qtdMesesRRA`}
							label={"Número de meses relativo aos Rendimentos Recebidos Acumuladamente - RRA"} 
							maxLength={4}
						/>
					</Grid>
					
				</Grid>
			</AccordionPanel>
			<AccordionPanel title="Detalhamento das despesas com processo judicial" startExpanded ativateBorder>
				<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<CurrencyField 
							name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.vlrDespCustas`}
							label={"Valor do somatório das deduções por dependentes"} 
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<CurrencyField 
							name={`ideTrab.${indexTrab}.calcTrib.${indexPai}.vlrDespAdvogados`}
							label={"Valor do somatório das deduções por dependentes"} 
						/>
					</Grid>
				</Grid>
			</AccordionPanel>
		</MainDiv>
	);
};

export default InfoRRA;
