import { Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { CONFRONTER_STATUS } from '../utils/constants'

const useStyles = makeStyles({
	red: {
		backgroundColor: '#FFEBEE',
		color: '#CC2027',
	},
	green: {
		backgroundColor: '#E8F6EA',
		color: '#1C6226',
	},
	orage: {
		backgroundColor: '#FFEDB4',
		color: '#F04E23',
	}
})

type StatusChipProps = {
	status: CONFRONTER_STATUS
}

export default function StatusChip({ status }: StatusChipProps) {
	const classes = useStyles()

	if ([CONFRONTER_STATUS.PENDENTE_NIVEL_1, CONFRONTER_STATUS.PENDENTE_NIVEL_2].includes(status))
		return <Chip label="PENDENTE" className={classes.orage} />
	if ([
			CONFRONTER_STATUS.REPROVADO,
			CONFRONTER_STATUS.REPROVADO_NIVEL_1,
			CONFRONTER_STATUS.REPROVADO_NIVEL_2
		].includes(status)
	)
		return <Chip label="REPROVADO" className={classes.red} />
	if ([CONFRONTER_STATUS.APROVADO_NIVEL_1, CONFRONTER_STATUS.APROVADO_NIVEL_2].includes(status))
		return <Chip label="APROVADO" className={classes.green} />

	return <>-</>
}