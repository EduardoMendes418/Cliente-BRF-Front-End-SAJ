import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Box,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Skeleton } from '@mui/material';

import AccordionPanel from 'src/components/AccordionPanel'
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";
import { Button } from 'src/components/button'
import useBoolean from 'src/hooks/useBoolean';
import { getOrders, getProvisionsProcess, } from 'src/core/store/modules/provision-order/selectors'
import { numberToCurrency } from 'src/core/utils/func'
import { t } from 'src/locale/i18n'
import { FOLDER_STATUS } from 'src/screen/settings/constants';
import { IconButton } from "@material-ui/core";
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';

import useFetchGridAndSimulation from '../hooks/use-fetch-grid-and-simulation';
import { getOrderRatingInfo } from '../utils/func';
import totalizeGrid from '../utils/totalize-grid'
import { CONTINGENCY, ORDER_PROBABILITIES } from '../utils/constantes'
import { useSnackbar } from 'notistack';
import { confirm } from "src/components/modals";
import { costCenterReclassification } from 'src/core/store/modules/provision-accounting/thunks';

const useStyles = makeStyles({
	table: {
		whiteSpace: 'nowrap'
	},
	header: {
		'& tr .MuiTableCell-head': {
			border: '1px solid rgba(224, 224, 224, 1)',
			textAlign: 'center',
			padding: '8px',
		},
		'& tr .MuiTableCell-head$borderLeft': {
			borderWidth: '1px 1px 1px 10px',
			BorderStyle: 'solid',
			BorderColor: 'rgba(224, 224, 224, 1)',
		},
		'& tr .MuiTableCell-head$borderRight': {
			borderWidth: '1px 10px 1px 1px',
			BorderStyle: 'solid',
			BorderColor: 'rgba(224, 224, 224, 1)',
		},
		'& tr .MuiTableCell-head$borderLeft$borderRight': {
			borderWidth: '1px 10px 1px 10px',
			BorderStyle: 'solid',
			BorderColor: 'rgba(224, 224, 224, 1)',
		},
	},
	body: {
		'& tr td': {
			'&:nth-child(3), &:nth-child(4), &:nth-child(7), &:nth-child(8), &:nth-child(11), &:nth-child(12)': {
				backgroundColor: (isShowingSimulation) => isShowingSimulation ? '#f2ffeb' : '',
			},
		},
	},
	row: {
		'&:hover td': {
			'&:nth-child(3), &:nth-child(4), &:nth-child(7), &:nth-child(8), &:nth-child(11), &:nth-child(12)': {
				backgroundColor: (isShowingSimulation) => isShowingSimulation ? '#e8ffdc' : '',
			},
		},
	},
	borderLeft: {
		borderLeft: '10px solid rgba(224, 224, 224, 1)',
	},
	borderRight: {
		borderRight: '10px solid rgba(224, 224, 224, 1)',
	},
	panel: {
		marginTop: '-30px',
	},
	successFeeSimulation: {
		'& .MuiGrid-root.MuiGrid-container > p': {
			color: '#389243',
		}
	}
})

export enum TABLE_OPTION {
	NONE = 'NONE',
	PERDA = 'PERDA',
	GANHO = 'GANHO',
	ALL = 'ALL'
}

export const SUCCESS_FEE_DESCRIPTION = 'Honorário de Êxito'.toUpperCase()
export const MAIN_ORDER_RATING_DESCRIPTION = 'Principal'

