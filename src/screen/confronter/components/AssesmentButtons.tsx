import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from "@material-ui/core"
import { CancelOutlined, CheckCircleOutlineOutlined } from "@material-ui/icons"

import { modal } from "src/components/modals"

import JustificationModal from "./JustificationModal"
import { checkIsPending } from "../utils/confronter-status-functions"
import { TableRow } from "src/core/models/confronting-orders"

const useStyles = makeStyles({
	approve: {
		color: '#CC2027',
		'&:disabled': {
			color: '#E5E5E5',
		},
	},
	disapprove: {
		color: '#1C6226',
		'&:disabled': {
			color: '#E5E5E5',
		},
	}
})

type AssessmentButtonsProps = {
	row: TableRow
	handleSingleRowAssessment: (assessmentStatus: boolean, reason: string, id: number) => void
}

export default function AssesmentButtons({ row, handleSingleRowAssessment }: AssessmentButtonsProps) {
	const classes = useStyles()

	const isPending = checkIsPending(row.statusFlowId)

	return (
		<>
			<IconButton
				aria-label='approve'
				disabled={!isPending || !row.approver}
				className={classes.disapprove}
				onClick={() => modal({
					title: 'Motivo',
					component: <JustificationModal assessmentStatus={true} id={row.id} onSubmit={handleSingleRowAssessment} />,
					buttons: [],
					dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
				})}
			>
				<CheckCircleOutlineOutlined />
			</IconButton>
			<IconButton
				aria-label='disaprove'
				disabled={!isPending || !row.approver}
				className={classes.approve}
				onClick={() => modal({
					title: 'Motivo',
					component: <JustificationModal assessmentStatus={false} id={row.id} onSubmit={handleSingleRowAssessment} />,
					buttons: [],
					dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
				})}
			>
				<CancelOutlined />
			</IconButton>
		</>
	)
}