import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import {
	Collapse,
	Drawer,
	Box,
	Hidden,
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
	Toolbar,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLoadingCurrentUser } from 'src/core/store/modules/currentUser/selectors';

type RouterProps = {
	title: string;
	path: string;
	icon?: ReactNode;
	subroutes?: RouterProps[];
};

type MenuProps = {
	isOpen: boolean;
	routers: RouterProps[];
	handleOpen: () => void;
	handleClose: () => void;
};

export const DRAWER_WIDTH = "340px";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		drawer: {
			width: DRAWER_WIDTH,
			flexShrink: 0,
			whiteSpace: 'nowrap',
		},
		drawerOpen: {
			width: DRAWER_WIDTH,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		drawerClose: {
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflowX: 'hidden',
			width: theme.spacing(6) + 1,
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(8) + 1,
			},
		},
		drawerPaper: {
			width: DRAWER_WIDTH,
		},
		nested: {
			paddingLeft: theme.spacing(4),
		},
		colorDefault: { color: '#000' }
	})
);

const SkeletonMenuItem = () => (
	<Box my={1} ml={2} mr={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
		<Skeleton height={25} width={25} variant="circular" />
		<Skeleton height={40} width={225} />
	</Box>
)

const Sidebar = (props: MenuProps) => {
	const { isOpen, routers, handleClose, handleOpen } = props;
	const classes = useStyles();
	const location = useLocation();

	const loadingPermissions = useSelector(getLoadingCurrentUser)
	const [open, setOpen] = useState(-1);
	const [countSkeletonItems, setCountSkeletonItems] = useState(1);

	useEffect(() => {
		if (!isOpen) setOpen(-1);
	}, [isOpen]);

	useEffect(() => {
		if (loadingPermissions) setTimeout(() => {
			if (countSkeletonItems > 4) setCountSkeletonItems(1)
			else setCountSkeletonItems(countSkeletonItems + 1)
		}, 750)
	}, [countSkeletonItems, loadingPermissions]);

	const showSubitems = (index: number) => {
		if (index === open) {
			setOpen(-1)
		} else {
			handleOpen();
			setOpen(index);
		}
	};

	const container =
		window !== undefined ? () => window.document.body : undefined;

	const menuSubitem = (subitem: RouterProps, index: number) => {
		if (!subitem.path) return;
		const selected = 
			location.pathname === subitem.path || 
			location.pathname === `${subitem.path}/novo`;

		return (
			<MenuItem
				component={Link}
				to={subitem.path}
				selected={selected}
				key={`menu-subitem-${index}`}
				className={(classes.nested, 'menuSubItem')}
				data-testid='sidebar-submenuItem'
			>
				<ListItemText primary={'•'} className="dot" />
				<ListItemText primary={subitem.title} />
			</MenuItem>
		);
	};

	const menuItem = (item: RouterProps, index: number) => {
		const { subroutes = [] } = item;

		const hasSubitem = subroutes.length > 0

		const selected =
			!!item.path &&
			(item.path === location.pathname ||
				(item.path !== '/' && location.pathname.startsWith(item.path)));

		return (
			<MenuList key={`menu-item-${index}`}>
				<MenuItem
					component={hasSubitem ? 'li' : Link}
					to={item.path}
					selected={selected}
					onClick={() => hasSubitem && showSubitems(index)}
					className='menuItem'
					data-testid='sidebar-menuItem'
				>
					<ListItemIcon>{item.icon ?? null}</ListItemIcon>
					<ListItemText primary={item.title} />
					{
						hasSubitem
							? open === index
								? (
									<ExpandMore />
								)
								: (
									<ChevronRightOutlinedIcon />
								)
							: null
					}
				</MenuItem>

				{hasSubitem && (
					<Collapse
						in={open === index}
						timeout='auto'
						unmountOnExit
						data-testid='sidebar-submenu'
					>
						<MenuList>
							{subroutes.map(menuSubitem)}
						</MenuList>
					</Collapse>
				)}
			</MenuList>
		);
	};

	const drawer = routers.map(menuItem);

	return (
		<nav aria-label='mailbox folders' className='sidebar'>
			<Hidden smUp>
				<Drawer
					className={classes.drawer}
					container={container}
					variant='temporary'
					anchor='left'
					open={isOpen}
					onClose={handleClose}
					classes={{
						paper: classes.drawerPaper,
					}}
					ModalProps={{
						keepMounted: true,
					}}
					data-testid='sidebar'
				>
					{drawer}
				</Drawer>
			</Hidden>
			<Hidden xsDown>
				<Drawer
					variant='permanent'
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: isOpen,
						[classes.drawerClose]: !isOpen,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: isOpen,
							[classes.drawerClose]: !isOpen,
						}),
					}}
					data-testid='sidebar'
				>
					<Toolbar />
					{drawer}
					{
						loadingPermissions
						&& Array(countSkeletonItems)
							.fill(null)
							.map((_, idx) => <SkeletonMenuItem key={`skmi-${idx}`} />)
					}
				</Drawer>
			</Hidden>
		</nav>
	);
};

export default Sidebar;
