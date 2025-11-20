import { BrowserRouter as Router } from 'react-router-dom';
import {
	Theme,
	Toolbar,
	createStyles,
	makeStyles,
	useTheme,
	useMediaQuery,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';

import Topbar from './components/menu/Topbar';
import Sidebar from './components/menu/Sidebar';
import Modals from './modals';
import { SwitchRouter } from './config/routes';

import { joinPaths } from './core/utils/func';
import { useCurrentUser } from './config/permissions';
import { useLockSystem } from './hooks/lockSystem';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(2),
			width: '100vh'
		},
	})
);

function App() {
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
	const { lock } = useLockSystem()

	const [open, setOpen] = useState(true);

	useEffect(() => {
		if (isMobile) setOpen(false);
	}, [isMobile]);

	const { routesWithPermissions } = useCurrentUser('')
	
	
	const routers = routesWithPermissions.map(menu => {

		const subroutes = menu.subroutes && !menu.component
			? menu.subroutes.map(submenu => ({
				title: submenu.title ?? '',
				path: joinPaths([menu.path, submenu.path])
			})) : undefined

		return {
			title: menu.title ?? '',
			icon: menu.icon,
			path: joinPaths([menu.path]),
			subroutes,
		}
	})
	return (
		<Router>
			<SnackbarProvider
				preventDuplicate
				maxSnack={3}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				autoHideDuration={5000}
			>
				<div className={classes.root}>
					<Topbar isOpen={open} handleClick={() => setOpen(!open)} />
					<Sidebar
						routers={lock ? [] : routers}
						isOpen={open}
						handleOpen={() => setOpen(true)}
						handleClose={() => setOpen(!open)}
					/>
					<main className={classes.content} data-testid='main-content'>
						<Toolbar />
						<SwitchRouter />
					</main>
				</div>
				<Modals />
			</SnackbarProvider>
		</Router>
	);
}

export default App;
