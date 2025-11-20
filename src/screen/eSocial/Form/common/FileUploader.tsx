import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import eSocialEventAPI from 'src/core/api/e-social-event-launch';
import { CircularProgress } from '@mui/material';
import { toCurrency, valuesToNumber } from 'src/core/utils/func';

function transformEsocialFileToIdePeriodo2500(esocialFile: any) {
    const idePeriodo = [] as any;

    // Processar registros INSS
    esocialFile?.inss.forEach((inssRecord: any) => {
        idePeriodo.push({
            id: 0,
            perRef: inssRecord.dataOcorrenciaInss,
            vrBcCpMensal: inssRecord.ocorrenciaDecimoTerceiro ? "" : toCurrency(inssRecord.valorBaseVerbas) ,
            vrBcCp13: inssRecord.ocorrenciaDecimoTerceiro ? toCurrency(inssRecord.valorBaseVerbas) : "",
            grauExp: "1",
            vrBcFGTSProcTrab: "",
            vrBcFGTSSefip: "",
            vrBcFGTSDecAnt: "",
            codCateg: "",
            vrBcCPrev: "",
            dia: "",
            hrsTrab: ""
        });
    });

    // Processar registros FGTS
/*     esocialFile?.fgts.forEach((fgtsRecord: any) => {
        const existingRecord = idePeriodo.find((record: any) => record.perRef === fgtsRecord.ocorrencia);
        if (existingRecord) {
            existingRecord.vrBcFGTSProcTrab = toCurrency(fgtsRecord.baseVerba);
        } else {
            idePeriodo.push({
                id: 0,
                perRef: fgtsRecord.ocorrencia,
                vrBcCpMensal: "",
                vrBcCp13: "",
                grauExp: "1",
                vrBcFGTSProcTrab: toCurrency(fgtsRecord.baseVerba),
                vrBcFGTSSefip: "",
                vrBcFGTSDecAnt: "",
                codCateg: "",
                vrBcCPrev: ""
            });
        }
    }); */

    // Processar registros IRPF
    // esocialFile?.irpf.forEach((irpfRecord: any) => {
    //     const existingRecord = idePeriodo.find((record: any) => record.perRef === irpfRecord.dataOcorrencia);
    //     if (existingRecord) {
    //         existingRecord.vrBcCPrev = toCurrency(irpfRecord.valorVerbas);
    //     } else {
    //         idePeriodo.push({
    //             id: 0,
    //             perRef: irpfRecord.dataOcorrencia,
    //             vrBcCpMensal: "",
    //             vrBcCp13: "",
    //             grauExp: "1",
    //             vrBcFGTSProcTrab: "",
    //             vrBcFGTSSefip: "",
    //             vrBcFGTSDecAnt: "",
    //             codCateg: "",
    //             vrBcCPrev: toCurrency(irpfRecord.valorVerbas)
    //         });
    //     }
    // });

    return idePeriodo;
}

function transformEsocialFileToIdePeriodo2501(esocialFile: any) {
    const idePeriodo = [] as any;

    // Processar registros INSS
    esocialFile?.inss.forEach((inssRecord: any) => {

        idePeriodo.push({
            id: 0,
            perRef: inssRecord.dataOcorrenciaInss,
            vrBcCpMensal: inssRecord.ocorrenciaDecimoTerceiro ? "" : toCurrency(inssRecord.valorBaseVerbas) ,
            vrBcCp13: inssRecord.ocorrenciaDecimoTerceiro ? toCurrency(inssRecord.valorBaseVerbas) : "",
            valorDevidoSeguradoFinal: inssRecord.valorDevidoSeguradoFinal,
            valorDevidoSAT: inssRecord.valorDevidoSAT,
            taxaDeJuros: inssRecord.taxaDeJuros
        });
    });


    // Processar registros FGTS
    // esocialFile?.fgts.forEach((fgtsRecord: any) => {
    //     const existingRecord = idePeriodo.find((record: any) => record.perRef === fgtsRecord.ocorrencia);
    //     if (existingRecord) {
    //         existingRecord.vrBcFGTSProcTrab = toCurrency(fgtsRecord.valorVerbas);
    //     } else {
    //         idePeriodo.push({
    //             id: 0,
    //             perRef: fgtsRecord.ocorrencia,
    //             vrBcCpMensal: "",
    //             vrBcCp13: "",
    //             infoCRContrib: [{
    //                 id: 0,
    //                 tpCr: "593656",
    //                 vrCr: toCurrency(fgtsRecord.valorVerbas)
    //             }],
    //         });
    //     }
    // });

    // Processar registros IRPF
    if(esocialFile?.irpf?.length > 0){
    esocialFile?.irpf?.forEach((irpfRecord: any) => {
        /* const existingRecord = idePeriodo.find((record: any) => record.perRef === irpfRecord.dataOcorrencia); */
    

        const infoCRIRRF = [{
            id: 0,
            tpCr: "188951",
            vrCr: toCurrency(esocialFile?.irpf?.reduce((acc: any, obj: { valorDevido: number; }) => acc + obj.valorDevido, 0)),
            vrRendTrib: toCurrency(esocialFile?.irpf?.reduce((acc: any, obj: { valorVerbas: number; }) => acc + obj.valorVerbas, 0)),
            descRRA: "VERBAS DECIDIDAS ATRAVÉS DE PROCESSO JUDICIAL",
            qtdMesesRRA: esocialFile?.irpf[0]?.quantidadeCompetencias
        }]
            idePeriodo.push(infoCRIRRF);
        
    })};

    return esocialFile?.irpf?.length > 0 ? idePeriodo : [...idePeriodo, {}]
}

