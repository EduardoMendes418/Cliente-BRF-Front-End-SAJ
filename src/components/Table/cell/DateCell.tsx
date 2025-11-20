import { TableCell } from '@material-ui/core';
import moment from 'moment';
import { Cell } from '../index';

const DateCell = ({ column, row, format }: Cell & { format?: string }) => {

	const isFormated = /\d{2}\/\d{2}\/\d{4}/.test(row[column.field])
	const momentDate = moment(row[column.field] ?? '')

	return (
		<TableCell component='td'>
			{
				isFormated
					? (row[column.field] ?? '-')
					: momentDate.isValid()
						? momentDate.format(format || 'DD/MM/YYYY')
						: '-'
			}
		</TableCell>
	);
};

export default DateCell;
