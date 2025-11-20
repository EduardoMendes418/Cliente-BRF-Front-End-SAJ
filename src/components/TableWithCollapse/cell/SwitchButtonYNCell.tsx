import { useState } from 'react';
import { TableCell } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { t } from 'src/locale/i18n';
import { Cell } from '..';

const SwitchButtonYNCell = ({ column, row, hiddeButton, rindex }: Cell) => {
	const [status, setStatus] = useState(row[column.field] ?? false);
	const label = status ? t('sim') : t('nao');

	const handleChange = () => {
		setStatus(!status);
		if (column.onChange) column.onChange(row, rindex);
	};

	return (
		<TableCell component='td'>
			{
				hiddeButton ? label
					: (
						<FormControlLabel
							control={
								<Switch
									checked={status}
									onChange={handleChange}
									name='checkedB'
									color='primary'
								/>
							}
							label={label}
						/>
					)
			}
		</TableCell>
	);
};

export default SwitchButtonYNCell;
