import { ReactNode, useState } from "react";
import MuiAccordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "src/config/permissions";
import { TPermissionType } from "src/core/models/profiles";
import api from 'src/core/api/e-social-event-launch'

type AccordionProps = {
	title: string;
	children: ReactNode;
	disabled?: boolean;
	startExpanded?: boolean;
	slotTopRight?: ReactNode;
	slotTopRightPermission?: TPermissionType;
	handleExpandWithRequest?: Function;
	doRequestWhenExpand?: boolean;
};

const Accordion = (props: AccordionProps) => {
	const { title, children, disabled = false, slotTopRight, slotTopRightPermission, startExpanded } = props;

	const [expanded, setExpanded] = useState(startExpanded || false);
	const { id } = useParams<{ id: string }>();
	const { currentScreenPermissions } = useCurrentUser(id);


	const handleExpand = () => {
        setExpanded(!expanded);
    };

	const handleExpandWithRequestCall = async () => {
		if(expanded === false){
			const splittedId = id.split(":")[0];
			const { data } = await api.getGovernmentResponses({id: splittedId}) as any;
			if(props.handleExpandWithRequest){
				await props.handleExpandWithRequest(data?.items) 
			}
		}
		setExpanded(!expanded)
	}

	return (
		<MuiAccordion
			disabled={disabled}
			elevation={0}
			defaultExpanded={props.startExpanded}
			onChange={props.doRequestWhenExpand === true ? handleExpandWithRequestCall : handleExpand}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Grid
					container
					justifyContent="space-between"
					alignItems="center"
					className="panel-header"
					data-testid="panel-header"
				>
					<Grid item>
						<Typography
							variant="h2"
							style={{ padding: "0", marginLeft: "16px"}}
							data-testid="accordion-title"
						>
							{title}
						</Typography>
					</Grid>
					{slotTopRight &&
						slotTopRightPermission &&
						currentScreenPermissions[slotTopRightPermission] && (
							<Grid item>{slotTopRight}</Grid>
						)}
				</Grid>
			</AccordionSummary>
			<AccordionDetails>{expanded ? children : null}</AccordionDetails>
		</MuiAccordion>
	);
};

export default Accordion;

