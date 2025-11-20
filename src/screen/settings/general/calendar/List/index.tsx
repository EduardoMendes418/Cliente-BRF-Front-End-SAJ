import { useEffect, useState } from "react";
import { Grid, Box } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import ScreenTemplate from "src/components/Screen"
import Panel from 'src/components/Panel';
import CalendarPicker from "./CalendarPicker";
import Search from './Search'
import List from './List'

import { useTranslation } from "src/locale/i18n";
import { TSystemDate } from "src/core/models";
import {
	getListNonWorkingDays,
	getStatusNonWorkingDays as getStatus,
	getErrorMessageNonWorkingDays as getErrorMessage,
	getListFiltersNonWorkingDays,
	getCurrentYearMonthNonWorkingDays,
} from "src/core/store/modules/non-working-days/selectors";
import { fetchMonthNonWorkingDays, fetchNonWorkingDays } from "src/core/store/modules/non-working-days/thunks";
import { usePagination } from "src/hooks/pagination";
import { useRegisterDefault } from "src/hooks";
import { initialState } from "src/core/store/modules/non-working-days";
import { actions } from "src/core/store";
import { equals } from "ramda";

export const sameDay = (date1: TSystemDate, date2: TSystemDate) =>
	moment(date1).startOf('day').isSame(moment(date2).startOf('day'))

const today = moment().startOf('day')

const Calendar = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const [currentDate, setCurrentDate] = useState<TSystemDate>(null)
	const { page, pageSize } = usePagination();

	const items = useSelector(getListNonWorkingDays)
	const listFilters = useSelector(getListFiltersNonWorkingDays)
	const currentYearMonth = useSelector(getCurrentYearMonthNonWorkingDays)
	const status = useSelector(getStatus);

	useEffect(() => {
		dispatch(fetchNonWorkingDays({ page, pageSize, ...listFilters }))
	}, [dispatch, page, pageSize, listFilters]);

	useEffect(
		() => { dispatch(fetchMonthNonWorkingDays(currentYearMonth)) },
		[dispatch, currentYearMonth]
	);

	useEffect(
		() => {
			if (status === 'deleted') {
				dispatch(fetchNonWorkingDays(listFilters))
				dispatch(fetchMonthNonWorkingDays(currentYearMonth))
			}
		},
		[dispatch, status, listFilters, currentYearMonth]
	);

	const reset = () => {
		dispatch(actions.nonWorkingDays.setFilters({ ...initialState.listFilters }))
		if (equals(currentYearMonth, initialState.currenYearMonth)) {
			setCurrentDate(null)
		} else {
			dispatch(fetchMonthNonWorkingDays(initialState.currenYearMonth))
			setCurrentDate(today.toDate())
		}
	}

	useRegisterDefault(({
		action: 'nonWorkingDays',
		getStatus,
		getErrorMessage,
		route: '',
	}))

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t('config.calendaryTitle')}>
				<Grid container spacing={2} wrap='nowrap'>
					<Grid item>
						<CalendarPicker
							today={today}
							currentDate={currentDate}
							setCurrentDate={setCurrentDate}
						/>
					</Grid>
					<Grid item style={{ width: '100%' }}>
						<Box m={3}>
							<Search reset={reset} />
							<List items={items} />
						</Box>
					</Grid>
				</Grid>
			</Panel>
		</ScreenTemplate>
	)
}

export default Calendar