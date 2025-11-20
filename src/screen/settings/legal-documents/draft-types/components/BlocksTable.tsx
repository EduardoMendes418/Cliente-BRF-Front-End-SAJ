import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormikContext } from 'formik'
import { useSnackbar } from 'notistack'
import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined'

import AccordionPanel from "src/components/AccordionPanel"
import { TextField } from "src/components/form"
import Table, { ColumnData } from 'src/components/Table'
import { Block } from 'src/core/models/legal-document-draft-types'
import {
	setBlockOnEdition,
	clearBlockOnEdition,
	addBlock,
	editBlock,
	changeBlockIsActive,
} from 'src/core/store/modules/legal-document-draft-types'
import { getBlocks, getIsBlockOnEdition } from 'src/core/store/modules/legal-document-draft-types/selectors'
import { setBlockIsActiveLegalDocDraftTypes } from 'src/core/store/modules/legal-document-draft-type-blocks/thunk'
import { AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import { DraftTypeCompleteForm } from '../Form'
import { validateRequiredKeys } from '../utils/validateRequeriedKeys'

export default function BlocksTable() {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const { values, setFieldValue, setFieldError } = useFormikContext<DraftTypeCompleteForm>()

	const blocks = useSelector(getBlocks)
	const isBlockOnEdition = useSelector(getIsBlockOnEdition)

	const handleClearFields = () => {
		setFieldValue('blockName', '')
		setFieldValue('blockValue', '')
		dispatch(clearBlockOnEdition())
	}

	const handleAddBlock = () => {
		const { blockName, blockValue } = values

		const succeeded = validateRequiredKeys({ blockName, blockValue }, setFieldError)
		if (!succeeded) return
		dispatch(addBlock({ name: blockName, value: blockValue }))
		handleClearFields()
	}

	const handleSetEdition = (row: Block) => {
		dispatch(setBlockOnEdition(row))
		setFieldValue('blockName', row.name)
		setFieldValue('blockValue', row.value)
	}

	const handleEditBlock = () => {
		const { blockName, blockValue } = values

		const succeeded = validateRequiredKeys({ blockName, blockValue }, setFieldError)
		if (!succeeded) return
		dispatch(editBlock({ name: blockName, value: blockValue }))
		handleClearFields()
	}

	const handleEnableDisable = useCallback(async (row: Block) => {
		dispatch(changeBlockIsActive({ transientId: row.transientId, value: !row.isActive }))
		if (row.id) {
			const { type, payload } = await dispatch(setBlockIsActiveLegalDocDraftTypes({ id: row.id, isActive: !row.isActive }))
			if (type.endsWith('/rejected')) {
				enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), { variant: 'error' })
			}
		}
	}, [dispatch, enqueueSnackbar])

	const blockColumns: ColumnData[] = useMemo(() => [
		{
			label: t('legalDocs:draftTypes.field.block'),
			field: 'name'
		},
		{
			label: t('legalDocs:draftTypes.field.blockDescription'),
			field: 'value'
		},
		{
			label: t('status'),
			field: 'isActive',
			type: 'switch-button',
			permission: 'edit',
			onChange: handleEnableDisable
		}
	], [handleEnableDisable])

	return (
		<AccordionPanel title={t('legalDocs:draftTypes.section.blocksList')} startExpanded>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<TextField
						label={t('legalDocs:draftTypes.field.block')}
						name='blockName'
					/>
				</Grid>
				<Grid item md={7} xs={12}>
					<TextField
						multiline
						unlimitedLength
						label={t('legalDocs:draftTypes.field.blockDescription')}
						name='blockValue'
						minRows={5}
					/>
				</Grid>
				<Grid container item justifyContent='flex-start' alignItems='flex-end' md={2} xs={12}>
					<IconButton
						type="button"
						color='primary'
						onClick={isBlockOnEdition ? handleEditBlock : handleAddBlock}
					>
						{isBlockOnEdition ? <SaveOutlinedIcon/> : <AddOutlinedIcon />}
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
						{t('legalDocs:draftTypes.section.blocksList')}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Table
						rows={blocks}
						columns={blockColumns}
						onEdit={handleSetEdition}
					/>
				</Grid>
			</Grid>
		</AccordionPanel>
	)
}
