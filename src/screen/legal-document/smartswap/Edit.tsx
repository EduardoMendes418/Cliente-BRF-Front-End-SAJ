import { Box, Grid } from "@mui/material"
import { Submit } from "src/components/button"
import Panel from "src/components/Panel"
import UserField from "src/components/UserField"
import { useTranslation } from "src/locale/i18n"

type EditProps = {
	fetching: boolean
}

const Edit = (props: EditProps) => {
	const { t } = useTranslation()

	return (
		<>
			<Panel title={t("legalDocs:smartSwap.edit")} withPadding>
				<Grid container spacing={2}>
					<Grid item md={3} xs={12}>
						<UserField
							name='serviceUserId'
							label={t('legalDocs:smartSwap.serviceUserId')}
							setInvalidValueWhenTyping
						/>
					</Grid>
				</Grid>
			</Panel>
			<Box mt="20px" textAlign="right">
				<Submit
					text={t("legalDocs:smartSwap.execute")}
					submitting={props.fetching}
				/>
			</Box>
		</>
	)
}

export default Edit