import { TableCell } from '@material-ui/core';

import { toPercentage } from 'src/core/utils/func';
import { Cell } from '../index';

const PercentageCell = ({ column, row }: Cell) => {

	const value = toPercentage(row[column.field], false, true)

	return (
		<TableCell component='td'>
			{value + (value !== '-' ? ' %' : '')}
		</TableCell>
	)
}

export default PercentageCell;
