import { Grid } from "@material-ui/core";
import {
    SelectField,
	DateField,
    CurrencyField,
    DateFieldYearMonth
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
import { getListESocialWorkerCategory } from "src/core/store/modules/e-social-worker-category/selectors";

const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "", label: "Não" },
];

const InformationPeriodsSmountsResulting = ({index}:{index:number}) => {
	const list = useSelector(getListESocialRegistrationTable);
	const worker = useSelector(getListESocialWorkerCategory);

    return (
        <AccordionPanel title="Informações dos períodos e valores decorrentes de processo trabalhista e ainda não declarados no esocial" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                    <DateFieldYearMonth
                        name={`infoContr.${index}.compIni`}
                        label={"Competência inicial a que se refere o processo ou conciliação"}
						views={['year', 'month']}
                        monthYear={true}
                        format="YYYY-MM"
                        // disableInitialSetValue
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <DateFieldYearMonth
                        name={`infoContr.${index}.compFim`}
                        label={"Competência final a que se refere o processo ou conciliação"}
						views={['year', 'month']}
                        monthYear={true}
                        format="YYYY-MM"
                        // disableInitialSetValue
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.indReperc`}
                        label={
                            "Repercussão do processo trabalhista ou de demanda submetida à CCP ou ao NINTER"
                        }
                        options={list
                            .filter(
                                ({ eSocialTableNumber }) => eSocialTableNumber === 512
                            )
                            ?.map(({ description, code }) => ({
                                label: description,
                                value: code,
                            }))}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.indenSD`}
                        label={"Informar se houve decisão para pagamento da indenização substitutiva do seguro-desemprego"}
                        options={yesNoOption}
                    />
                </Grid>
             
				{/* <Grid item md={3} xs={12}>
					<SelectField
                        name={`infoContr.${index}.pagDiretoResc`}
						label={
							"A indenização compensatória (multa rescisória) do FGTS transacionada foi paga diretamente ao trabalhador mediante decisão/autorização judicial?"
						}
						options={yesNoOption}
					/>
				</Grid> */}
				{/* <Grid item md={3} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.repercProc`}
                        label={"Repercussão do processo trabalhista ou de demanda submetida à CCP ou ao NINTER"}
						options={list.filter(({eSocialTableNumber})=> eSocialTableNumber === 5006).map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid> */}
				{/* <Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${index}.vrRemun`}
                        label={"Valor total das verbas remuneratórias a serem pagas ao trabalhador. "}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${index}.vrAPI`}
                        label={"Valor do aviso prévio indenizado pago ao empregado"}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${index}.vr13API`}
                        label={"Valor da projeção do aviso prévio indenizado sobre o 13º salário"}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${index}.vrInden`}
                        label={"Valor total das demais verbas indenizatórias a serem pagas ao trabalhador."}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <CurrencyField
                        name={`infoContr.${index}.vrBaseIndenFGTS`}
                        label={"Valor da base de cálculo para recolhimento da indenização compensatória (multa rescisória) do FGTS, para geração de guia."}
                    />
                </Grid>*/}
            </Grid> 
        </AccordionPanel>
    );
};

export default InformationPeriodsSmountsResulting;
