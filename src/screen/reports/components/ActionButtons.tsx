import { Box, Button, CircularProgress } from "@material-ui/core";
import { Submit } from 'src/components/button';
import { t } from "src/locale/i18n";

type TActionButtons = {
	isSavingConfiguration: boolean;
	isGeneratingReport: boolean;
	generateReport: () => void;
}

const ActionsButton = ({ isSavingConfiguration, isGeneratingReport, generateReport }: TActionButtons) => (
	<Box display='flex' alignItems='center'>
		<Submit submitting={isSavingConfiguration} disabled={isGeneratingReport} />
		{ isGeneratingReport
			? <CircularProgress style={{ marginLeft: 16 }} />
			: (
				<Button
					style={{ marginLeft: 16 }}
					color="primary"
					type="button"
					variant={isSavingConfiguration ? undefined : "contained"}
					disabled={isSavingConfiguration}
					onClick={generateReport}
				>
					{t('reports:createReportButton')}
				</Button>
			)
		}
	</Box>
)

export default ActionsButton;