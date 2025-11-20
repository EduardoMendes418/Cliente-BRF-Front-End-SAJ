import { Box, Grid, Typography } from "@material-ui/core"

import { Upload } from "src/components/form"
import { t } from 'src/locale/i18n'

type Props = {
	isEditable: boolean
}

export default function OrderAttachments({ isEditable }: Props) {
	return (
		<Grid container spacing={2}>
		<Grid item xs={12}>
			<Box marginX={0} mb={1}>
				<Typography variant='h3'>
					{t('provisions:request.requestAttachments')}
				</Typography>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Upload
				id="files"
				multiple
				name="orderFiles"
				confirmDeletion
				disabled={!isEditable}
			/>
		</Grid>
	</Grid>
	)
}