async function transformEsocialFileToIdePeriodoxlsx(esocialFile: any, checkInfoCRIRRF: boolean){

    const idePeriodo = [] as any;

    const toSend = esocialFile?.filter((x: any) => x.tpCR !== null)

    const infoCRIRRF = [{
        id: 0,
        tpCr: toSend[0]?.tpCR,
        vrCr: toCurrency(toSend?.reduce((acc: any, obj: { vrCR: any; }) => acc + obj.vrCR, 0)),
        vrRendTrib: toCurrency(toSend?.reduce((acc: any, obj: { vrRendIRRF: any; }) => acc + obj.vrRendIRRF, 0)),
        vrRendTrib13: toCurrency(toSend?.reduce((acc: any, obj: { vrRendIRRF13: any; }) => acc + obj.vrRendIRRF13, 0)),
        qtdMesesRRA: toSend?.[0]?.qtdMesesRRA
    }];

    function checkIfHasInfoCRIRRF(array: any) {
        const objeto = array[0];

        const normalizedValues = {
			...(valuesToNumber(
				[
					"vrCr",
					"vrRendTrib",
					"vrRendTrib13",
				],
				objeto
			) as any),
		}

        return !(normalizedValues.vrCr === 0 && normalizedValues.vrRendTrib === 0 && normalizedValues.vrRendTrib13 === 0);
    }

    const hasInfoCRIRRF = await checkIfHasInfoCRIRRF(infoCRIRRF)

    esocialFile?.forEach((inssRecord: any) => {
        idePeriodo.push({
            id: 0,
            perRef: inssRecord.perRef,
            vrBcCpMensal: toCurrency(inssRecord.vrBcCpMensal) ?? "" ,
            vrBcCp13: toCurrency(inssRecord.vrBcCp13) ?? "",
            grauExp: inssRecord.grauExp ?? "",
            vrBcFGTSProcTrab: toCurrency(inssRecord.vrBcFGTSProcTrab) ?? "",
            
        },
    );
    });

    idePeriodo.push(infoCRIRRF)

    return checkInfoCRIRRF ? [...idePeriodo, hasInfoCRIRRF] : idePeriodo;
}

const FileUploader = ({returnFile, s2500}:{returnFile: (arg:any, isSlsx2501?: boolean, generateLine?: boolean) => void, s2500: boolean}) => {
    const [loading, setLoading] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

		if (event.target.files && event.target.files[0]) {
            const fileList = event.target.files;
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                if(file?.type.length > 0){
                    await uploadFileSlsx(event.target.files);
                        return
                } else {

                    await uploadFile(event.target.files);
                }
            }
		}
	};

    const uploadFileSlsx = async (file: FileList) => {
		try {
            setLoading(true)
			const {data} = await eSocialEventAPI.readEsocialFile(file);

			const idPeriodoFile = s2500 ? 
                await transformEsocialFileToIdePeriodoxlsx(data.s2500, false) : 
                await transformEsocialFileToIdePeriodoxlsx(data.s2501, true)

                    returnFile(s2500 ? idPeriodoFile.slice(0, -1) : idPeriodoFile.slice(0, -1), !s2500, idPeriodoFile[idPeriodoFile?.length -1])
                    setLoading(false)
			enqueueSnackbar('Arquivo extraido com sucesso', { variant: 'success' });

		} catch (error) {
            console.error(error)
            setLoading(false)
			enqueueSnackbar('Erro ao fazer upload do arquivo', { variant: 'error' });
		}
	};

	const uploadFile = async (file: FileList) => {
		try {
            setLoading(true)
			const {data} = await eSocialEventAPI.readEsocialFile(file);

			const idPeriodoFile = s2500 ? 
                transformEsocialFileToIdePeriodo2500(data[0]) : 
                transformEsocialFileToIdePeriodo2501(data[0])

            returnFile(idPeriodoFile, false, data[0]?.irpf.length > 0 ? true : false)
            setLoading(false)
			enqueueSnackbar('Arquivo extraido com sucesso', { variant: 'success' });
		} catch (error) {
            console.error(error)
            setLoading(false)
			enqueueSnackbar('Erro ao fazer upload do arquivo', { variant: 'error' });
		}
	};

    if (loading) return <CircularProgress />

	return (
		<div>
			<input
				accept="*/*"
				style={{ display: 'none' }}
				id="file-uploader"
				type="file"
				onChange={handleFileChange}
			/>
			<label htmlFor="file-uploader">
				<Button variant="outlined" color="secondary" component="span">
                    {'Carregar Arquivo'}
				</Button>
			</label>
		</div>
	);
};

export default FileUploader;
