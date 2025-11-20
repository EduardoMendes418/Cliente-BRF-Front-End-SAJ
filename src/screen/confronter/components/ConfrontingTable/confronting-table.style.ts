import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	disapproveAll: {
		backgroundColor: '#FFEBEE',
		color: '#CC2027',
		marginRight: '18px',
		'&:hover': {
			backgroundColor: '#FFD4DB',
		},
		'&:disabled': {
			backgroundColor: 'transparent',
		},
	},
	approveAll: {
		backgroundColor: '#E8F6EA',
		color: '#1C6226',
		'&:hover': {
			backgroundColor: '#C6F1CC',
		},
		'&:disabled': {
			backgroundColor: 'transparent',
		},
	},
	head: {
		'& .MuiTableRow-root .MuiTableCell-head': {
			whiteSpace: 'nowrap',
			textAlign: 'center',
			border: '1px solid #E0E0E0',
		},
	},
	row: {
		'& td.MuiTableCell-body': {
			padding: '4px 8px',
		},
		'& td.changed': {
			backgroundColor: '#FFF8E1',
		},
		'&:hover td.changed': {
			backgroundColor: '#FFF6D9',
		}
	}
})

export default useStyles
