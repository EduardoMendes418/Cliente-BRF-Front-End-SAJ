import moment, { Moment } from 'moment';
import {
	pathOr,
	pipe,
	cond,
	always,
	T,
	identity,
	map,
	mapObjIndexed,
	ifElse,
	multiply,
	equals,
} from 'ramda';
import { TIncomeTaxRates } from 'src/core/models/income-tax-rates';

const TWO_YEARS_DAYS = 731
const THREE_YEARS_DAYS = 1096
const FIVE_YEARS_DAYS = 1826

const calcDiffInDays = (
	inicialDate: Moment,
	finalDate: Moment
) => finalDate.diff(inicialDate, 'days');

const calcInMonths = (v: number | string, round: number = 2) => ((Number(v) || 0) / 365 * 12).toFixed(round)

const calcMonthsToPay = pipe(
	calcInMonths,
	cond([
		[v => v > 60, always(60)],
		[v => v < 1, always(1)],
		[T, identity]
	])
)

const calcFiveYear = (momentDismissal: Moment, momentDistribution: Moment) =>
	calcDiffInDays(momentDismissal, momentDistribution.subtract(FIVE_YEARS_DAYS)) * -1

const getStatus = (
	workTime: number,
	judicialTime: number,
	admissionJudicialTime: number,
) => {
	if (judicialTime < 0) return 'noLapsed'
	if (judicialTime > TWO_YEARS_DAYS) return 'lapsed'
	if (admissionJudicialTime >= FIVE_YEARS_DAYS) return 'moreFiveYears'
	if (admissionJudicialTime > THREE_YEARS_DAYS && workTime >= FIVE_YEARS_DAYS) return 'moreThreeYears'
	return workTime.toString()
}

type TGetCalcTime = {
	status: string;
	judicialTime: number;
	momentDismissal: Moment;
	momentDistribution: Moment;
}

const getCalcTime = ({
	status,
	judicialTime,
	momentDismissal,
	momentDistribution,
}: TGetCalcTime) => (type: string) => {
	const moreFiveYears = FIVE_YEARS_DAYS - Number(judicialTime)
	const moreThreeYears = calcFiveYear(momentDismissal, momentDistribution)

	const obj: { [lapsed: string]: string | number } = {
		totalTime_lapsed: "PRESCRITO",
		totalTime_moreFiveYears: moreFiveYears,
		totalTime_moreThreeYears: moreThreeYears,
		totalTime_noLapsed: status,

		noLapsed_lapsed: 0,
		noLapsed_moreFiveYears: moreFiveYears,
		noLapsed_moreThreeYears: moreThreeYears,
		noLapsed_noLapsed: 0
	}

	const result = pathOr(status, [`${type}_${status}`], obj)
	const normalizeResult = type === 'noLapsed' && typeof result == 'number' ? (result / 365).toFixed(2) : result

	return normalizeResult
}

export const calcJudicialTimes = (
	admissionDate: string,
	dismissalDate: string,
	distributionDate: string
): any[] => {

	const momentAdmission = moment(admissionDate)
	const momentDismissal = moment(dismissalDate)
	const momentDistribution = moment(distributionDate)

	const workTime = calcDiffInDays(momentAdmission, momentDismissal);
	const judicialTime = calcDiffInDays(momentDismissal, momentDistribution);
	const admissionJudicialTime = calcDiffInDays(momentAdmission, momentDistribution);

	const status = getStatus(workTime, judicialTime, admissionJudicialTime);
	const getCalcTimeType = getCalcTime({ judicialTime, momentDistribution, momentDismissal, status });
	const totalTime = getCalcTimeType('totalTime');
	const noLapsedYears = getCalcTimeType('noLapsed');

	const monthsToPay = calcMonthsToPay(totalTime)

	return [
		{
			admissionDate,
			dismissalDate,
			distributionDate,
			workTime,
			judicialTime,
			noLapsedYears,
			monthsToPay,
			totalTime,
		},
		{
			admissionDate: '',
			dismissalDate: '',
			distributionDate: '',
			workTime: calcInMonths(workTime, 0),
			judicialTime: calcInMonths(judicialTime, 0),
			totalTime: calcInMonths(totalTime, 0),
			noLapsedYears: '',
			monthsToPay: '',
		}
	]
};

export const normalizeIRTable = ({ incomeTaxRateValues }: TIncomeTaxRates) =>
	incomeTaxRateValues
		? incomeTaxRateValues.reduce((acc, { aliquot, portion, initialValue, finalValue }) => {
			acc.push({
				from: initialValue || 0,
				to: finalValue || 0,
				aliquot: aliquot || 0,
				installment: portion || 0,
			})
			return acc
		}, [] as TIRTableRows[])
		: []


export const normalizeAccumulatedIRTable = (months: string | number) =>
	map(mapObjIndexed(ifElse(
		equals('-'),
		always('-'),
		multiply(Number(months))
	)))

type TIRTableRows = {
	aliquot: number;
	installment: number;
	from: number;
	to: number;
}

export const getCurrentIR = (irBase: number, irTableRows: TIRTableRows[]) =>
	irTableRows.find(({ from, to }) => irBase >= from && irBase <= to)
	|| { aliquot: 0, installment: 0, from: 0, to: 0 }

export const calcIRResult = (irBase: number, aliquot: number, installment: number) => irBase * aliquot / 100 - installment
