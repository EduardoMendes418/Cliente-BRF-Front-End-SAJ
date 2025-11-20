import moment from "moment";
import { FormikHelpers } from "formik";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Table from "src/components/Table";
import { t } from "src/locale/i18n";
import { modal } from "src/components/modals";
import { ESocialS3500 } from "src/core/models/eSocial";
import { getSearchEventLauch } from "src/core/store/modules/e-social-event-launch/selectors";
import { 
	required, 
	size, 
	stringRange, 
	translateErrors 
} from "src/core/utils/modalFromValidation";
import { 
	getInvalidPropertyPaths, 
	modifyProperty, 
	toCleanedId 
} from "src/core/utils/func";
import {
	addESocialEventLauch,
	editESocialEventLauch,
} from "src/core/store/modules/e-social-event-launch/thunks";
import IdeProcTrab from "./IdeProcTrab";
import InfoExclusao from "./InfoExclusao";
import EventIdentification from "./EventIdentification";
import InProvidingInformation from "../S2500/InProvidingInformation";
import FormCore from "../../common/FormCore";

const FormDefault = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const search = useSelector(getSearchEventLauch);

	const initialValues: ESocialS3500 = {
		id: 0,
		accrualMonth: null,
		processId: "",
		eventLaunchBaseId: null,
		dateOfSubmissionToTheGovernment: null,
		eventCode: 1,
		eventLaunchStatus: 1,
		ideEmpregadorTpInsc: '',
		ideEmpregadorNrInsc: '',
		verProc: '',
		tpEvento: '',
		nrRecEvt: '',
		nrProcTrab: '',
		cpfTrab: '',
		perApurPgto: '',
		/* ideSeqProc :"", */
		process: null
	};

	const onSubmit = (
		values: ESocialS3500,
		{ setSubmitting }: FormikHelpers<ESocialS3500>
	) => {
		delete values.submitAction
		const normalizeValues = {
			...initialValues,
			...values,
			...search,
			perApurPgto: moment(values.perApurPgto).format("YYYY-MM"),
		};
		delete normalizeValues.process

		const invalidPaths = getInvalidPropertyPaths(normalizeValues, {
			indRetif: required,
			verProc: stringRange(1,20),
			tpInsc: required,
			nrInsc: size([8, 11, 14]),
			tpEvento: size([6]),
			nrRecEvt: size([23]),
			nrProcTrab: size([15,20]),
		})

		if (invalidPaths.length) {
			setSubmitting(false)
			return modal({
				title: 'Erros de validação',
				component: <Table
					columns={[{ label: "Erros", field: "error" },]} 
					rows={translateErrors(invalidPaths, t, "eSocial:validation")?.map((item)=>({error: item}))}
				/>,
				buttons: [],
				dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
			})
		}

		modifyProperty(normalizeValues, [
			"ideEmpregadorTpInsc",
			"ideEmpregadorNrInsc",
			"cpfTrab",
		], toCleanedId);

		setSubmitting(true);
		if (isNew) return dispatch(addESocialEventLauch(normalizeValues));
		dispatch(editESocialEventLauch(normalizeValues));
	};

	return (
		<FormCore
			isSapButtonVisible
			onSubmit={onSubmit}
			customInitialValues={initialValues}
			editable
		>
			<EventIdentification />
			<InProvidingInformation />
			<InfoExclusao />
			<IdeProcTrab />
		</FormCore>
	);
};

export default FormDefault;

