import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormikContext } from 'formik'
import { useSnackbar } from 'notistack'
import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined'

import Panel from 'src/components/Panel'
import { SelectField, TextField } from 'src/components/form'
import Table, { ColumnData } from 'src/components/Table'
import { Variable, VariableForm } from 'src/core/models/legal-document-draft-types'
import {
	setVariableOnEdition,
	clearVariableOnEdition,
	addVariable,
	editVariable,
	changeVariableIsActive,
} from 'src/core/store/modules/legal-document-draft-types'
import { getBlocksAsDictionary, getBlocksAsOptions, getIsVariableOnEdition, getVariables } from 'src/core/store/modules/legal-document-draft-types/selectors'
import { getListLegalDocTablesAsOptions, getListLegalDocTablesFieldDictionary } from 'src/core/store/modules/legal-document-tables/selectors'
import { setVariableIsActiveLegalDocDraftTypes } from 'src/core/store/modules/legal-document-draft-type-variables/thunk'
import { getLegalDocTables } from 'src/core/store/modules/legal-document-tables/thunks'
import { AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import { DraftTypeCompleteForm } from '../Form'
import { validateRequiredKeys } from '../utils/validateRequeriedKeys'

export default function VariablesTable() {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const { values, setFieldValue, setFieldError } = useFormikContext<DraftTypeCompleteForm>()

	const variables = useSelector(getVariables)
	const isVariableOnEdition = useSelector(getIsVariableOnEdition)
	const blocksAsOptions = useSelector(getBlocksAsOptions)
	const blocksDictionary = useSelector(getBlocksAsDictionary)
	const tableOptions = useSelector(getListLegalDocTablesAsOptions)
	const fieldsDictionary = useSelector(getListLegalDocTablesFieldDictionary)

	const variablesList = useMemo(() => variables.map(variable => {
		const fieldInfo = fieldsDictionary[variable.legalDocumentTableVariableId] ?? {}
		const tableInfo = fieldInfo.table ?? {}
		let blockName = ''

		if (variable.transientBlockId)
			blockName = blocksDictionary.byTransientId[variable.transientBlockId].name
		if (variable.legalDocumentDraftTypeBlockId)
			blockName = blocksDictionary.byId[variable.legalDocumentDraftTypeBlockId].name

		return {
			...variable,
			blockName,
			tableName: tableInfo.description || tableInfo.name || '',
			fieldName: fieldInfo.description || fieldInfo.field || '',
		}
	}), [variables, blocksDictionary, fieldsDictionary])

	const fieldsOptions = useMemo(() => {
		if (values.tableId) {
			const currentTable = tableOptions.find(table => table.value === values.tableId)
			return currentTable?.variables || []
		}
		return []
	}, [tableOptions, values.tableId])

	const handleClearFields = () => {
		setFieldValue('variableName', '')
		setFieldValue('tableId', '')
		setFieldValue('variableId', '')
		setFieldValue('blockId', '')
		dispatch(clearVariableOnEdition())
	}

	const handleAddVariable = () => {
		const { variableName, tableId, variableId, blockId } = values
		const success = validateRequiredKeys({ variableName, tableId, variableId }, setFieldError)
		if (!success) return

		const newVariable: VariableForm = {
			name: variableName,
			legalDocumentTableVariableId: variableId as number,
		}

		if (blockId !== '') {
			const selectedBlock = blocksDictionary.byTransientId[blockId]
			const selectedBlockHasId = selectedBlock.id !== undefined
			if (selectedBlockHasId)
				newVariable.legalDocumentDraftTypeBlockId = selectedBlock.id
			if (!selectedBlockHasId)
				newVariable.transientBlockId = selectedBlock.transientId
		}
		dispatch(addVariable(newVariable))
		handleClearFields()
	}

	const handleSetEdition = (row: Variable) => {
		const field = fieldsDictionary[row.legalDocumentTableVariableId]
		let transiendBlockId = ''
		if (row.legalDocumentDraftTypeBlockId)
			transiendBlockId = blocksDictionary.byId[row.legalDocumentDraftTypeBlockId].transientId

		dispatch(setVariableOnEdition(row))
		setFieldValue('variableName', row.name)
		setFieldValue('tableId', field.legalDocumentTableId)
		setFieldValue('variableId', row.legalDocumentTableVariableId)
		setFieldValue('blockId', transiendBlockId || row.transientBlockId)
	}

	const handleEditVariable = () => {
		const { variableName, tableId, variableId, blockId } = values
		const success = validateRequiredKeys({ variableName, tableId, variableId }, setFieldError)
		if (!success) return

		const newVariable: VariableForm = {
			name: variableName,
			legalDocumentTableVariableId: variableId as number,
		}

		if (blockId !== '') {
			const selectedBlock = blocksDictionary.byTransientId[blockId]
			const selectedBlockHasId = selectedBlock.id !== undefined
			if (selectedBlockHasId)
				newVariable.legalDocumentDraftTypeBlockId = selectedBlock.id
			if (!selectedBlockHasId)
				newVariable.transientBlockId = selectedBlock.transientId
		}

		dispatch(editVariable(newVariable))
		handleClearFields()
	}

	const handleEnableDisable = useCallback(async (row: Variable) => {
		dispatch(changeVariableIsActive({ transientId: row.transientId, value: !row.isActive }))
		if (row.id) {
			const { type, payload } = await dispatch(setVariableIsActiveLegalDocDraftTypes({ id: row.id, isActive: !row.isActive }))
			if (type.endsWith('/rejected')) {
				enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), { variant: 'error' })
			}
		}
	}, [dispatch, enqueueSnackbar])

	const variableColumns: ColumnData[] = useMemo(() => [
		{
			label: t('legalDocs:draftTypes.field.variables'),
			field: 'name'
		},
		{
			label: t('legalDocs:draftTypes.field.table'),
			field: 'tableName'
		},
		{
			label: t('legalDocs:draftTypes.field.field'),
			field: 'fieldName'
		},
		{
			label: t('legalDocs:draftTypes.field.block'),
			field: 'blockName'
		},
		{
			label: t('status'),
			field: 'isActive',
			type: 'switch-button',
			permission: 'edit',
			onChange: handleEnableDisable
		}
	], [handleEnableDisable])

	useEffect(() => {
		dispatch(getLegalDocTables())
	}, [dispatch])

	return (
		<Panel
			title={t('legalDocs:draftTypes.section.variables')}
			withPadding
		>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<TextField name='variableName' label={t('legalDocs:draftTypes.field.variable')} />
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t('legalDocs:draftTypes.field.table')}
						name="tableId"
						options={tableOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t('legalDocs:draftTypes.field.field')}
						name="variableId"
						options={fieldsOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t('legalDocs:draftTypes.field.block')}
						name="blockId"
						options={blocksAsOptions}
					/>
				</Grid>
				<Grid container item justifyContent='flex-end' alignItems='center' xs={12}>
					<IconButton
						type="button"
						color='primary'
						onClick={isVariableOnEdition ? handleEditVariable : handleAddVariable}
					>
						{isVariableOnEdition ? <SaveOutlinedIcon/> : <AddOutlinedIcon />}
					</IconButton>

					<Button
						variant="outlined"
						onClick={handleClearFields}
						style={{ marginLeft: '16px' }}
					>
						{t('clear')}
					</Button>
				</Grid>

				<Grid item xs={12}>
					<Typography variant='h3'>
						{t('legalDocs:draftTypes.section.variableList')}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Table
						rows={variablesList}
						columns={variableColumns}
						onEdit={handleSetEdition}
					/>
				</Grid>
			</Grid>
		</Panel>
	)
}
