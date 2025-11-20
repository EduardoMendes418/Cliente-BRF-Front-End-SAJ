
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, CircularProgress, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Formik, useFormikContext } from 'formik';
import * as yup from 'yup';
import { set, lensIndex } from 'ramda';

import Panel from 'src/components/Panel';
import Table from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { SelectField, TextField, TOptionsSelect } from 'src/components/form'
import { Submit } from 'src/components/button'
import {approvalProcessTypeOption} from "src/core/utils/constants"

import { t, useTranslation } from 'src/locale/i18n';
import { TPaymentType } from 'src/core/models/payment-type';
import { useAreasDEJUR, useGroupedAreas } from 'src/hooks/fetchLists';
import { getLoadingAreasDEJUR } from 'src/core/store/modules/areas/selectors';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors'
import { actions } from 'src/core/store';

import { modal } from 'src/components/modals';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

type TFieldsAdd = {
	id?: string | number;
	areaIdAdd: string;
	processTypeAdd: string;
}

type FormEditExceptionRulesProps = {
	optionsField: TOptionsSelect[];
	initialValues: TFieldsAdd;
	onSubmitEdit: any;
}

const validationSchema = yup.object({
	areaIdAdd: yup.string().required(t('required')),
	processTypeAdd: yup.string().required(t('required')),
});

const FormEditExceptionRules = ({
	optionsField,
	initialValues,
	onSubmitEdit,
}: FormEditExceptionRulesProps) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const onSubmit = (values: TFieldsAdd, { setFieldError, setSubmitting }: any) => {
		if (onSubmitEdit(values)) {
			dispatch(actions.modal.close({ modalId }));
		} else {
			setFieldError('areaIdAdd', t('Pagamentos:tipoPagamentoForm.ruleAlreadyRegistered'))
			setSubmitting(false)
		}
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ handleSubmit, dirty, isSubmitting }) => (
				<form onSubmit={handleSubmit} noValidate className="modal-form" >
					<Grid container spacing={3}>
						<Grid item lg={6}>
							<SelectField
								name="areaIdAdd"
								label="Área DEJUR"
								options={optionsField}
								required
							/>
						</Grid>
						<Grid item lg={6}>
							<TextField
								name="processTypeAdd"
								label="Tipo processo aprovação"
								placeholder='Digite aqui'
								required
							/>
						</Grid>
					</Grid>
					<Grid
						container
						direction='row'
						justifyContent='flex-end'
						className='margin-top-24'
					>
						<Submit text={t('btnSalvarEdicao')} submitting={isSubmitting} disabled={!dirty} />
					</Grid>
				</form>
			)}
		</Formik>
	)
}

const LIMIT_PAGE = 4

type Props = {
	title: string;
	isNew: boolean;
	disabled: boolean;
	submitting: boolean;
}

type TRows = {
	id: number;
	areaId: number;
	processType: string;
	dejurArea: string;
}

