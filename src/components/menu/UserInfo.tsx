import { useState, MouseEvent, useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import {
	Avatar,
	ButtonBase,
	Grid,
	Hidden,
	Menu,
	MenuItem,
	Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import { getInitials } from 'src/core/utils/func';
import { getDataCurrentUser, getLoadingCurrentUser } from 'src/core/store/modules/currentUser/selectors';

const UserInfo = () => {
	const { instance, accounts } = useMsal();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const { email, name } = useSelector(getDataCurrentUser)
	const loading = useSelector(getLoadingCurrentUser)

	const account = useMemo(() => ({
		name: name || accounts[0].name || '',
		email: email || accounts[0].username || '',
	}), [email, name, accounts])

	const logout = () => {
		const config = {
			account: accounts[0],
			postLogoutRedirectUri: `${window.location.origin}`
		}
		instance.logoutRedirect(config)
	}

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const onClose = () => setAnchorEl(null)

	return (
		<Grid container spacing={2} data-testid='accountinfo'>
			<Grid item>
				<Hidden xsDown>
					<Typography
						color='textPrimary'
						variant='h4'
						align='right'
						data-testid='accountinfo-name'
					>
						{loading ? <Skeleton width={170} height={25} /> : account.name}
					</Typography>
					<Typography
						color='textSecondary'
						variant='body2'
						align='right'
						data-testid='accountinfo-id'
					>
						{loading ? <Skeleton width={170} /> : account.email}
					</Typography>
				</Hidden>
			</Grid>
			<Grid item>
				<ButtonBase onClick={handleClick}>
					{
						loading
							? <Skeleton variant='circular' height={40} width={40} />
							: <Avatar>{getInitials(account.name)}</Avatar>
					}
					<ArrowDropDownRoundedIcon color='action' fontSize='large' />
				</ButtonBase>
				<Menu
					data-testid='userinfo-menu'
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={onClose}
				>
					<MenuItem onClick={logout}>Sair</MenuItem>
				</Menu>
			</Grid>
		</Grid>
	);
};

export default UserInfo;
