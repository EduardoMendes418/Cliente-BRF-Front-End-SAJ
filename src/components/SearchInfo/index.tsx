import { Typography } from '@material-ui/core';
import { useTranslation } from 'src/locale/i18n';

type Props = {
	notFound?: boolean;
	closed?: boolean;
	error?: string | null;
}

const SearchInfo = ({ notFound, closed, error }: Props) => {
	const { t } = useTranslation()
	return (
		<>
			{
				error && (
					<Typography
						className='margin-top-16'
						style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '1000px' }}
					>
						{error}
					</Typography>
				)
			}
			{
				notFound && (
					<Typography className='margin-top-16'>
						{t('folderNotFound')}
					</Typography>
				)
			}
			{
				closed && (
					<Typography className='margin-top-16'>
						{t('folderClosed')}
					</Typography>
				)
			}
		</>
	)
}

export default SearchInfo