const TotalOrderRatingTable = () => {
	const {
		bcValue,
		bcValueWrittenoff,
		contingency,
		folderNumber,
		lastEqualizationDate,
		oldNumber,
		valueBcConsolidationAdjustment,
		statusId,
		id
	} = useSelector(getProvisionsProcess)

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const orders = useSelector(getOrders)
	const folderN = folderNumber || oldNumber || ''

	const [tableOption, setTableOption] = useState<TABLE_OPTION>(TABLE_OPTION.NONE)
	const [isShowingSimulation, { toggle: toggleShowSimulation }] = useBoolean(false)

	const { gridRows, simulatedSuccessFeeOrderRatings, isFetching } = useFetchGridAndSimulation({
		orders,
		folderNumber: folderN,
		isShowingSimulation,
		tableOption
	})

	const { successFeeOrder, ...provisionOrderRatingInfo } = useMemo(() => getOrderRatingInfo(orders), [orders]);

	/* const doReclassification = async () => {
		const isConfirmed = await confirm(`Tem certeza que deseja reclassificar esse lançamento?`, "Reclassificação")
		if (!isConfirmed) return;

		const { payload } = await dispatch(costCenterReclassification(Number(id))) as any;

		if(payload?.status === 500){
				return enqueueSnackbar(`${payload?.detail}`, {variant: "error"})
		} else {
			return enqueueSnackbar(`Reclassificação realizada com sucesso`, {variant: "success"})
		}
	} */

	useEffect(() => {
		if (contingency === CONTINGENCY.PASSIVA)
			setTableOption(TABLE_OPTION.PERDA)
		else
			setTableOption(TABLE_OPTION.GANHO)
	}, [contingency])

	const changeTableOption = (e: ChangeEvent<{ name?: string; value: unknown; }>) => {
		setTableOption(e.target.value as TABLE_OPTION)
	}

	const totalizedRows = useMemo(() => {
		const newRows = gridRows.slice().sort((x, y) => x.orderRatingDescriptionId - y.orderRatingDescriptionId)
		return totalizeGrid(newRows)
	}, [gridRows])

	let feeValue = 0;
	let taxAndCorrectionValue = 0;
	// Only show successFee section if successFee is saved in the DB and active OR in simulaion
	if (successFeeOrder && successFeeOrder.isActive && (!successFeeOrder.transientId || isShowingSimulation)) {
		successFeeOrder.orderRatings.forEach(order => {
			taxAndCorrectionValue += order.correctedValue;
			if (order.orderRatingProbababilityId === ORDER_PROBABILITIES.PROBABLE
					&& order.orderRatingDescription?.name === MAIN_ORDER_RATING_DESCRIPTION)
				feeValue += order.value
		});
	}
	if (isShowingSimulation && simulatedSuccessFeeOrderRatings.length) {
		taxAndCorrectionValue = 0
		simulatedSuccessFeeOrderRatings.forEach(orderRating => {
			taxAndCorrectionValue += orderRating.correctedValue
		})
	}

	const classes = useStyles(isShowingSimulation && !isFetching)

	return (
		<AccordionPanel title={t('provisions:request.valuesTableTitle')} noContentMargin>
			<Grid container justifyContent='space-between'>
				<Grid item xs={12} md={3}>
					<Box p={3}>
						<FormControl>
							<InputLabel id="table-expectation-label" shrink>
								{t('provisions:fields.expectation')}
							</InputLabel>
							<Select
								labelId="table-expectation-label"
								name="table-option"
								value={tableOption}
								onChange={changeTableOption}
							>
								<MenuItem value={TABLE_OPTION.NONE}><em>{t('select')}</em></MenuItem>
								<MenuItem value={TABLE_OPTION.PERDA}>{t('provisions:request.table.loss')}</MenuItem>
								<MenuItem value={TABLE_OPTION.GANHO}>{t('provisions:request.table.gain')}</MenuItem>
								<MenuItem value={TABLE_OPTION.ALL}>{t('provisions:request.table.all')}</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Grid>

				{statusId !== FOLDER_STATUS.DEAD && (
					<Grid item xs={12} md={3}>
						<Box p={3} textAlign="right">
							<Button
								onClick={toggleShowSimulation}
								variant={isShowingSimulation ? 'outlined' : 'contained'}
								color={isShowingSimulation ? 'default' : 'primary'}
								text={
									isShowingSimulation ?
										t('provisions:request.button.clearSimulation')
										: t('provisions:request.button.simulateIndex')
								}
							/>
						</Box>
					</Grid>
				)}
			</Grid>

			<TableContainer>
				<Table className={classes.table}>
					<TableHead className={classes.header}>
						<TableRow>
							<TableCell>&nbsp;</TableCell>
							<TableCell
								colSpan={4}
								className={`${classes.borderLeft} ${classes.borderRight}`}
							>
								Provável
							</TableCell>
							<TableCell colSpan={4}>Possível</TableCell>
							<TableCell
								colSpan={4}
								className={`${classes.borderLeft} ${classes.borderRight}`}
							>
								Remoto
							</TableCell>
							<TableCell>&nbsp;</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Aberturas</TableCell>

							<TableCell className={classes.borderLeft}>Valor</TableCell>
							<TableCell>Valor corrigido</TableCell>
							<TableCell>Juros</TableCell>
							<TableCell>Subtotal</TableCell>

							<TableCell className={classes.borderLeft}>Valor</TableCell>
							<TableCell>Valor corrigido</TableCell>
							<TableCell>Juros</TableCell>
							<TableCell className={classes.borderRight}>Subtotal</TableCell>

							<TableCell>Valor</TableCell>
							<TableCell>Valor corrigido</TableCell>
							<TableCell>Juros</TableCell>
							<TableCell className={classes.borderRight}>Subtotal</TableCell>

							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={classes.body}>
						{(isFetching) &&
							Array(3).fill(null).map((_, indexRow) => (
								<TableRow key={`row_${indexRow}`}>
									{Array(14).fill(null).map((_, indexCol) => (
										<TableCell key={`row_${indexRow}_${indexCol}`}><Skeleton /></TableCell>
									))}
								</TableRow>
							))
						}
						{(!isFetching) &&
							totalizedRows.map((row, index) => (
								<TableRow key={`row_${index}`} className={classes.row}>
									<TableCell>{row.orderRatingDescriptionName}</TableCell>

									<TableCell className={classes.borderLeft}>{numberToCurrency(row.probableValue)}</TableCell>
									<TableCell>{numberToCurrency(row.probableCorrectedValue)}</TableCell>
									<TableCell>{numberToCurrency(row.probableFeesValue)}</TableCell>
									<TableCell>{numberToCurrency(row.probableProbabilitySubtotal)}</TableCell>

									<TableCell className={classes.borderLeft}>{numberToCurrency(row.possibleValue)}</TableCell>
									<TableCell>{numberToCurrency(row.possibleCorrectedValue)}</TableCell>
									<TableCell>{numberToCurrency(row.possibleFeesValue)}</TableCell>
									<TableCell className={classes.borderRight}>{numberToCurrency(row.possibleProbabilitySubtotal)}</TableCell>

									<TableCell>{numberToCurrency(row.remoteValue)}</TableCell>
									<TableCell>{numberToCurrency(row.remoteCorrectedValue)}</TableCell>
									<TableCell>{numberToCurrency(row.remoteFeesValue)}</TableCell>
									<TableCell className={classes.borderRight}>{numberToCurrency(row.remoteProbabilitySubtotal)}</TableCell>

									<TableCell>{numberToCurrency(row.total!)}</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</TableContainer>
			<Panel
				title={t("provisions:provision.title")}
				withPadding
			>
				<Grid container spacing={3}>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t("provisions:provision.dataBase")}
							value={provisionOrderRatingInfo.allProvisionDatesAreEqual ? provisionOrderRatingInfo.provisionDataBase : ""}
							type='date'
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t("provisions:provision.correctionIndex")}
							value={provisionOrderRatingInfo.allProvisionCorrectionRulesAreEqual
								? provisionOrderRatingInfo.provisionFormulaCorrectionRuleName : ""
							}
						/>
					</Grid>

					{/* <Grid item md={4} xs={12}>
					<IconButton
						onClick={() => doReclassification()}
					>
						<FlipCameraAndroidIcon/>
					</IconButton>	
					</Grid> */}
				</Grid>
				
			</Panel>
			<Panel
				title={t("provisions:successFee.title")}
				withPadding
				className={classes.panel}
			>
				<Grid container spacing={3}>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:successFee.feeValue"
							)}
							value={feeValue}
							type='currency'
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:successFee.taxAndCorrectionValue"
							)}
							value={isFetching && isShowingSimulation ? ' ' : taxAndCorrectionValue}
							type={isFetching && isShowingSimulation ? undefined : 'currency'}
							className={isShowingSimulation ? classes.successFeeSimulation : ''}
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:successFee.updatedFeeValue"
							)}
							value={feeValue + taxAndCorrectionValue}
							type='currency'
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:successFee.dataBase"
							)}
							value={successFeeOrder?.transientId || !successFeeOrder?.isActive
								? '' : successFeeOrder?.orderRatings[0]?.dataBase ?? ''}
							type='date'
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:successFee.correctionIndex"
							)}
							value={successFeeOrder?.transientId || !successFeeOrder?.isActive
								? '' : successFeeOrder?.orderRatings[0]?.formulaCorrectionRule?.formulaName ?? ""}
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel
				title={t("provisions:businessCombination.title")}
				withPadding
				className={classes.panel}
			>
				<Grid container spacing={3}>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:businessCombination.value"
							)}
							value={bcValue}
							type="currency"
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:businessCombination.downedBcValue"
							)}
							value={valueBcConsolidationAdjustment}
							type="currency"
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:businessCombination.bcConsolidatedAdjustment"
							)}
							value={bcValueWrittenoff}
							type="currency"
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel
				title={t("provisions:equalization.title")}
				withPadding
				className={classes.panel}
			>
				<Grid container spacing={3}>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t(
								"provisions:businessCombination.lastEqualizationDate"
							)}
							value={lastEqualizationDate}
							type='date'
						/>
					</Grid>
				</Grid>
			</Panel>
		</AccordionPanel>
	)
}

export default TotalOrderRatingTable