const ExceptionRulesForm = ({ title, isNew, disabled, submitting }: Props) => {

	const { t } = useTranslation();
	const { values, setFieldValue, status } = useFormikContext<TPaymentType & TFieldsAdd>()

	const [list, setList] = useState<TRows[]>([])

	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)

	const isFetching = useSelector(getLoadingAreasDEJUR);

	const { areas } = useAreasDEJUR();
	const { groupedAreasAsOptions} = useGroupedAreas();

	useEffect(() => {
		setPageCount(Math.ceil(values.exceptionRules.length / LIMIT_PAGE))
	}, [values.exceptionRules.length]);

	useEffect(() => {
		const newRows = values.exceptionRules.map(({ id, processType, areaId }) => ({
			id,
			processType,
			areaId,
			dejurArea: areas.find(({ id }) => id === areaId)?.path ?? '',
		}))

		const initial = (pageCurrent - 1) * LIMIT_PAGE
		const list = newRows.slice(initial, initial + LIMIT_PAGE)

		setList(list)
	}, [values.exceptionRules, areas, pageCurrent]);

	const optionsField = useMemo<TOptionsSelect[]>(() => {
		return areas.map(({ id, path }) => ({ value: id, label: path }))
	}, [areas])

	const columns = [
		{
			label: t('solicitacaoPagamento:processFormData.DEJURArea'),
			field: 'dejurArea',
		},
		{
			label: t('Pagamentos:tipoPagamentoForm.processType'),
			field: 'processType',
		},
	];

	const onSubmitAdd = useCallback(
		({ areaIdAdd, processTypeAdd }, { resetForm }) => {
			setFieldValue('exceptionRules', [
				{ areaId: areaIdAdd, processType: processTypeAdd },
				...values.exceptionRules,
			])
			resetForm()
		},
		[values.exceptionRules, setFieldValue]
	);

	const onSubmitEdit = useCallback(
		({ id, areaIdAdd, processTypeAdd }) => {
			if (!values.exceptionRules.some(item => item.areaId === areaIdAdd)) {
				const index = values.exceptionRules.findIndex((item) => item.id === id)

				const newExceptionRules = set(
					lensIndex(index),
					{ areaId: Number(areaIdAdd), processType: processTypeAdd },
					values.exceptionRules
				)

				setFieldValue('exceptionRules', newExceptionRules)

				return true;
			}
		},
		[values.exceptionRules, setFieldValue]
	);

	const onEdit = useCallback(
		async ({ id, areaId, processType }: TRows) => {

			const component = (
				<FormEditExceptionRules
					optionsField={optionsField}
					initialValues={{ id, areaIdAdd: areaId.toString(), processTypeAdd: processType }}
					onSubmitEdit={onSubmitEdit}
				/>
			)

			modal({
				title,
				component,
				buttons: [],
				dialogProps: { maxWidth: 'lg', showCloseButton: true },
			})
		},
		[title, optionsField, onSubmitEdit]
	);

	const onDelete = useCallback(
		({ areaId }: TRows) => {
			const value = values.exceptionRules.filter(item => item.areaId !== areaId)
			setFieldValue('exceptionRules', value)
		},
		[values.exceptionRules, setFieldValue],
	);

	const validateNewRule = useCallback(({ areaIdAdd }: any) => {
		if (values.exceptionRules.some(({ areaId }) => areaId.toString() === areaIdAdd.toString()))
			return {
				areaIdAdd: t('Pagamentos:tipoPagamentoForm.ruleAlreadyRegistered')
			}
	}, [values.exceptionRules, t])

	return (
		<Panel
			title={title}
			slotBottomRight={<Submit
				isNew={isNew}
				disabled={disabled}
				submitting={submitting}
			/>}
			slotBottonRightPermission={isNew ? 'add' : 'edit'}
			withPadding
		>
			{
				isFetching
					? <CircularProgress className='margin-top-16' />
					: status === 'readOnly' ? null : (
						<>
							<Formik
								onSubmit={onSubmitAdd}
								initialValues={{ areaIdAdd: '', processTypeAdd: '' }}
								validate={validateNewRule}
							>
								{({ handleSubmit, dirty }) => (
									<Grid container spacing={3}>
										<Grid item md={3} xs={12}>
											<GroupedSelectFiledMultiple
												name="areaIdAdd"
												label={t('form.legalDepartmentArea')}
												options={groupedAreasAsOptions}
												required
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												name="processTypeAdd"
												label={t('Pagamentos:tipoPagamentoForm.processType')}
												placeholder={t('form.typeHere')}
												required
												options={approvalProcessTypeOption}
											/>
										</Grid>
										<Grid item>
											<IconButton
												color="primary"
												aria-label="submit"
												onClick={() => handleSubmit()}
												disabled={!dirty}
											>
												<AddIcon />
											</IconButton>
										</Grid>
									</Grid>
								)}
							</Formik>
							<br />
							<br />
							<br />
						</>
					)
			}
			<Table
				columns={columns}
				rows={list.sort((a, b) => a.dejurArea.localeCompare(b.dejurArea))}
				onEdit={status === 'readOnly' ? undefined : onEdit}
				onDelete={status === 'readOnly' ? undefined : onDelete}
				isLoading={isFetching}
			/>
			<Pagination
				page={pageCurrent}
				pageCount={pageCount}
				onChangePage={setPageCurrent}
				pageSize={LIMIT_PAGE}
			/>
		</Panel>
	)
}

export default ExceptionRulesForm
