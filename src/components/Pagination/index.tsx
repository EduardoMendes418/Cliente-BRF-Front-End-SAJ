import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, ListItemText, MenuItem, Select } from '@material-ui/core';
import MuiPagination from '@material-ui/lab/Pagination';

import { actions } from 'src/core/store'
import { usePagination } from 'src/hooks/pagination';

type Props = {
	page?: number;
	pageCount?: number;
	pageSize?: number;
	onChangePage?: (value: number) => void;
	onChangePageSize?: (value: number) => void;
};

const Pagination = ({
	page: pageComponent,
	pageCount: pageCountComponent,
	pageSize: pageSizeComponent,
	onChangePage: onChangePageComponent,
	onChangePageSize: onChangePageSizeComponent,
}: Props) => {

	const dispatch = useDispatch();
	const pagination = usePagination()

	const page = pageComponent || pagination.page
	const pageSize = pageSizeComponent || pagination.pageSize
	const pageCount = pageCountComponent || pagination.pageCount

	const setPage = useCallback((
		value: number
	) => {
		if (onChangePageComponent) onChangePageComponent(value)
		else dispatch(actions.pagination.setPage(value))
	}, [onChangePageComponent, dispatch])

	const setPageSize = useCallback((
		value: number
	) => {
		if (onChangePageSizeComponent) onChangePageSizeComponent(value)
		else dispatch(actions.pagination.setPageSize(value))
	}, [onChangePageSizeComponent, dispatch])

	useEffect(() => {
		if (pageCount < page) dispatch(actions.pagination.setPage(pageCount))
	}, [dispatch, pageCount, page]);

	return (
		<Grid container justifyContent='space-between' alignItems='center' className='margin-top-24'>
			<Grid item>
				{setPageSize && (
					<Select
						style={{ backgroundColor: '#fff' }}
						variant='outlined'
						value={pageSize}
						onChange={(e) => setPageSize(e.target.value as number)}
					>
						<MenuItem value={10}>
							<ListItemText primary='10' />
						</MenuItem>
						<MenuItem value={20}>
							<ListItemText primary='20' />
						</MenuItem>
						<MenuItem value={50}>
							<ListItemText primary='50' />
						</MenuItem>
					</Select>
				)}
			</Grid>
			<Grid item>
				{pageCount > 1 && (
					<MuiPagination
						count={pageCount}
						onChange={(_, n) => setPage(n)}
						color='primary'
						page={page}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default Pagination;
