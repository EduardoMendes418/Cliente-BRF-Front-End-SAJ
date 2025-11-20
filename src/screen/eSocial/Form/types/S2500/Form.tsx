import { useEffect, useMemo } from 'react';
import { FormikHelpers } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ESocialS2500 } from "src/core/models/eSocial";
import { getAutocompleteESocialData, getSearchEventLauch, } from "src/core/store/modules/e-social-event-launch/selectors";
import { fetchESocialWorkerCategory } from 'src/core/store/modules/e-social-worker-category/thunks';
import { fetchESocialReasonsForDismissal } from 'src/core/store/modules/e-social-reasons-for-dismissal/thunks';
import {
	addESocialEventLauch,
	editESocialEventLauch
} from "src/core/store/modules/e-social-event-launch/thunks";
import api from 'src/core/api/e-social-event-launch'
import {
	deepCopy,
	emptyStringToNull,
	emptyStringToNullOrToNumber,
	emptyStringToNullOrToNumberNotValue,
	modifyProperty,
	nullToZero,
	toCleanedId,
	toNumber,
	truncateDate,
	truncateDateYear,
	updateNullValuesToZeroS2500
} from "src/core/utils/func";

import Ninter from "./Ninter";
import IdeTrab from "./IdeTrab";
import EventIdentification from "./EventIdentification";
import InProvidingInformation from "./InProvidingInformation";
import InIndirectResponsibility from "./InIndirectResponsibility";
import EmploymentContractInformation from "./EmploymentContractInformation";
import AdditionalInformationAboutProcessOrDemand from "./AdditionalInformationAboutProcessOrDemand";
import FormCore from "../../common/FormCore";
import { useSnackbar } from 'notistack';

export const toFormatHourMinute = (value: any) : string => {
	if (typeof value === 'string') {
		return value.replace(/:/g, '');
	}
	return value;
}

export const removeDeletedObjects = (obj: any): any => {
	if (Array.isArray(obj)) {
        return obj
            .map(item => removeDeletedObjects(item))
            .filter(item => !(item && item.isDeleted));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = removeDeletedObjects(obj[key]);
                if (!(value && value.isDeleted)) {
                    newObj[key] = value;
                }
            }
        }
        return newObj;
    } else if (typeof obj === 'string' && obj.includes('R$')) {
        return parseFloat(obj.replace('R$', '').replace(',', '.').trim());
    }
    return obj;
}

export const convertCurrencyStrings = (obj: any): any => {
	if (Array.isArray(obj)) {
        return obj.map(item => convertCurrencyStrings(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = convertCurrencyStrings(obj[key]);
            }
        }
        return newObj;
    } else if (typeof obj === 'string' && obj.includes('R$')) {
        return parseFloat(obj.replace('R$', '').replace(',', '.').trim());
    }
    return obj;
}

