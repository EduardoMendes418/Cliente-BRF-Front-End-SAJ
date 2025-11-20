import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Typography } from '@material-ui/core'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'

import Panel from 'src/components/Panel'
import Table, { ColumnData } from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { usePagination } from 'src/hooks/pagination'
import { getIsLoadingNotificationListGoodsGuaranteesRequest, getNotificationListGoodsGuaranteesRequest } from 'src/core/store/modules/goods-guarantee/selectors'
import { setAwareNotification, setAnsweredNotification } from 'src/core/store/modules/goods-guarantee/thunks'
import { getDataCurrentUser } from 'src/core/store/modules/currentUser/selectors'
import { TGuaranteesNotification } from 'src/core/models/goods-guarantee'
import { actions } from 'src/core/store'
import { t } from 'src/locale/i18n'
import { getIsLockSystem } from 'src/core/store/modules/lock-system/selectors'


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		panel: {
			marginTop: theme.spacing(4)
		},
		heighlight: {
			'&.Mui-disabled': {
				color: theme.palette.primary.dark,
				backgroundColor: 'transparent',
			},
		},
	})
)

const Home = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()
	const lock = useSelector(getIsLockSystem)

	const { id: userId } = useSelector(getDataCurrentUser)
	const isLoading = useSelector(getIsLoadingNotificationListGoodsGuaranteesRequest)
	const rows = useSelector(getNotificationListGoodsGuaranteesRequest)

	useEffect(() => {
		if (userId) actions.goodsGuaranteesRequest.setNotificationFilters({ userId, page, pageSize })
	}, [page, pageSize, userId])

	const columns: ColumnData[] = useMemo(() => [
		{ label: t('goodsAndGuarantees:dashboard.guaranteeNumber'), field: 'goodsGuaranteesRequestId' },
		{
			label: t('goodsAndGuarantees:dashboard.aware'),
			field: 'isUserAwared',
			type: 'custom',
			component: (row: TGuaranteesNotification) => {
				const { id, isUserAwared } = row
				return (
					<IconButton
						size="small"
						disabled={isUserAwared}
						className={isUserAwared ? classes.heighlight : undefined }
						onClick={() => dispatch(setAwareNotification({ id, isUserAwared: true }))}
					>
						<CheckIcon />
					</IconButton>
				)
			}
		},
		{
			label: t('goodsAndGuarantees:dashboard.answered'),
			field: 'isUserAnswered',
			type: 'custom',
			component: (row: TGuaranteesNotification) => {
				const { id, isUserAnswered } = row
				return (
					<IconButton
						size="small"
						disabled={isUserAnswered}
						className={isUserAnswered ? classes.heighlight : undefined }
						onClick={() => dispatch(setAnsweredNotification({ id, isUserAnswered: true }))}
					>
						<CloseIcon />
					</IconButton>
				)
			}
		},
		{ label: t('goodsAndGuarantees:dashboard.observation'), field: 'message' },
	], [classes.heighlight, dispatch])

	return (
		<>
			<Typography variant='h1'>Dashboard</Typography>

			<Panel
				title={t('goodsAndGuarantees:dashboard.title')}
				className={classes.panel}
			>
				<Table
					columns={columns}
					rows={lock ? [] : rows}
					isLoading={isLoading}
				/>
			</Panel>
			<Pagination />
		</>
	)
}

export default Home
