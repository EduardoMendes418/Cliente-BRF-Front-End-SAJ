import { Box, Grid } from "@mui/material";
import FieldColumn from "src/components/FieldColumn";
import { TextField } from "src/components/form";
import { useTranslation } from "src/locale/i18n";
import Clean from "src/components/button/Clean";

type ProcessDataProps = {
	note: string
}

const ProcessData = (props: ProcessDataProps) => {
	const { t } = useTranslation()

	return (
		<Box padding={3}>
			<Grid container spacing={3}>
				<Grid item md={12} xs={12}>
					<TextField 
						label={t("legalDocs:process.justify")}
						name="observationProcess"
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField 
						label={t("legalDocs:process.powers")}
						name="powers"
					/>
				</Grid>
				<Grid item md={12}>
					<FieldColumn
						label={t("legalDocs:noteLabel")}
						value={props.note}
					/>
				</Grid>
			</Grid>
			<Clean/>
		</Box>
	)
}

export default ProcessData;