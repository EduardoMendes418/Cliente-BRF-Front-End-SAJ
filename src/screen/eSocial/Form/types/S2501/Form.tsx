import moment from "moment";
import { FormikHelpers } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ESocialS2501 } from "src/core/models/eSocial";
import EventIdentification from "src/screen/eSocial/Form/types/S2500/EventIdentification";
import { getAutocompleteESocialData, getSearchEventLauch } from "src/core/store/modules/e-social-event-launch/selectors";
import {
	addESocialEventLauch,
	editESocialEventLauch,
} from "src/core/store/modules/e-social-event-launch/thunks";
import {
	deepCopy,
	emptyStringToNull,
	emptyStringToNullOrToNumber,
	emptyStringToNullOrToNumberNotValue,
	modifyProperty,
	toCleanedId,
	toNumber,
	truncateDate,
	updateNullValuesToZeroS2501
} from "src/core/utils/func";

import IdeProc from "./IdeProc";
import IdeTrab from "./IdeTrab";
import InProvidingInformation from "../S2500/InProvidingInformation";
import FormCore from "../../common/FormCore";
import { useMemo } from "react";
import api from 'src/core/api/e-social-event-launch'
import { useSnackbar } from "notistack";
import { convertCurrencyStrings, removeDeletedObjects } from "../S2500/Form";

const FormDefault = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const search = useSelector(getSearchEventLauch);
	const autoComplete = deepCopy(useSelector(getAutocompleteESocialData));
	const { enqueueSnackbar } = useSnackbar();
	const { location: { pathname }, ...history } = useHistory()

	const isProd = import.meta.env.REACT_APP_BASE_URL_PAYMENTS === 'https://brf-api-iuris-pagamentos.azurewebsites.net/api/v1/';

	const initialValues: ESocialS2501 = {
		id: 0,
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
		nrProcTrab: "",
		perApurPgto: "",
		cprb: null,
		/* ideSeqProc: "",  */
		obs: "",
		calcTrib: [],
		accrualMonth: null,
		folderNumber: "",
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
				nrProcTrab: autoComplete.processNumber ?? "",
				perApurPgto: autoComplete.sentenceDate ?? "",
				ideTrab: [{
					dtLaudo: null,
					cpfTrab: autoComplete.workersCPF ?? "",
					calcTrib: [],
					infoCRIRRF: []
				}],
				// nmTrab: autoComplete.workersName ?? "",
				// ufVara: autoComplete.courtPanelUF ?? "",
				// idVara: autoComplete.courtPanelNumber ?? "",
			});
		} else {
			normalizeValues = deepCopy({
				...initialValues,
			});
		}

		return normalizeValues;
	}, [autoComplete, isNew]);

	const onSubmit = async (
		values: ESocialS2501,
		{ setSubmitting }: FormikHelpers<ESocialS2501>
	) => {
		const normalizeValues = deepCopy({
			...initialValues,
			...values,
			...search,
			cprb: values.cprb === 1 ? true : false
		});
		delete normalizeValues.process
		delete normalizeValues.generateLine

		const keysValues = ["vrBcCpMensal","vrBcCp13","vrCr","vrRendTrib","vrRendTrib13","vrRendMoleGrave","vrRendIsen65","vrJurosMora","vrRendIsenNTrib","vrPrevOficial, vrRendMoleGrave13, vrRendIsen65Dec, vrJurosMora13, vrPrevOficial13, vrCR13"]

		modifyProperty(normalizeValues, keysValues, emptyStringToNullOrToNumberNotValue);


		modifyProperty(normalizeValues, [
			"ideRespNrInsc",
			"ideEstabNrInsc",
			"ideEmpregadorTpInsc",
			"ideEmpregadorNrInsc",
			"cpfTrab",
			"cpfDep",
			"nrProcTrab"
		], toCleanedId);

		modifyProperty(normalizeValues, [
			"perApurPgto"
		], truncateDate);

		if(normalizeValues?.ideTrab.length > 0){
			updateNullValuesToZeroS2501(normalizeValues?.ideTrab) 
		} 

		const checkInfoCRIRRF = (array: any) => {
	
			if (array.length > 0 && array[0].hasOwnProperty('vrCr') && array[0].hasOwnProperty('vrRendTrib') && array[0].hasOwnProperty('vrRendTrib13')) {

				const { vrCr, vrRendTrib, vrRendTrib13 } = array[0];
	
				return vrCr === 0 && vrRendTrib === 0 && vrRendTrib13 === 0;
			} else {
				return false; 
			}
		}

		const hasInfoCRIRRF = await checkInfoCRIRRF(normalizeValues?.ideTrab[0]?.infoCRIRRF)
		
		if(JSON.stringify(normalizeValues?.ideTrab[0]?.infoCRIRRF) === '{}' || hasInfoCRIRRF) {
			delete normalizeValues?.ideTrab[0]?.infoCRIRRF
		}

		// const invalidPaths = getInvalidPropertyPaths(normalizeValues, {
		// 	indRetif: required,
		// 	tpAmb: required,
		// 	procEmi: required,
		// 	verProc: stringRange(1,20),
		// 	nrInsc: size([8,11,14]),
		// 	nrProcTrab: size([15, 20]),
		// 	cpfTrab: required,
		// 	calcTrib: arrayRange(1, 999)
		// })

		// if (invalidPaths.length) {
		// 	setSubmitting(false)
		// 	return modal({
		// 		title: 'Erros de validação',
		// 		component: <Table 
		// 			columns={[{ label: "Erros", field: "error" },]} 
		// 			rows={translateErrors(invalidPaths, t, "eSocial:validation").map((item)=>({error: item}))}
		// 		/>,
		// 		buttons: [],
		// 		dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
		// 	})
		// }

	
		const onAddNormalizeValues = await removeDeletedObjects(normalizeValues);
		const onEditNormalizeValues = await convertCurrencyStrings(normalizeValues);

		
		if (values.submitAction === "save") {
			delete normalizeValues.submitAction
			setSubmitting(true)
			if (isNew) return dispatch(addESocialEventLauch(onAddNormalizeValues));
			dispatch(editESocialEventLauch(onEditNormalizeValues)); 
			return
		}
		delete normalizeValues.submitAction
		try {
			// await api.edit({...normalizeValues, sajDelete: true});
			await api.sendToSAP({id:normalizeValues.id, sajDelete: true});
			enqueueSnackbar('Evento excluido com sucesso', { variant: 'success' });
			history.push(pathname.replace(/\/[^/]+$/, ''))
			return;

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
			<IdeProc />
			<IdeTrab />
		</FormCore>
	);
};

export default FormDefault;

