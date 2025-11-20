import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Typography, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import Table, { ColumnData } from 'src/components/Table'
import { t } from 'src/locale/i18n'
import { getRatings } from 'src/core/store/modules/provision-order/selectors'
import { deleteOrderRating } from 'src/core/store/modules/provision-order'
import { groupOrderRatingsByDescrition } from '../utils/func';
import { TGroupedOrderRatingProbabilities, TProvisionOrderForm } from "src/core/models/provision-order"

type OrderRatingTableProps = {
	isEditable: boolean
	setFormValues: (overrideValues: Partial<TProvisionOrderForm>) => void
	enableEditingOrderRating: () => void,
}

function OrderRatingTable({ isEditable, setFormValues, enableEditingOrderRating }: OrderRatingTableProps) {
	const dispatch = useDispatch()

	const ratings = useSelector(getRatings)
	const rows = groupOrderRatingsByDescrition(ratings)

	const sendOrderRatingToEditForm = (row: TGroupedOrderRatingProbabilities) => {
		const { orderRatingDescription, formulaCorrectionRule, ...rest } = row
		setFormValues(rest)
		enableEditingOrderRating()
	}

	const handleDelete = (row: any) => {
		if (row.transientId)
			dispatch(deleteOrderRating(row))
	}

	const openingTableColumns: ColumnData[] = [
		{
			label: 'Ações',
			field: 'action',
			component: (row: any) => {
				return (
					<>
						<IconButton aria-label='edit' onClick={() => sendOrderRatingToEditForm(row)}>
							{!isEditable ? <VisibilityIcon /> : <EditIcon />}
						</IconButton>
						{row.transientId && (
							<IconButton onClick={() => handleDelete(row)}>
								<DeleteIcon color='error' />
							</IconButton>
						)}
					</>
				)
			},
			type: 'custom'
		},
		{
			label: t('provisions:request.table.openingDescription'),
			field: 'orderRatingDescriptionId',
			component: (row: TGroupedOrderRatingProbabilities) => row.orderRatingDescription,
			type: 'custom'
		},
		{
			label: t('provisions:request.table.riskValue'),
			field: 'riskValue',
			type: 'currency'
		},
		{
			label: t('provisions:request.table.probableValue'),
			field: 'probableValue',
			type: 'currency'
		},
		{
			label: t('provisions:request.table.possibleValue'),
			field: 'possibleValue',
			type: 'currency'
		},
		{
			label: t('provisions:request.table.remoteValue'),
			field: 'remoteValue',
			type: 'currency'
		},
		{
			label: t('provisions:request.table.baseDate'),
			field: 'dataBase',
			type: 'date'
		},
		{
			label: t('provisions:request.table.correctionIndex'),
			field: 'formulaCorrectionRuleId',
			component: (row: TGroupedOrderRatingProbabilities) => row.formulaCorrectionRule,
			type: 'custom'
		},
	]

	return (
		<Grid container>
			<Grid item xs={12}>
				<Box marginX={0} marginY={3}>
					<Typography variant='h3'>
						{t('provisions:request.openingListTitle')}
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Table
					rows={rows}
					columns={openingTableColumns}
				/>
			</Grid>
		</Grid>
	)
}

export default memo(OrderRatingTable)
