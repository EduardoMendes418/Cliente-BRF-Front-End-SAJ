import { ChangeEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, FormControlLabel, Grid, IconButton, Switch, Typography } from '@material-ui/core'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined'

import { TextField } from 'src/components/form'
import Table, { ColumnData } from 'src/components/Table'
import { useCurrentUser } from 'src/config/permissions'
import { t } from 'src/locale/i18n'

import DraftTypeField from './DraftTypeField'
import useDraftTableList, {Item, Option} from '../hooks/useManageDraftTableList'

export default function DraftTypesTables() {
	const {
		list,
		isOnEdit,
		setItemToEdit,
		addItem,
		toggleIsActive,
		editItem,
		clear
	} = useDraftTableList()
	const { id } = useParams<{ id: string }>();
	const { currentScreenPermissions } = useCurrentUser(id)

	const [draftType, setDraftType] = useState<Option|null>(null)
	const [docuSignValue, setDocuSignValue] = useState('')

	const handleAddItem = () => {
		if (!draftType) return
		addItem(draftType, docuSignValue)
		setDraftType(null)
		setDocuSignValue('')
	}

	const handleSetEdition = (item: Item) => {
		setItemToEdit(item)
		setDraftType({ label: item.legalDocumentDraftType?.name || '', value: item.legalDocumentDraftTypeId })
		setDocuSignValue(item.docuSignKey)
	}

	const handleEditItem = () => {
		if (draftType) {
			editItem(draftType, docuSignValue)
			setDraftType(null)
			setDocuSignValue('')
		}
	}

	const onChangeDraftType = (event: ChangeEvent<{}>, value: Option | null) => setDraftType(value)

	const columns: ColumnData[] = [
		{
			label: t('legalDocs:requestTypes.field.draftType'),
			field: 'name',
			type: 'custom',
			component: (row: any) => row.legalDocumentDraftType?.name || '-',
		},
		{
			label: t('legalDocs:requestTypes.field.docuSignKey'),
			field: 'docuSignKey',
		},
		{
			label: t('legalDocs:requestTypes.field.status'),
			field: 'isActive',
			type: 'custom',
			component: (row: Item) => {
				const label = row.isActive ? t('enabled') : t('disabled')
				if (!currentScreenPermissions.del) return label
				return (
					<FormControlLabel
						control={
							<Switch
								checked={row.isActive}
								onChange={() => toggleIsActive(row)}
								name={`switch${row.id || row.transientId}`}
								color='primary'
							/>
						}
						label={label}
					/>
				)
			}
		},
	]

	return (
		<Grid container spacing={3}>
			<Grid item md={12} xs={12}>
				<Typography variant='h3'>
					{t('legalDocs:requestTypes.section.draft')}
				</Typography>
			</Grid>

			<Grid item md={6} xs={12}>
				<DraftTypeField
					label={t('legalDocs:requestTypes.field.draftType')}
					name="autocompleteDraftType"
					value={draftType}
					onChange={onChangeDraftType}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<TextField
					name="docuSignTableKey"
					label={t('legalDocs:requestTypes.field.docuSignKey')}
					value={docuSignValue}
					onChange={(e) => setDocuSignValue(e.target.value)}
				/>
			</Grid>

			<Grid container item justifyContent='flex-start' alignItems='center' md={3} xs={12}>
				<IconButton
					type="button"
					color='primary'
					onClick={isOnEdit ? handleEditItem : handleAddItem}
				>
					{isOnEdit ? <SaveOutlinedIcon/> : <AddOutlinedIcon />}
				</IconButton>

				<Button
					variant="outlined"
					onClick={() => {
						clear()
						setDocuSignValue('')
						setDraftType(null)
					}}
					style={{ marginLeft: '16px' }}
				>
					{t('clear')}
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Table
					rows={list}
					columns={columns}
					onEdit={handleSetEdition}
				/>
			</Grid>
		</Grid>
	)
}
