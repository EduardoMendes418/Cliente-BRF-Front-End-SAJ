
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import api from 'src/core/api/economic-indices';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Formik, useFormikContext } from 'formik';
import * as yup from 'yup';
import { v4 } from 'uuid';
import { set, lensIndex } from 'ramda';
import moment from 'moment';
import _ from 'lodash';
import {
	getStatusEconomicIndices,
} from 'src/core/store/modules/economic-indices/selectors';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { DateField, DecimalField } from 'src/components/form'
import { Button, Submit } from 'src/components/button'

import { t, useTranslation } from 'src/locale/i18n';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors'
import { actions } from 'src/core/store';

import { confirm, modal } from 'src/components/modals';
import { TEconomicIndices } from 'src/core/models/economic-indices';
import UploadFileButton from './UploadFileButton'
import { TEconomicIndicesValues } from 'src/core/models/economic-indices'
import { toNumber } from 'src/core/utils/func';
import { dateValidator } from "src/core/utils/yup-validations";
import { ECONOMIC_INDICES_TYPE } from '../constants';
import useSelectableTable from 'src/hooks/selectableTable';
import { useCurrentUser } from 'src/config/permissions';

type TFieldsAdd = {
	id?: string | number;
	dateAdd: string;
	valueAdd: string;
}

type FormEditProps = {
	initialValues: TFieldsAdd;
	onSubmitEdit: any;
}

const validationSchema = yup.object({
	dateAdd: dateValidator,
	valueAdd: yup.string().required(t('required')),
});

