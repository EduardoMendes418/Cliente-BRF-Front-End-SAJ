import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Formik, useFormikContext } from 'formik';
import { set, lensIndex } from 'ramda';

import Panel from 'src/components/Panel';
import Table from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { SelectField, TOptionsSelect } from 'src/components/form'
import { Submit } from 'src/components/button'

import { useTranslation } from 'src/locale/i18n';
import { useHierarchy } from 'src/hooks/fetchLists';
import { getLoadingAreasDEJUR } from 'src/core/store/modules/areas/selectors';

import { modal } from 'src/components/modals';

import { TOrderConfrontingType, TOrderConfronting } from 'src/core/models/confronting-parameters';

import FormEditFlowApproval from './FlowEditFlowApproval'
import { flowDictionary, flowOptions } from '../utils/constants';
import { v4 } from 'uuid';
import { useSnackbar } from 'notistack';

type Props = {
	title: string;
	isNew: boolean;
	disabled: boolean;
	submitting: boolean;
	optionsField?: TOptionsSelect[];
}

type TRows = {
	id: number;
	confrontingParameterId: number;
	hierarchy: string;
	hierarchyCode: string;
	optionsField?: TOptionsSelect[];

	level: string;
	transcienteId: number;
}

const FlowApprovalForm = ({ title, isNew, disabled, submitting }: Props) => {
	const { t } = useTranslation();
	const { values, setFieldValue, status } = useFormikContext<TOrderConfrontingType>()

	const [list, setList] = useState<TOrderConfronting[]>([])

	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [pageSize, setPageSize] = useState(10)

	const isFetching = useSelector(getLoadingAreasDEJUR);
	const { hierarchyAsOptions } = useHierarchy();
	const { enqueueSnackbar } = useSnackbar();

	const columns = [
		{
			label: t('provisions:orderConfrontingParameters.flowType'),
			field: 'flow',

		},
		{
			label: t('provisions:orderConfrontingParameters.flowHierarchyType'),
			field: 'hierarchy',

		},
	];

	const optionsField = useMemo<TOptionsSelect[]>(() => {
		return hierarchyAsOptions.map(({ label, value }) => ({ value, label }))
	}, [hierarchyAsOptions])

	const onSubmitAdd = useCallback(
		({ codigoHierarquia, level }, { resetForm }) => {
			const indexHierarchy = hierarchyAsOptions.findIndex((item) => item.value === codigoHierarquia)

			if (indexHierarchy > -1) {
				const hierarquia = hierarchyAsOptions[indexHierarchy].label;
				const transcienteId = v4()

				const confrontingParameterHierarchies = values.confrontingParameterHierarchies ?? []
				const newConfrontingParameterHierarchies = [
					...confrontingParameterHierarchies,
					{
						transcienteId: transcienteId,
						hierarchyCode: codigoHierarquia,
						hierarchy: hierarquia,
						level: Number(level),
						flow: flowDictionary[level]
					}
				]


				  const filteredByLevel = newConfrontingParameterHierarchies.filter((item) => Number(item.level) === Number(level)).filter((item) => item.hierarchyCode === codigoHierarquia)


				  if(filteredByLevel.length > 1){
					enqueueSnackbar('Registro duplicado!', { variant: "error" })
					resetForm()
				  } else {
					setFieldValue('confrontingParameterHierarchies', newConfrontingParameterHierarchies)
					resetForm()
				  }


			}
		},
		[hierarchyAsOptions, values.confrontingParameterHierarchies, enqueueSnackbar, setFieldValue]
	);

	const onSubmitEdit = useCallback(
		({ id, transcienteId, flowTypeEdit, hierarchyEdit, hierarchyCode }) => {
			const indexHierarchy = hierarchyAsOptions.findIndex((item) => item.value === hierarchyEdit)
			const hierarquia = hierarchyAsOptions[indexHierarchy].label;

			const idKey = id ? "id" : "transcienteId"
			const idValue = id ? id : transcienteId

			if (!values.confrontingParameterHierarchies.some(item => item.hierarchy === hierarquia && item.level === flowTypeEdit)) {
				const index = values.confrontingParameterHierarchies.findIndex((item) => item[idKey] === idValue)

				const newOrderConfronting = set(
					lensIndex(index),
					{
						id,
						transcienteId,
						hierarchy: hierarquia,
						hierarchyCode: hierarchyEdit,
						level: flowTypeEdit,
					},
					values.confrontingParameterHierarchies
				)
				setFieldValue('confrontingParameterHierarchies', newOrderConfronting)
				return true;
			}
		},
		[values.confrontingParameterHierarchies, setFieldValue, hierarchyAsOptions]
	);

	const onEdit = useCallback(
		async ({ id, transcienteId, hierarchy, level }: TRows) => {
			const hierarchyValue = optionsField.filter((item) => item.label === hierarchy).toString()

			const component = (
				<FormEditFlowApproval
					initialValues={{ id, transcienteId, hierarchyEdit: hierarchyValue, flowTypeEdit: level }}
					onSubmitEdit={onSubmitEdit}
					optionsField={optionsField}
				/>
			)

			modal({
				title,
				component,
				buttons: [],
				dialogProps: { maxWidth: 'lg', showCloseButton: true },
			})
		},
		[title, onSubmitEdit, optionsField]
	);

	const onDelete = useCallback(
		({ transcienteId, id }: TRows) => {
			const idKey = id ? "id" : "transcienteId"
			const idValue = id ? id : transcienteId

			const value = values.confrontingParameterHierarchies.filter(item => item[idKey] !== idValue)
			setFieldValue('confrontingParameterHierarchies', value)
		},
		[values.confrontingParameterHierarchies, setFieldValue],
	);

	useEffect(() => {
		const confrontingParameterHierarchies = values.confrontingParameterHierarchies ?? []
		setPageCount(Math.ceil(confrontingParameterHierarchies.length / pageSize))
	}, [values.confrontingParameterHierarchies, pageSize]);

	useEffect(() => {
		setPageCurrent(1);
	}, [pageSize])

	useEffect(() => {
		if (values.confrontingParameterHierarchies) {
			const newRows = values.confrontingParameterHierarchies.map(({ transcienteId, id, hierarchy, level, hierarchyCode }) => ({
				transcienteId,
				hierarchy,
				flow: flowDictionary[level],
				level,
				id,
				hierarchyCode
			}))

			const initial = (pageCurrent - 1) * pageSize
			const list = newRows.slice(initial, initial + pageSize).sort((x, y) => {
				return x.flow.localeCompare(y.flow)
			})

			setList(list)
		}
	}, [values.confrontingParameterHierarchies, pageCurrent, pageSize]);


	return (
		<Panel
			title={title}
			slotBottomRight={
				< Submit
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
								initialValues={{ level: '', codigoHierarquia: '' }}
							>
								{({ handleSubmit, dirty }) => (
									<Grid container spacing={6} >
										<Grid item md={3} xs={12} >
											<SelectField
												name="level"
												label={t('provisions:orderConfrontingParameters.flowType')}
												options={flowOptions}
												required
											/>
										</Grid>
										< Grid item md={3} xs={12} >
											<SelectField
												name="codigoHierarquia"
												label={t('provisions:orderConfrontingParameters.flowHierarchyType')}
												options={optionsField}
												required
											/>
										</Grid>
										< Grid item >
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
						</>
					)
			}
			<Table
				columns={columns}
				rows={list}
				onEdit={status === 'readOnly' ? undefined : onEdit}
				onDelete={onDelete}
				isLoading={isFetching}
			/>
			<Pagination
				page={pageCurrent}
				pageCount={pageCount}
				pageSize={pageSize}
				onChangePage={setPageCurrent}
				onChangePageSize={setPageSize}
			/>
		</Panel>
	)
}

export default FlowApprovalForm