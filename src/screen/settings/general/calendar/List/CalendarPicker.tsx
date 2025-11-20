import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
} from "react";
import moment, { Moment } from "moment"
import { useDispatch, useSelector } from "react-redux";
import { Box, Button } from "@material-ui/core"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { List, ListItem, TextField, ListItemText } from "@mui/material";
import { LocalizationProvider, StaticDatePicker, PickersDay } from '@mui/lab'
import ptBR from 'date-fns/locale/pt-BR';

import { TSystemDate } from "src/core/models";
import { useTranslation } from "src/locale/i18n";
import { actions } from "src/core/store";
import { sameDay } from ".";
import { getListMonthNonWorkingDays } from "src/core/store/modules/non-working-days/selectors";

const customButton = { color: '#8D9091', fontSize: "18px" }

type Props = {
	currentDate: TSystemDate;
	today: Moment;
	setCurrentDate: Dispatch<SetStateAction<TSystemDate>>;
}

const CalendarPicker = ({ currentDate, setCurrentDate, today }: Props) => {

	const { t } = useTranslation()
	const dispatch = useDispatch()

	const listMonth = useSelector(getListMonthNonWorkingDays)

	useEffect(() => {
		currentDate && dispatch(actions.nonWorkingDays.setFilters({
			date: moment(currentDate).format('YYYY-MM-DD')
		}))
	}, [dispatch, currentDate])

	const onYearMonthChange = (date: TSystemDate) => {
		const m = moment(date)
		const year = m.year()
		const month = m.month() + 1

		dispatch(actions.nonWorkingDays.setFilters({ year, month }))
		dispatch(actions.nonWorkingDays.setCurrentYearMonth([year, month]))
		setCurrentDate(null)
	}

	const renderDay = useCallback((day, _, DayComponentProps) => {
		const m = moment(day)
		const nonWorking = [0, 6].includes(m.weekday()) || listMonth.includes(m.format('D'))

		return (
			<PickersDay
				{...DayComponentProps}
				className={`highlight ${nonWorking ? 'highlight--red' : ''}`}
			/>
		)
	}, [listMonth])

	return (
		<Box m={3} mr={0} p={2} py={3} borderRadius={10} borderColor="#EFEFEF" border={1}>
			<LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
				<StaticDatePicker
					displayStaticWrapperAs="desktop"
					value={currentDate}
					onChange={setCurrentDate}
					onMonthChange={onYearMonthChange}
					onYearChange={onYearMonthChange}
					renderInput={(props) => <TextField {...props} />}
					renderDay={renderDay}
					showDaysOutsideCurrentMonth
				/>
			</LocalizationProvider>
			<Box mx={3} textAlign='right'>
				<Button
					type="button"
					style={customButton}
					onClick={() => setCurrentDate(today.toDate())}
					disabled={sameDay(today, currentDate)}
				>
					{t('settings:calendary.today')}
				</Button>
			</Box>
			<Box mx={2}>
				<List>
					<ListItem className='label'>
						<Box border={7} borderRadius='50%' mr={2} color='#055EA9' />
						<ListItemText primary={t('settings:calendary.workingDay')} />
					</ListItem>
					<ListItem className='label'>
						<Box border={7} borderRadius='50%' mr={2} color='#CC2027' />
						<ListItemText primary={t('settings:calendary.nonWorkingDay')} />
					</ListItem>
				</List>
			</Box>
		</Box>
	)
}

export default CalendarPicker