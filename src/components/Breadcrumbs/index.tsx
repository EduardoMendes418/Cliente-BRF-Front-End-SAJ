import { Link } from 'react-router-dom';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Breadcrumbs, Typography } from '@material-ui/core';

export type PathProps = {
	label: string;
	url?: string;
	onClick?: Function;
};

const ListBreadcrumbs = (props: { paths: PathProps[] }) => {
	const { paths } = props;

	return (
		<Breadcrumbs
			separator={<ArrowRightIcon fontSize='small' color='primary' />}
			aria-label='breadcrumb'
			data-testid='breadcrumbs'
			className='breadcrumbs'
		>
			{paths.map(({ label, url, onClick }) =>
				url ? (
					<Link
						to={url}
						data-testid='breadcrumbs-item'
						key={label}
						className='link'
					>
						{label}
					</Link>
				) : (
					<Typography
						color='textSecondary'
						data-testid='breadcrumbs-item'
						key={label}
						className={onClick ? 'link': ''}
						onClick={() => onClick && onClick()}
					>
						{label}
					</Typography>
				)
			)}
		</Breadcrumbs>
	);
};

export default ListBreadcrumbs;
