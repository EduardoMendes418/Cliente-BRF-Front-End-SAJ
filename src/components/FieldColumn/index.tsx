import moment from 'moment';
import { Grid, IconButton, Typography, makeStyles } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';

import { formatTo, getSelectedValuesAsString, numberToCurrency } from 'src/core/utils/func'
import { TOptionsSelect } from '../form';

const useStyles = makeStyles({
	helperText: {
	  color: '#ff000a !important',
	  size: "120%",
	},
  });

type FieldColumnProps = {
	label: string;
	value: string | number | null | Date | string[] | number[] | undefined;
	testid?: string;
	formatDate?: string;
	options?: TOptionsSelect[];
	type?: 'currency' | 'date' | 'list' | 'dateHour' | 'cep' | 'phone';
	multiline?: boolean;
	handleView?: () => void;
	reclassification?: () => void;
	className?: string;
	helperText?: string;
	coloredValueCircularization?: boolean;
	renderReclassification?: boolean;
};

const FieldColumn = ({
	label,
	value,
	testid,
	type,
	options,
	formatDate,
	multiline = false,
	handleView,
	reclassification,
	renderReclassification,
	className,
	helperText,
	coloredValueCircularization
}: FieldColumnProps) => {

	const classes = useStyles();

	const setValue = () => {
		if (type === 'currency')
			return numberToCurrency(value as number)

		if (!value && value !== 0) return '-';

		if (type === 'date')
			return moment(value).format(formatDate || 'DD/MM/YYYY');

		if (type === 'dateHour')
			return moment(value).format(formatDate || 'DD/MM/YYYY HH:mm:ss');

		if (type === 'list' && options && options.length)
			return getSelectedValuesAsString(options, value);

		if (type === 'cep')
			return formatTo('cep', String(value));

		if (type === 'phone')
			return formatTo('phone', String(value));

		if (typeof value === 'boolean')
			return value ? 'Sim' : 'Não'

		return value;
	};
	
	return (
		<Grid
			container
			direction='column'
			data-testid={testid}
			className={`readonly-field ${className}`}
		>
			<Grid item>
				<Typography variant='body2' data-testid='field-label'>
					{label}
				</Typography>
			</Grid>
			<Grid container className={multiline ? 'multiline-text' : ''} >
				{handleView && (
					<IconButton aria-label='view' onClick={handleView} style={{ padding: 0, marginRight: '8px', height: '21px' }}>
						<VisibilityIcon color="primary" />
					</IconButton>
				)}
				<Typography style={{color: `${coloredValueCircularization === true ? '#fc5203f8' : ''}`}} variant='body1' data-testid='field-value'>
					{setValue()}
				</Typography>
				{renderReclassification === true ?
				reclassification && (
							<IconButton aria-label='edit' style={{ padding: 1, marginLeft: '19px', height: '8px' }} onClick={reclassification}>
								<FlipCameraAndroidIcon/>
							</IconButton>	
				)
				: null
				}
			</Grid>
			{helperText && (
				<Grid item>
					<Typography variant='caption' color='textSecondary' className={classes.helperText}>
						{helperText}
					</Typography>
				</Grid>
			)}
		</Grid>
	);
};

export default FieldColumn;
