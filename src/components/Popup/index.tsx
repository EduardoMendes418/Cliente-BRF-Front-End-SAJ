import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Box, Divider, IconButton, Popover, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		popover: {
			pointerEvents: 'none',
		},
		paper: {
			padding: theme.spacing(0),
		},
	}),
);

type PopupProps = {
	children: ReactNode
	icon: ReactNode
	color?: "inherit" | "default" | "error" | "success" | "warning" | "info" | "primary" | "secondary" | undefined
	title?: string
}

const Popup = (props: PopupProps) => {
	const classes = useStyles();
	const [anchor, setAnchor] = useState<HTMLElement | null>(null)

	const handlerOnEnter = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setAnchor(event.currentTarget)
	}

	const handlerOnLeave = () => {
		setAnchor(null)
	}

	const open = Boolean(anchor)

	return (
		<>
			<IconButton
				aria-owns={open ? "mouse-over-popover" : undefined}
				aria-haspopup="true"
				size="small"
				onMouseEnter={handlerOnEnter}
				onMouseLeave={handlerOnLeave}
				color={props.color ?? "secondary"}
			>
				{props.icon}
			</IconButton>
			<Popover
				id="mouse-over-popover"
				className={classes.popover}
				classes={{
					paper: classes.paper,
				}}
				open={open}
				anchorEl={anchor}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				onClose={handlerOnLeave}
				elevation={3}
				disableRestoreFocus
			>
				{
					props.title && (
						<>
							<Typography variant="subtitle2" padding={1} >
								{props.title}
							</Typography>
							<Divider />
						</>
					)
				}
				<Box padding={1}>
					{props.children}
				</Box>
			</Popover>
		</>
	)
}

export default Popup