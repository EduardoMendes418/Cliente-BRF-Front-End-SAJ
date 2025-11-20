import { makeStyles } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { Cell } from '../index';

const useStyles = makeStyles({
	list: {
		padding: 0,
		listStyle: 'none',
	},
});

const ArrayCell = (props: Cell) => {
	const classes = useStyles();
	const { column, row } = props;
	const array: any[] = row[column.field];

	if (!array)
		return (
			<TableCell component='td'>
				<ul className={classes.list}>
					<li>-</li>
				</ul>
			</TableCell>
		);

	const isEmpty = array.length === 0;

	return (
		<TableCell component='td'>
			<ul className={classes.list}>
				{isEmpty ? (
					<li>-</li>
				) : (
					array.map((item, index) => <li key={`li_${index}`}>{item ?? '-'}</li>)
				)}
			</ul>
		</TableCell>
	);
};

export default ArrayCell;
