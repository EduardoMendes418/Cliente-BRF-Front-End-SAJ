import { useState, useEffect, useCallback } from 'react';
import { Grid } from "@material-ui/core";
import {
    AutocompleteField,
    AutocompleteFieldEsocial,
    FormikContext,
    SelectField,
    getNested,
} from "src/components/form";
import { useSelector } from 'react-redux';
import { getListESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import AccordionPanel from "src/components/AccordionPanel";
import { getListESocialWorkerCategory } from "src/core/store/modules/e-social-worker-category/selectors";
import eSocialRegistrationTableAPI from 'src/core/api/e-social-registration-table';
import { useFormikContext } from 'formik';
import { getEnvironment } from 'src/core/utils/func';

const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "N", label: "Não" },
];

const InfoCompl = ({ index }: { index: number }) => {

    const list = useSelector(getListESocialRegistrationTable);
    const [listCBO, setListCBO] = useState<any>([])
	const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { values, initialValues } = useFormikContext<FormikContext>();
    const environment = getEnvironment();

    const listCBOFunc = async (code:string) => {
        try {
            setLoading(true)

            const {data : {items}} = await eSocialRegistrationTableAPI.listCBO(name, code, environment === "QAS" ? 142 : 44) as any
            setListCBO(items)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
       
    }
    const handleNameChange = useCallback(
		(value: string) => setName(value),
		[]
	);

    useEffect(() => {
        listCBOFunc("")
	}, [name]);
    useEffect(() => {
        const codCBO = getNested(`infoContr.${index}.codCBO`, values)
        if (codCBO)
            listCBOFunc(codCBO)
        
    }, [initialValues])
    const options = listCBO?.map(({ description, code }: any) => ({ label: description, value: code }))

    return (
        <AccordionPanel title="Informações complementares do contrato de trabalho" startExpanded ativateBorder>
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <AutocompleteFieldEsocial
                        name={`infoContr.${index}.codCBO`}
                        label={"Classificação Brasileira de Ocupações - CBO"}
                        options={options}
						onValueChange={handleNameChange}
                        loading={loading}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <SelectField
                        name={`infoContr.${index}.natAtividade`}
                        label={"Natureza da atividade"}
                        options={list.filter(({ eSocialTableNumber }) => eSocialTableNumber === 506)?.map(({ description, code }) => ({ label: description, value: code }))}
                    />
                </Grid>
            </Grid>
            

        </AccordionPanel>
    );
};

export default InfoCompl;
