import { Grid } from "@material-ui/core";
import {
    TextField,
    SelectField,
	DateField,
    NumericField
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
import { useStatesAndCitiesESocialTable } from "src/hooks/fetchLists";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdditionalInformationAboutProcessOrDemand = () => {
	const list = useSelector(getListESocialRegistrationTable);
    const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const { values } = useFormikContext<any>();
    const [stateId, setStateId] = useState<string | null>(null);
    const { states, citiesAsOptions } = useStatesAndCitiesESocialTable(stateId ?? 0);

    const getStateId = () => {
        
    const filteredStateId = states?.filter((x: any) => x.code === values.ufVara)[0]?.code 
        setStateId(filteredStateId); 
    }

    useEffect(() => {
        getStateId();
    }, [values.ufVara, values.idVara])

    useEffect(() => {
        if(isNew === false){
            setStateId(values.ufVara)
        }
    }, []) 

    return (
        <AccordionPanel title="Informações complementares do processo ou da demanda" startExpanded>
            <Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<DateField
						label={"Data da sentença ou da homologação do acordo do processo judicial"}
						name="dtSent"
					/>
				</Grid>
                <Grid item md={3} xs={12}>
                    <SelectField
                        name="ufVara"
                        label={"Unidade da Federação onde está localizada a Vara em que o processo tramitou"}
						options={states?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
                    <SelectField
                        name="codMunic"
                        label={"Código do município, conforme tabela do IBGE"}
                        options={citiesAsOptions}
                        disabled={isNew === false ? isNew : stateId === undefined ? true : false}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<NumericField
                        maxLength={4}
                        name="idVara"
                        label={"Código de identificação da Vara em que o processo tramitou"}
                    />
                </Grid>
				<Grid item xs={12} md={3}>
					<DateField
						label={"Data da conciliação"}
						name="dtCCP"
					/>
				</Grid>
				<Grid item md={3} xs={12}>
                    <SelectField
                        name="tpCCP"
                        label={"Âmbito de celebração do acordo?"}
						options={list?.filter(({eSocialTableNumber})=> eSocialTableNumber === 504)?.map(({description, code}) => ({label: description, value: code}))}
                    />
                </Grid>
				<Grid item md={3} xs={12}>
					<TextField
                        name="cnpjCCP"
                        label={"Identificar o CNPJ do sindicato representativo do trabalhador, no âmbito da CCP ou NINTER."}
                    />
                </Grid>
            </Grid>

        </AccordionPanel>
    );
};

export default AdditionalInformationAboutProcessOrDemand;
