import { Grid } from "@material-ui/core";
import {
    TextField,
    DateFieldYearMonth,
    SelectField,
    NumericField,
} from "src/components/form";
import AccordionPanel from "src/components/AccordionPanel";

const IdeProc = () => {
    return (
        <AccordionPanel title="Identificação do processo" startExpanded>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <DateFieldYearMonth
                        name={`perApurPgto`}
                        label={"Mês/ano em que é devida a obrigação de pagar a parcela prevista no acordo/sentença"}
						views={['year', 'month']}
                        format="YYYY-MM"
                        monthYear={true}
                        // disableInitialSetValue
                    />
                </Grid>
                <Grid item md={3} xs={12}>
					<TextField
                        name="obs"
                        label={"Observação referente ao pagamento de parcela prevista no acordo/sentença"}
						maxLength={999}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <SelectField
						name="cprb"
						label={"CPRB"}
						options={[{label: "Sim", value: 1},
								{label: "Não", value: 0}
								]}
						required		
				    />
                </Grid>
               {/*  <Grid item md={3} xs={12}>
                    <NumericField
						name='ideSeqProc'
						label={"Número sequencial atribuído pela empresa a cada conjunto de dados de tributos decorrentes de processo trabalhista, quando for necessário enviar o mesmo processo em múltiplos S-2501, para o mesmo perApurPgto"}
                        maxLength={3}
                    />
                </Grid> */}
            </Grid>

        </AccordionPanel>
    );
};

export default IdeProc;
