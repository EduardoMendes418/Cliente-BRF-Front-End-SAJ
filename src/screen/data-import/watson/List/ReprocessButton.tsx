import React, {useState} from 'react';
import { Button, CircularProgress, } from "@material-ui/core";
import { useSnackbar } from 'notistack';
import api from "src/core/api/watson-export"
import { IconButton } from "@material-ui/core";
import ReplayIcon from '@material-ui/icons/Replay';
interface ReprocessButtonProps {
	executionStatus: number;
	watsonLoadExecutionId: string;
}

const ReprocessButton: React.FC<ReprocessButtonProps> = ({ executionStatus, watsonLoadExecutionId }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [buttonClicked, setButtonClicked] = useState(false);

	const handleReprocessClick = async () => {
		try {
			setButtonClicked(true)
			const response = await api.reprocessReturnFile(watsonLoadExecutionId);
			setButtonClicked(false)
			enqueueSnackbar('Reprocessamento iniciado com sucesso.', { variant: 'success' });
		} catch (error) {
			console.error('Erro ao iniciar reprocessamento', error);
			enqueueSnackbar('Erro ao iniciar reprocessamento', { variant: 'error' });
		}
	};

	return (
		<div>
			{executionStatus === 8 && (
				buttonClicked ? <CircularProgress /> : <IconButton
						color="default"
						size="small"
						onClick={handleReprocessClick}
					>
						<ReplayIcon />
					</IconButton>
			)}
		</div>
	);
};

export default ReprocessButton;
