import { Box, Grid } from "@material-ui/core"
import { Button } from "src/components/button"
import { useTranslation } from "src/locale/i18n"

type ButtonsProps = {
	onSend: () => void
	onSave: () => void
	onBack: () => void
	onCancel: () => void
}

const Buttons = (props: ButtonsProps) => {
	const { t } = useTranslation();

	return (
		<Box padding={2}>
			<Grid container spacing={1} direction="row" justifyContent="flex-end">
				<Grid item>
					<Button onClick={props.onBack} text={t("back")} color="inherit" />
				</Grid>
				<Grid item>
					<Button
						onClick={props.onCancel}
						text={t("cancel")}
						style={{
							backgroundColor: "red",
						}}
					/>
				</Grid>
				<Grid item>
					<Button onClick={props.onSave} text={t("btnSalvarEdicao")} />
				</Grid>
				<Grid item>
					<Button onClick={props.onSend} text={t("send")} />
				</Grid>
			</Grid>
		</Box>
	)
}

export default Buttons;