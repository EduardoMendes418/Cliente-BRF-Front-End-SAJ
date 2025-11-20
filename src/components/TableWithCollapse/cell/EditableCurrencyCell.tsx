import { TableCell } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import { Cell } from "..";

const EditableCurrencyCell = ({ column, row, onChange }: Cell) => (
  <TableCell component="td">
    <Input
      defaultValue={row[column.field]}
      name={column.field}
      onChange={(e) => {
        if (onChange) {
          return onChange({
            key: column.field,
            value: e.target.value,
            id: column.id ? row[column.id] : "",
          });
        }
      }}
    />
  </TableCell>
);

export default EditableCurrencyCell;
