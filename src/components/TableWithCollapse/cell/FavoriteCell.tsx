import { TableCell } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StartBorderIcon from '@material-ui/icons/StarBorder';
import { Cell } from '..';

const yellowColor = { color: '#F2C94C' };
const greyColor = { color: '#828282' };

const FavoriteCell = (props: Cell) => {
	const { column, row } = props;

	return (
		<TableCell component='td'>
			{row[column.field] ? <StarIcon style={yellowColor} /> : <StartBorderIcon style={greyColor} />}
		</TableCell>
	);
};

export default FavoriteCell;
