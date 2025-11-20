import { ReactNode } from "react";
import { Divider, Grid, Box } from "@material-ui/core";

import Accordion from "../Accordion";
import { TPermissionType } from "src/core/models/profiles";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "src/config/permissions";
import CancelButton from "../button/Cancel";
import { MainDiv } from "./styled";

type TAccordionPanel = {
	title: string;
	children: ReactNode;
	startExpanded?: boolean;
	noContentMargin?: boolean;
	slotBottomRight?: ReactNode;
	slotBottonRightPermission?: TPermissionType | boolean;
	slotBottomLeft?: ReactNode;
	slotBottonLeftPermission?: TPermissionType | boolean;
	noSlotCancel?: boolean;
	slotTopRight?: ReactNode;
	slotTopRightPermission?: TPermissionType;
	onClickCancel?: () => void;
	ativateBorder?: boolean
};

const AccordionPanel = ({
	title,
	children,
	startExpanded,
	noContentMargin,
	slotBottomLeft,
	slotBottomRight,
	slotBottonLeftPermission,
	slotBottonRightPermission,
	slotTopRight,
	slotTopRightPermission,
	noSlotCancel,
	ativateBorder,
	onClickCancel
}: TAccordionPanel) => {
	const { id } = useParams<{ id: string }>();

	const { currentScreenPermissions } = useCurrentUser(id);

	return (
		<MainDiv ativateBorder={ativateBorder} className="margin-top-16 form-accordion" >
			<Accordion
				title={title}
				startExpanded={startExpanded}
				slotTopRight={slotTopRight}
				slotTopRightPermission={slotTopRightPermission}
			>
				<Grid direction="column" container>
					<Divider style={{ width: "100%" }} />
					<Box m={noContentMargin ? 0 : 3} maxWidth="100%">
						{children}
					</Box>
				</Grid>
			</Accordion>

			{(slotBottomRight || slotBottomLeft) && (
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					className="margin-top-24"
				>
					<Grid item data-testid="panel-bottom-left">
						{slotBottomLeft && (
							<Grid container spacing={2}>
								<Grid item>{!noSlotCancel && <CancelButton onClickCancel={onClickCancel} />}</Grid>
								<Grid item>
									{(typeof slotBottonLeftPermission === "boolean" &&
										slotBottonLeftPermission) ||
									(typeof slotBottonLeftPermission === "string" &&
										currentScreenPermissions[slotBottonLeftPermission])
										? slotBottomLeft
										: null}
								</Grid>
							</Grid>
						)}
					</Grid>
					<Grid item data-testid="panel-bottom-right">
						{slotBottomRight && (
							<Grid container spacing={2}>
								<Grid item>{!noSlotCancel && <CancelButton onClickCancel={onClickCancel}/>}</Grid>
								<Grid item>
									{(typeof slotBottonRightPermission === "boolean" &&
										slotBottonRightPermission) ||
									(typeof slotBottonRightPermission === "string" &&
										currentScreenPermissions[slotBottonRightPermission])
										? slotBottomRight
										: null}
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
			)}
		</MainDiv>
	);
};

export default AccordionPanel;
