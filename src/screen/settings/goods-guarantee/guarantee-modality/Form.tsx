import { Grid, CircularProgress } from '@material-ui/core';
import * as yup from 'yup';
import { t, useTranslation } from 'src/locale/i18n';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Form, { TextField, SelectField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import {
	getGuaranteeModality,
	addGuaranteeModality,
	editGuaranteeModality,
} from 'src/core/store/modules/guarantee-modality/thunks';
import {
	getItemGuaranteeModality,
	getLoadingGuaranteeModality,
	getStatusGuaranteeModality as getStatus,
	getErrorMessageGuaranteeModality as getErrorMessage,
} from 'src/core/store/modules/guarantee-modality/selectors';
import { getLoadingGuaranteeMethod } from 'src/core/store/modules/guarantee-method/selectors';
import { TGuaranteeModality } from 'src/core/models/guarantee-modality';
import { actions } from 'src/core/store';
import { Submit } from 'src/components/button';
import { useRegisterDefault } from 'src/hooks';
import { useGuaranteeMethod } from 'src/hooks/fetchLists';
import { optionsTypeFlow } from '../../constants';
import { approvalProcessTypeOption } from "src/core/utils/constants"

const validationSchema = yup.object({
	guaranteeMethodIds: yup
		.array()
		.of(yup.number())
		.min(1, t('required'))
		.required(t('required')),
	typeFlow: yup.number().required(t('required'))
});

const GuaranteeModalityForm = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const {
		description,
		guaranteeMethodIds,
		processType,
		status,
		typeFlow
	} = useSelector(getItemGuaranteeModality);
	const loadingGuaranteeModality = useSelector(getLoadingGuaranteeModality);
	const statusSubmit = useSelector(getStatus);
	const loadingGuaranteeMethod = useSelector(getLoadingGuaranteeMethod);

	const loading = loadingGuaranteeModality || loadingGuaranteeMethod
	const isNew = id === 'novo';
	const initialValues = {
		description: description ?? '',
		guaranteeMethodIds: guaranteeMethodIds ?? [],
		processType: processType ?? '',
		typeFlow: typeFlow ?? ''
	}

	const { guaranteeMethodAsOptions } = useGuaranteeMethod();

	useEffect(() => {
		if (id && !isNew) dispatch(getGuaranteeModality(Number(id)));
		return () => { dispatch(actions.guaranteeModality.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'guaranteeModality',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = (values: TGuaranteeModality) => {
		if (isNew) dispatch(addGuaranteeModality({ status, ...values }));
		else dispatch(editGuaranteeModality({ status, ...values, id: Number(id) }));
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={
								t(isNew
									? 'tituloFormularioNovo'
									: 'tituloFormularioEdicao', { title: t('goodsAndGuarantees:guaranteeModality').toLowerCase() })
							}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{
								loading
									? <CircularProgress className='margin-top-16 align-center' />
									: (
										<Grid container spacing={3}>
											<Grid item md={3} xs={12}>
												<TextField
													label={t('goodsAndGuarantees:guaranteeModality')}
													name='description'
													maxLength={200}
													required
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<SelectField
													label={t('goodsAndGuarantees:guaranteeMethod')}
													name='guaranteeMethodIds'
													options={guaranteeMethodAsOptions}
													required
													multiple
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<SelectField
													label={t('Pagamentos:tipoPagamentoForm.processType')}
													name='processType'
													required
													options={approvalProcessTypeOption}
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<SelectField
													label={t('goodsAndGuarantees:form.typeFlow')}
													name='typeFlow'
													required
													options={optionsTypeFlow}
												/>
											</Grid>
										</Grid>
									)
							}
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)
				}
			</Form>
		</ScreenTemplate>
	);
};


export default GuaranteeModalityForm;
