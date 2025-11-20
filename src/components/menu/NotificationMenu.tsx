import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Badge,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import NotificationIcon from "@material-ui/icons/Notifications";
import QuestionAnswerRounded from "@material-ui/icons/HelpOutlineOutlined";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import CheckIcon from "@material-ui/icons/Check";
import { modal } from "src/components/modals";

import useUserNotifications from "src/hooks/useUserNotifications";
import {
	setAwareNotification,
	setPostponedNotification,
} from "src/core/store/modules/goods-guarantee/thunks";
import { t } from "src/locale/i18n";
import HelpModal from "./HelpModal";
import { getIsLockSystem } from "src/core/store/modules/lock-system/selectors";
import { getPermissionsCurrentUser } from "src/core/store/modules/currentUser/selectors";
import approvationFlowManagementAPI from "src/core/api/approvation-flow-management";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			marginRight: theme.spacing(2),
		},
		menu: {
			width: "261px",
			"& .MuiList-padding": {
				paddingTop: 0,
				paddingBottom: 0,
			},
		},
		menuTitle: {
			color: theme.palette.text.primary,
			alignSelf: "flex-start",
		},
		item: {
			display: "block",
			padding: "10px 16px",
			whiteSpace: "normal",
			color: "#787878",
			borderBottom: "1px solid #EFEFEF",
		},
		itemTitleSection: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			flexWrap: "nowrap",
		},
		itemBullet: {
			width: "16px",
			height: "16px",
			marginRight: "8px",
			borderRadius: "50%",
			backgroundColor: theme.palette.primary.dark,
		},
		itemTitle: {
			fontWeight: 600,
			display: "inline",
		},
		itemMessage: {
			fontSize: "12px",
			lineHeight: "22px",
			margin: "10px 10px 10px 0px",
		},
		itemMessageInfo: {
			fontSize: "10px",
			whiteSpace: "nowrap",
			margin: "10px 0px 10px 10px",
		},
		itemFooter: {
			fontSize: "10px",
			margin: "0",
			whiteSpace: "nowrap",
		},
		icons: {
			"& button + button": {
				marginLeft: "4px",
			},
		},
		badge: {
			backgroundColor: '#f44336',
			animation: '$pulse 2s infinite',

		},
		'@keyframes pulse': {
			'0%': {
				opacity: 1,
				transform: 'scale(1) translate(50%, -50%)',
				backgroundColor: '#f44336',
			},
			'50%': {
				opacity: 0.8,
				transform: 'scale(1.3) translate(50%, -50%)',
				backgroundColor: '#ff7961',
			},
			'100%': {
				opacity: 1,
				transform: 'scale(1) translate(50%, -50%)',
				backgroundColor: '#f44336',
			},
		}
	})
);

const NotificationMenu = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { notifications, removeTransientNotification } = useUserNotifications();
	const [genericNotifications, setGenericNotifications] = useState<string[]>([])

	const permition = useSelector(getPermissionsCurrentUser)

	const lock = useSelector(getIsLockSystem)

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const enfileiramento = permition.find((item) => item.name === 'integracoes/enfileiramento')

	const accountingMonitorPending = async () => {
		const { data } = await approvationFlowManagementAPI.list({ page: 1, processingStatuses: [3, 4] })
		if (data.itemCount) {
			setGenericNotifications(["Monitor de contabilização possui pendências"])
		}
	}

	useEffect(() => {
		if (enfileiramento?.view) {
			accountingMonitorPending()
		}
	}, [enfileiramento?.view])

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	let totalNotifications = lock ? 0 : notifications.length;
	totalNotifications = genericNotifications.length + Number(totalNotifications)
	return (
		<>
			<IconButton
				className={classes.button}
				onClick={handleClick}
				disabled={totalNotifications === 0}
			>
				{!!totalNotifications ? <Badge
					badgeContent={totalNotifications}
					color="primary"
					classes={{ badge: classes.badge }}
					showZero={false}
				>
					<NotificationIcon style={{ transform: "scale(1.25)" }} />
				</Badge> : <NotificationIcon style={{ transform: "scale(1.25)" }} />}

			</IconButton>
			<IconButton
				className={classes.button}
				onClick={() =>
					modal({
						title: "Gestão de Conhecimento",
						buttons: [],
						dialogProps: { maxWidth: "md", showCloseButton: true },
						component: <HelpModal />,
					})
				}
			>
				<QuestionAnswerRounded style={{ color: "#0C0C0C", transform: "scale(1.3)" }} />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				PopoverClasses={{ paper: classes.menu }}
				transformOrigin={{ vertical: "center", horizontal: "center" }}
				style={{ top: "64px", left: "20px" }}
			>
				{!!genericNotifications.length && genericNotifications.map((item) => <MenuItem className={classes.item}>
					<Typography variant="h3" className={classes.menuTitle}>
						{item}
					</Typography>
				</MenuItem>)}
				{!!notifications.length && <MenuItem className={classes.item}>
					<Typography variant="h3" className={classes.menuTitle}>
						{t("goodsAndGuarantees")}
					</Typography>
				</MenuItem>}

				{notifications.map((note) => (
					<MenuItem
						className={classes.item}
						onClick={handleClose}
						key={note.id}
					>
						<Box className={classes.itemTitleSection}>
							<Box display="flex" alignItems="center">
								<Box className={classes.itemBullet} />
								<Typography className={classes.itemTitle}>
									{note.goodsGuaranteesRequest.description}
								</Typography>
							</Box>
							<Box display="flex" className={classes.icons}>
								<IconButton
									size="small"
									onClick={() => {
										removeTransientNotification(note.id);
										dispatch(
											setPostponedNotification({
												id: note.id,
												isUserPostponed: true,
											})
										);
									}}
								>
									<AccessTimeIcon />
								</IconButton>
								<IconButton
									size="small"
									disabled={note.isUserAwared}
									onClick={() => {
										removeTransientNotification(note.id);
										dispatch(
											setAwareNotification({
												id: note.id,
												isUserAwared: true,
											})
										);
									}}
								>
									<CheckIcon />
								</IconButton>
							</Box>
						</Box>

						<Box display="flex">
							<Typography className={classes.itemMessage}>
								{note.message}
							</Typography>
							<Typography className={classes.itemMessageInfo}>
								nº {note.goodsGuaranteesRequestId}
							</Typography>
						</Box>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default NotificationMenu;