const FormDefault = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const search = useSelector(getSearchEventLauch);
	const autoComplete = deepCopy(useSelector(getAutocompleteESocialData));
	const { enqueueSnackbar } = useSnackbar();
	const { location: { pathname }, ...history } = useHistory()

	useEffect(() => {
		dispatch(fetchESocialWorkerCategory({ notPaginate: true }));
		dispatch(fetchESocialReasonsForDismissal({ notPaginate: true }));
	}, []);

	const isProd = import.meta.env.REACT_APP_BASE_URL_PAYMENTS === 'https://brf-api-iuris-pagamentos.azurewebsites.net/api/v1/';

	const initialValues: ESocialS2500 = {
		id: 0,
		accrualMonth: null,
		processId: "",
		eventLaunchBaseId: null,
		dateOfSubmissionToTheGovernment: null,
		eventCode: 1,
		eventLaunchStatus: 1,
		indRetif: "1",
		nrRecibo: "",
		tpAmb: isProd ? "1" : "2",
		procEmi: "1",
		verProc: "SAP_HRCBR",
		ideEmpregadorTpInsc: "1",
		ideEmpregadorNrInsc: "01.838.723/0001-27",
		ideRespTpInsc: "",
		ideRespNrInsc: "",
		ideRespDtAdmRespDir: "",
		ideRespMatRespDir: "",
		origem: "1",
		nrProcTrab: "",
		obsProcTrab: "",
		dtSent: null,
		ufVara: "",
		codMunic: "",
		idVara: "",
		dtCCP: null,
		tpCCP: "",
		cnpjCCP: "",
		cpfTrab: "",
		nmTrab: "",
		dtNascto: null,
		infoContr: [],
	};

	const initialValuesFinal = useMemo(() => {
		// if (!hasItem) return { ...customInitialValues };
		let normalizeValues = null
		if (isNew) {
			type DateKeys = 'admissionDate' | 'calculationEndDate' | 'calculationStartDate' | 'sentenceDate';

			const dateKeys: DateKeys[] = ["admissionDate", "calculationEndDate", "calculationStartDate", "sentenceDate"];

			dateKeys.forEach(key => {
				const value = autoComplete[key];
				if (typeof value === 'string') {
					autoComplete[key as DateKeys] = value.split('T')[0];
				}
			});

			normalizeValues = deepCopy({
				...initialValues,
				cpfTrab: autoComplete.workersCPF ?? "",
				nmTrab: autoComplete.workersName ?? "",
				dtSent: autoComplete.sentenceDate ?? "",
				ufVara: autoComplete.courtPanelUF ?? "",
				idVara: autoComplete.courtPanelNumber ?? "",
				nrProcTrab: autoComplete.processNumber ?? "",
				codMunic: autoComplete.ibgeCode ?? "",
				infoContr: [
					{
						infoContrTpContr: autoComplete.typeOfContract ?? "",
						dtInicio: null,
						indContr: "S",
						indReint: "N",
						indNatAtiv: "N",
						indMotDeslig: "N",
						indCateg: "N",
						codCateg: "",
						codCBO: "",
						natAtividade: "",
						remuneracao: [],
						tpRegTrab: "",
						dtAdm: null,
						tpRegPrev: "",
						tmpParc: "",
						clauAssec: "",
						objDet: "",
						tpContr: "",
						dtTerm: null,
						duracaoTpContr: "",
						duracaoDtTerm: "",
						observacoes: [],
						sucessaoVincTpInsc: "",
						sucessaoVincNrInsc: "",
						matricAnt: "",
						dtTransf: null,
						dtDeslig: null,
						dtDesmtvDesliglig: "",
						indenSD: "",
						IndenAbono: "",
						dtProjFimAPI: null,
						mtvDesligTSV: "",
						infoTermDtTerm: null,
						ideEstabTpInsc: "",
						ideEstabNrInsc: "",
						pagDiretoResc: "",
						repercProc: "",
						idePeriodo: [],
						unicContr: [],
						mudCategAtiv: [],
						id: 0,
						eventLaunchId: null,
						dtAdmOrig: autoComplete.admissionDate ?? null,
						compIni: autoComplete.calculationStartDate ?? null,
						compFim: autoComplete.calculationEndDate ?? null,
						indReperc: autoComplete.repercussionIndication ?? 0,
						matricula: autoComplete.registration ?? "",
					}
				],
			});
		} else {
			normalizeValues = deepCopy({
				...initialValues,
			});
		}

		return normalizeValues;
	}, [autoComplete, isNew]);

	const onSubmit = async (values: ESocialS2500, { setSubmitting }: FormikHelpers<ESocialS2500>) => {
		const normalizeValues = deepCopy({
			...initialValues,
			...values,
			...search,
		});
		delete normalizeValues.process

		const keysValues = ["vrSalFx","vrAlim","vrBcCPrev","baseMudCategVrBcFgts","baseMudCategVrBcFgts13"]

		modifyProperty(normalizeValues, keysValues, emptyStringToNullOrToNumber);
	
		modifyProperty(normalizeValues, [
			"vrBcCpMensal",
			"vrBcCp13",
			"vrBcFGTSProcTrab",
			"vrBcFGTSSefip",
			"vrBcFGTSDecAnt"
		], emptyStringToNullOrToNumberNotValue);
		
		modifyProperty(normalizeValues, [
			"ideRespNrInsc",
			"ideEstabNrInsc",
			"ideEmpregadorTpInsc",
			"ideEmpregadorNrInsc",
			"cpfTrab",
			"nrProcTrab"
		], toCleanedId);

		modifyProperty(normalizeValues, [
			"indenSD",
			"indenAbono",
		], emptyStringToNull);

		modifyProperty(normalizeValues, [
			"hrsTrab",
		], toFormatHourMinute);

		modifyProperty(
			normalizeValues,
			["compIni", "compFim", "perRef"],
			truncateDate
		);
		modifyProperty(
			normalizeValues,
			["anoBase"],
			truncateDateYear
		);
		modifyProperty(normalizeValues, ["dia"], toNumber);

		if(normalizeValues?.infoContr.length > 0){
			updateNullValuesToZeroS2500(normalizeValues?.infoContr)
		}

		// const invalidPaths = getInvalidPropertyPaths(normalizeValues, {
		// 	indRetif: required,
		// 	tpAmb: required,
		// 	procEmi: required,
		// 	nrInsc: size([8, 12, 11, 14]),
		// 	verProc: required,
		// 	origem: required,
		// 	nrProcTrab: size([15, 20]),
		// 	obsProcTrab: arrayRange(1, 999),
		// 	cpfTrab: size([11]),
		// 	dependente: arrayRange(0, 99),
		// 	infoContr: arrayRange(1, 99),
		// })
		// if (invalidPaths.length) {
		// 	setSubmitting(false)
		// 	return modal({
		// 		title: 'Erros de validação',
		// 		component: <Table columns={[{ label: "Erros", field: "error" },]} rows={translateErrors(invalidPaths, t, "eSocial:validation").map((item)=>({error: item}))}
		// 		/>,
		// 		buttons: [],
		// 		dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
		// 	})
		// }

	
		const onAddNormalizeValues = await removeDeletedObjects(normalizeValues);
		const onEditNormalizeValues = await convertCurrencyStrings(normalizeValues);

		if (normalizeValues.submitAction === "save") {
			delete normalizeValues.submitAction
			setSubmitting(true)
			if (isNew){
				return dispatch(addESocialEventLauch(onAddNormalizeValues));}
			dispatch(editESocialEventLauch(onEditNormalizeValues));
	
			setSubmitting(false)
			return ;
		}
		delete normalizeValues.submitAction
		try {
			// await api.edit({...normalizeValues, sajDelete: true});
			await api.sendToSAP({ id:normalizeValues.id, sajDelete: true });
			enqueueSnackbar('Evento excluido com sucesso', { variant: 'success' });
			history.push(pathname.replace(/\/[^/]+$/, ''))

		} catch (error) {
			enqueueSnackbar('Erro ao excluido evento', { variant: 'error' });
		}
	};

	return (
		<FormCore
			isSapButtonVisible
			onSubmit={onSubmit}
			customInitialValues={initialValuesFinal}
			editable
		>
			<EventIdentification />
			<InProvidingInformation />
			<InIndirectResponsibility />
			<Ninter />
			<AdditionalInformationAboutProcessOrDemand />
			<IdeTrab />
			<EmploymentContractInformation />
		</FormCore>
	);
};
export default FormDefault;
