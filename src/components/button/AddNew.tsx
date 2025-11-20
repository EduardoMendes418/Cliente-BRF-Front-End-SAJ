import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

type Props = {
	to: string;
	children: string;
	showIcon?: boolean;
};

const AddNewButton = (props: Props) => {
	const { to, children, showIcon = true } = props;

	return (
		<Button
			component={Link}
			to={to}
			color='primary'
			variant='contained'
			startIcon={showIcon && <AddIcon />}
		>
			{children}
		</Button>
	);
};

export default AddNewButton;
