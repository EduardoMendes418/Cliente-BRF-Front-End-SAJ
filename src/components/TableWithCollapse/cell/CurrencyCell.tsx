import { TableCell } from '@material-ui/core';

import { numberToCurrency } from 'src/core/utils/func';
import { Cell } from '../index';

const CurrencyCell = ({ column, row }: Cell) => (
	<TableCell component='td'>
		{numberToCurrency(row[column.field])}
	</TableCell>
)

export default CurrencyCell;
