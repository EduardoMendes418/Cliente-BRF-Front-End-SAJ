import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Grid } from '@material-ui/core';

import Form, { TextField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import {
	getGuaranteeMethod,
	addGuaranteeMethod,
	editGuaranteeMethod,
} from 'src/core/store/modules/guarantee-method/thunks';
import {
	getItemGuaranteeMethod,
	getLoadingGuaranteeMethod,
	getStatusGuaranteeMethod as getStatus,
	getErrorMessageGuaranteeMethod as getErrorMessage,
} from 'src/core/store/modules/guarantee-method/selectors';
import { TGuaranteeMethod } from 'src/core/models/guarantee-method';
import { useRegisterDefault } from 'src/hooks';
import { actions, AppDispatch } from 'src/core/store';
import { useSnackbar } from 'notistack';

const GuaranteeMethodForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory()

	const loading = useSelector(getLoadingGuaranteeMethod);
	const statusSubmit = useSelector(getStatus);
	const { description, status } = useSelector(getItemGuaranteeMethod);

	const isNew = id === 'novo';

	useEffect(() => {
		if (id && !isNew) dispatch(getGuaranteeMethod(Number(id)));
		return () => { dispatch(actions.guaranteeMethod.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'guaranteeMethod',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = async (values: TGuaranteeMethod) => {
		if (isNew) {
			const { type, payload } = await dispatch(addGuaranteeMethod({ status: true, ...values }))
			if (type === "guaranteeMethod/add/rejected") {
				enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
				return
			}
		}
		else {
			const { type, payload } = await dispatch(editGuaranteeMethod({ status, ...values, id }))
			if (type === "guaranteeMethod/edit/rejected") {
				enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
				return
			}
		}

		history.goBack()
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={{ description: description ?? '' }}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t(
								isNew ? 'tituloFormularioNovo' : 'tituloFormularioEdicao',
								{ title: t('goodsAndGuarantees:guaranteeMethod').toLowerCase() }
							)}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{
								loading
									? <CircularProgress className='margin-top-16 align-center' />
									: (
										<Grid container spacing={2}>
											<Grid item md={3} xs={12}>
												<TextField
													label={t('goodsAndGuarantees:guaranteeMethod')}
													name='description'
													required
												/>
											</Grid>
										</Grid>
									)
							}
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default GuaranteeMethodForm;