const FormEdit = ({
	initialValues,
	onSubmitEdit,
}: FormEditProps) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);
	

	const onSubmit = (values: TFieldsAdd, { setSubmitting }: any) => {
		const normalizedValues = {
			...values,
			valueAdd: toNumber(values.valueAdd)
		}

		if (onSubmitEdit(normalizedValues)) {
			dispatch(actions.modal.close({ modalId }));
		} else {
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
							<DateField
								name="dateAdd"
								label={t('settings:economicIndices.form.date')}
							/>
						</Grid>
						<Grid item lg={6}>
							<DecimalField
								name="valueAdd"
								label={t('settings:economicIndices.form.value')}
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

type Props = {
	title: string;
	economicIndiceId: string;
	valueType: ECONOMIC_INDICES_TYPE;
	disabled: boolean;
	submitting: boolean;
}

type TRows = {
	id: number;
	date: string;
	value: string;
	checked: boolean;
}

const Form = ({ title, economicIndiceId, valueType, disabled, submitting }: Props) => {

	const { t } = useTranslation();
	const { values, setFieldValue } = useFormikContext<TEconomicIndices & TFieldsAdd>()
	const { id } = useParams<{ id: string }>();
	const statusSubmit = useSelector(getStatusEconomicIndices);
	const isNew = id === 'novo';

	const [list, setList] = useState<TRows[]>([])
	const [isDeleting, setIsDeleting] = useState(false)

	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [pageSize, setPageSize] = useState(10)
	const { enqueueSnackbar } = useSnackbar();

	const { currentScreenPermissions } = useCurrentUser(economicIndiceId)
	const selectableTable = useSelectableTable(list)
	const selectedItemsCount = selectableTable.selectedItems.length || false;

	const columns: ColumnData[] = [
		{
			label: t('settings:economicIndices.form.date'),
			field: 'date',
			type: 'date'
		},
		{
			label: `${valueType === ECONOMIC_INDICES_TYPE.FEE
				? t('settings:economicIndices.form.percentage')
				: t('settings:economicIndices.form.referenceValue')}`,
			field: 'value',
		},
	];

	const showErrorModal = (title: string) => {
		const component = (<div>{t('settings:economicIndices.form.modalErrorText')}</div>);

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true },
		})
	}

	const getFormattedEconomicIndicesValues = (contentFile: string): TEconomicIndicesValues[] => {
		try {
			const contentFileWithNoQuotes = contentFile.replace(/['"]+/g, '')
			const contentFileRows = contentFileWithNoQuotes.split('\n').filter(row => row)
			const economicIndicesValues = contentFileRows.map(row => {
				const columns = row.split(';')
				if (!moment(columns[0], "DD/MM/YYYY", true).isValid() || columns[1] === "") throw new Error('Invalid format')

				return {
					id: 0,
					date: moment(columns[0], "DD/MM/YYYY", true).format('YYYY-MM-DD'),
					value: columns[1]
				}
			})

			if (!economicIndicesValues || !economicIndicesValues.length) throw new Error('Empty file');

			return economicIndicesValues
		} catch (err: any) {
			const error = err.message === 'Empty file' ? t('validations.emptyFile') : t('validations.invalidFileContent');
			showErrorModal(error);
			return [];
		}
	}

	const isValidFile = (files: FileList | null): boolean => {
		return !!files?.length && files[0].name.split('.').pop() === 'csv';
	}

	const onMultipleSubmitAdd = useCallback((economicIndicesValues: TEconomicIndicesValues[]) => {
		const actualIndices = values.economicIndicesValues;

		/// CASO CADASTRO VAZIO
		if (actualIndices.length === 0) {
			setFieldValue('economicIndicesValues', economicIndicesValues);
			return;
		}

		const economicIndices: TEconomicIndicesValues[] = [];

		/// MERGE PLANILHA COM CADASTRO ATUAL
		economicIndicesValues.forEach(indice => {
			const exists = actualIndices.find(({ date }) => {
				return indice.date.replace('T00:00:00', '') === date.replace('T00:00:00', '')
			});

			exists
				? economicIndices.push({ ...exists, id: exists.id, date: exists.date.replace('T00:00:00', ''), value: indice.value })
				: economicIndices.push({ ...indice, date: indice.date.replace('T00:00:00', '')});
		});

		/// MERGE RESIDUAL CADASTRO ATUAL
		const diff = _.differenceBy(actualIndices, economicIndices, 'id');

		setFieldValue('economicIndicesValues', [...economicIndices, ...diff]);
	}, [values, setFieldValue])


	const handleChange = (event: ChangeEvent) => {
		const { files } = event.target as HTMLInputElement;

		if (!isValidFile(files)) {
			showErrorModal(t('validations.invalidFileFormat'));
			return;
		}

		const reader = new FileReader();
		files && reader.readAsText(files[0]);
		reader.onload = function (loadedEvent: any) {
			const economicIndicesValuesFromFile = getFormattedEconomicIndicesValues(loadedEvent.target.result)
			onMultipleSubmitAdd(economicIndicesValuesFromFile)
		}
	};

	const handleOnCheckedChange = (id: number) => {
		selectableTable.changeSelectedItems(id);
	}

	const handleOnCheckedAllChange = () => {
		selectableTable.handleOnSelectAllItems();
	}

	const onSubmitAdd = useCallback(
		({ dateAdd, valueAdd }, { resetForm }) => {
			const dates = values.economicIndicesValues.map(({ date }) => moment(new Date(date)).format('YYYY-MM-DD')) as string[];
			const index = dates.findIndex((data) => data === dateAdd)
			const newEconomicIndicesValues = [...values.economicIndicesValues]

			if (index === -1) newEconomicIndicesValues.unshift({ date: dateAdd, value: valueAdd, id: v4() as unknown as number })
			else newEconomicIndicesValues[index] = { date: dateAdd, value: valueAdd, id: newEconomicIndicesValues[index].id };

			setFieldValue('economicIndicesValues', newEconomicIndicesValues)
			resetForm()
		},
		[values.economicIndicesValues, setFieldValue]
	);

	const onSubmitEdit = useCallback(
		({ id, dateAdd, valueAdd }) => {
			const index = values.economicIndicesValues.findIndex((item) => item.id === id)
			const occurrence = values.economicIndicesValues.find((item) => item.id === id)

			const newOccurrence = set(
				lensIndex(index),
				{ 	...occurrence,
					date: dateAdd,
					value: Number(valueAdd) },
				values.economicIndicesValues
			)

			setFieldValue('economicIndicesValues', newOccurrence)
			return true;
		},
		[values.economicIndicesValues, setFieldValue]
	);

	const onEdit = useCallback(
		async ({ id, date, value }: TRows) => {
			const component = (
				<FormEdit
					initialValues={{ id, dateAdd: date, valueAdd: value.toString() }}
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
		[title, onSubmitEdit]
	);

	const onDelete = useCallback(() => {
			const value = values.economicIndicesValues.filter(item => !selectableTable.selectedItems.includes(item.id as number))
			setFieldValue('economicIndicesValues', value)
			selectableTable.unselectAllItems();
		},
		[
			values.economicIndicesValues,
			setFieldValue,
			selectableTable
		]
	);

	useEffect(() => {
		setPageCount(Math.ceil(values.economicIndicesValues.length / pageSize))
	}, [values.economicIndicesValues.length, pageSize]);

	useEffect(() => {
		setPageCurrent(1);
	}, [pageSize])

	useEffect(() => {
		const newRows = values.economicIndicesValues.map(({ id, date, value }) => ({
			id,
			date,
			value,
		}))

		const initial = (pageCurrent - 1) * pageSize
		const list = newRows
			.sort((item1, item2) => new Date(item2.date).getTime() - new Date(item1.date).getTime())
			.slice(initial, initial + pageSize)

		const normalizedlist = list.map(row => {
			return {
				...row,
				id: row.id as number,
				value: row.value.toString().replace('.', ','),
				checked: false
			}
		})
		setList(normalizedlist)

	}, [values.economicIndicesValues, pageCurrent, pageSize]);

	return (
		<Panel
			title={title}
			slotBottomRight={
				<Box display='flex'>
					{
						selectedItemsCount
							?   <Box marginRight={1}>
									<Button
										text={`Deletar ${selectedItemsCount === 1 ? 'item' : 'itens'}`}
										onClick={onDelete}
									/>
								</Box>
							:   <Box marginRight={1}>
									 <Button
										text='Deletar tudo'
										submitting={isDeleting}
										onClick={async () => {
											const isConfirm = await confirm("Tem certeza que deseja deletar todos os itens?")
											if (!isConfirm) return null
											setIsDeleting(true)
											setFieldValue('economicIndicesValues', [])
											if(!isNew) {
												try {
													await api.edit({ ...values, id: Number(id), economicIndicesValues: [] })
													enqueueSnackbar(
														t("registerDeleted"),
														{ variant: "success" }
													);
													setIsDeleting(false)
													
												} catch (error) {
													enqueueSnackbar("Algo deu errado", { variant: "error" });
													setIsDeleting(false)
												}

											}
										}}
									/>

								</Box>
					}
					<Submit disabled={disabled} submitting={statusSubmit === "saving"} />
				</Box>
			}
			slotBottonRightPermission={economicIndiceId === 'novo' ? 'add' : 'edit'}
			withPadding
		>
			<Formik
				onSubmit={onSubmitAdd}
				initialValues={{ dateAdd: '', valueAdd: '' }}
				validationSchema={validationSchema}
			>
				{({ handleSubmit, dirty }) => (
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<DateField
								name="dateAdd"
								label={t('settings:economicIndices.form.date')}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<DecimalField
								name="valueAdd"
								label={t('settings:economicIndices.form.value')}
								placeholder='Digite aqui'
								required
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
						<Grid item>
							<UploadFileButton
								onChange={handleChange}
								id="upload-file"
							/>
						</Grid>
					</Grid>
				)}
			</Formik>
			<br />
			<br />
			<br />
			<Table
				columns={columns}
				rows={selectableTable.items}
				onCheckedChange={handleOnCheckedChange}
				onCheckedAllChange={handleOnCheckedAllChange}
				isAllItemsSelected={selectableTable.areAllItemsSelected}
				isCheckboxIndeterminate={
					selectableTable.haveAnySelectedItemFromCurrentPage &&
					!selectableTable.areAllItemsSelected}
				showCheckboxColumn={currentScreenPermissions.edit}
				onEdit={onEdit}
			/>
			<Pagination
				page={pageCurrent}
				pageCount={pageCount}
				pageSize={pageSize}
				onChangePageSize={setPageSize}
				onChangePage={setPageCurrent}
			/>
		</Panel>
	)
}

export default Form
