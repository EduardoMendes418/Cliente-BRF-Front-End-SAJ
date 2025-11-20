import { useEffect, useMemo } from "react";
import { useTranslation } from 'src/locale/i18n';
import { Formik } from 'formik';
import { useSelector, useDispatch } from "react-redux";
import { Box } from '@material-ui/core';
import { useParams } from "react-router-dom";

import ScreenTemplate from 'src/components/Screen';
import { TWatson } from 'src/core/models/watson';
import { actions } from "src/core/store";
import { Submit } from 'src/components/button';
import { fillIfValue } from "src/core/utils/func";

import { getStatusWatson, getItemWatson, getErrorMessageWatson } from "src/core/store/modules/watson/selector";
import { getWatsonItem } from "src/core/store/modules/watson/thunks";
import Fields from 'src/screen/data-import/watson/Form/Fields';
import NameModal from './Modal';
import { modal } from "src/components/modals";
import { useRegisterDefault } from "src/hooks";
import CancelButton from "src/components/button/Cancel";

const Form = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const loading = useSelector(getStatusWatson);
	const item = useSelector(getItemWatson);

	const isNew = id === 'novo';

	const submit = (
		values: TWatson
	) => {
		modal({
			title: t('settings:watson.newFilter'),
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true },
			component: <NameModal valuesWatson={values} isNew={isNew} />
		})
	}
	
	const initialValues: TWatson = useMemo(() => {
		const initialValues: TWatson = {
			nameFilter: '',
			id: '',
			userId: '',
			areaDejur: '',
			statusFilter: true,

			legalDepartamentArea: [],
			folderNumber: '',
			litigationRelationship: '',

			filterBaseGeralContingencyEnum: [],
			filterBaseGeralStatusEnum: [],
			filterBaseGeralSphere: [],
			filterBaseGeralCreationDateStart: null,
			filterBaseGeralCreationDateEnd: null,
			filterBaseGeralProvisionClass: [],

			filterBaseGeralDeadContingencyEnum: [],
			filterBaseGeralDeadStatusEnum: [],
			filterBaseGeralDeadSphere: [],
			filterBaseGeralDeadTerminationDateStart: null,
			filterBaseGeralDeadTerminationDateEnd: null,
			filterBaseGeralDeadProvisionClass: [],

			filterGoodsGuarantesGuaranteeModeId: [],
			filterGoodsGuarantesPaymentType: [],
			filterGoodsGuarantesStatusEnum: [],
			filterGoodsGuarantesBearishReasons: [],

			filterConvertedDepositGuaranteeModeId: [],
			filterConvertedDepositPaymentType: [],
			filterConvertedStatus: [],
			filterConvertedDepositSituationAccountability: [],
			filterConvertedDepositBearishReasons: [],
			filterConvertedDepositApprovalDateStart: null,
			filterConvertedDepositApprovalDateEnd: null,

			filterPaymentStatusApprovalId: [],
			filterPaymentPaymentType: [],
			filterPaymentSapEntryDateStart: null,
			filterPaymentSapEntryDateEnd: null,

			indexSelic: '',
			indexLegalInterest: ''
		}
		return fillIfValue<TWatson>(item, initialValues);
	}, [item])

	useEffect(() => {
		if (!isNew && id) {
			dispatch(getWatsonItem({ id: Number(id) }))
		};
		return () => dispatch(actions.watson.clear());
	}, [dispatch, isNew, id])

	useRegisterDefault({
		action: "watson",
		getStatus: getStatusWatson,
		getErrorMessage: getErrorMessageWatson,
	});

	return <ScreenTemplate>
		<Formik
			initialValues={initialValues}
			onSubmit={submit}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting }) => <form noValidate onSubmit={handleSubmit}>
				<Fields />
				<Box mt="20px" textAlign="right">
					<CancelButton />
					<Submit
						disabled={loading === "saving"}
						submitting={loading === "saving" || isSubmitting}
						text={t('settings:watson.save')}
					/>
				</Box>
			</form>}
		</Formik>
	</ScreenTemplate>

}
export default Form;