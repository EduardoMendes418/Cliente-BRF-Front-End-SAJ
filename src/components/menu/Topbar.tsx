import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Grid, IconButton, Toolbar } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import { LogoIcon } from 'src/components/icons';

import UserInfo from './UserInfo';
import NotificationMenu from './NotificationMenu';
import { DRAWER_WIDTH } from './Sidebar';
import MeiaLua from 'src/components/icons/MeiaLua'
import { getEnvironment } from 'src/core/utils/func';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			backgroundColor: theme.palette.background.paper,
		},
		menuButton: {
			marginRight: theme.spacing(2) + 4,
			color: '#202020',
			transform: "translate(22px, 2px)"
		},
		menuButtonOpen: {
			marginRight: theme.spacing(2) + 4,
			color: '#202020',
			transform: "translate(24px, 2px)"
		},
		menuButtonClose: {
			marginRight: theme.spacing(2),
			color: '#202020',
			transform: "translate(15px, 0px)",
			transition: ".5s"
		},
		divisor: {
			height: '2px',
			width: '100%',
			position: 'absolute',
			bottom: 0,
			background:
				'linear-gradient(90deg, #FFC20E 0.01%, #F58220 21.27%, #E31F26 41.75%, #9D2C4E 62.24%, #812990 82.72%)',
		},
		menuIcon: {
			display: 'flex',
			justifyContent: 'space-between',
			width: DRAWER_WIDTH,
			flexShrink: 0,
			whiteSpace: 'nowrap',
			[theme.breakpoints.down('xs')]: {
				width: 0,
			},
		},
		menuIconOpen: {
			width: DRAWER_WIDTH,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			[theme.breakpoints.down('xs')]: {
				width: theme.spacing(8) + 1,
			},
		},
		menuIconClose: {
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflow: 'hidden',
			width: theme.spacing(8) + 8,
		},
		logo: {
			marginLeft: theme.spacing(1),
		},
		logoShow: {
			opacity: '1',
			transition: theme.transitions.create('opacity', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			[theme.breakpoints.down('xs')]: {
				opacity: '0',
			},
		},
		logoHidden: {
			opacity: '0',
			transition: theme.transitions.create('opacity', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflow: 'hidden',
		},
	})
);

type HeaderProps = {
	isOpen: boolean;
	handleClick: () => void;
};

const Topbar = (props: HeaderProps) => {
	const classes = useStyles();
	const { isOpen, handleClick } = props;
	const environment = getEnvironment()

	return (
		<AppBar
			position='fixed'
			className={classes.appBar}
			elevation={0}
			data-testid='topbar'
		>
			<Toolbar disableGutters>
				
				<Grid container justifyContent='space-between'>
					<Grid item container xs={6} justifyContent='space-between'>
						<div
							className={clsx(classes.menuIcon, {
								[classes.menuIconOpen]: isOpen,
								[classes.menuIconClose]: !isOpen,
							})}
						>
							<div
								className={clsx(classes.logo, {
									[classes.logoShow]: isOpen,
									[classes.logoHidden]: !isOpen,
								})}
								data-testid='topbar-logo'
							>
								<LogoIcon />
								<MeiaLua />
								<div className='logo-SAJ'>
									<h2>SAJ</h2>
									<h5>Sistema Administrativo Jurídico</h5>
								</div>
								
							</div>
							<IconButton
								color='inherit'
								aria-label='isOpen drawer'
								onClick={handleClick}
								edge='start'
								className={isOpen ? classes.menuButtonOpen : classes.menuButtonClose}
								data-testid='topbar-menu-icon'
							>
								<MenuIcon />
							</IconButton>
							
						</div>
					</Grid>
					{environment !== 'PRD' && (
						<div className='environmentBox'>
							<div>
								<h3>
									{environment}
								</h3>
							</div>
						</div>
					)}
					<Grid item container xs={6} justifyContent='flex-end'>
						<Grid item>
							<NotificationMenu />
						</Grid>
						<Grid item>
							<UserInfo />
						</Grid>
					</Grid>
				</Grid>
			</Toolbar>
			<div className={classes.divisor}></div>
		</AppBar>
	);
};

export default Topbar;
