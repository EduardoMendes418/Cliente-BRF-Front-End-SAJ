import { TableCell } from "@material-ui/core";
import { Typography } from "@mui/material";
import { Cell } from "..";


const DefaultCell = (props: Cell) => {
	const { column, row } = props;
	return (
		<TableCell component="td">
			{props.noWrap ? (
				<Typography noWrap fontSize={14}>
					{row[column.field] || "-"}
				</Typography>
			) : (
				row[column.field] || "-"
			)}
		</TableCell>
	);
};

export default DefaultCell;
