import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { default as MUTabs } from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles({
	root: {
		flexGrow: 1
	}
});
type Props = {
	value: number,
	onChange: (event: React.ChangeEvent<{}>, newValue: number) => void
	tabs: string[]
}

export default function Tabs({ value, onChange, tabs }: Props) {
	const classes = useStyles();

	return (
		<Paper className={classes.root} style={{ marginTop: "16px" }}>
			<MUTabs
				value={value}
				onChange={onChange}
				indicatorColor="primary"
				textColor="primary"
			>
				{tabs.map((lable, index) => <Tab key={`tab-${index}`} label={lable} />)}
			</MUTabs>
		</Paper>
	);
}
