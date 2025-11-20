import { Box, Grid } from "@mui/material";
import FieldColumn from "src/components/FieldColumn";
import { DateField, TextField } from "src/components/form";
import { useTranslation } from "src/locale/i18n";

type BestowedDataProps = {
	note: string
}

const BestowedData = (props: BestowedDataProps) => {
	const { t } = useTranslation()

	return (
		<Box padding={3}>
			<Grid container spacing={3}>
				<Grid item md={2} xs={12}>
					<DateField 
						label={t("legalDocs:bestowed.vigenciaStart")}
						name="vigenciaStart"
					/>
				</Grid>
				<Grid item md={2} xs={12}>
					<DateField 
						label={t("legalDocs:bestowed.vigenciaEnd")}
						name="vigenciaEnd"
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField 
						label={t("legalDocs:bestowed.justify")}
						name="justify"
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField 
						label={t("legalDocs:bestowed.powers")}
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
		</Box>
	)
}

export default BestowedData;