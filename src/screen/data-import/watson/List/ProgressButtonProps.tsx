import React from 'react';
import { useState } from 'react';
import { Button, CircularProgress, } from "@material-ui/core";
import { useSnackbar } from 'notistack';
import api from "src/core/api/watson-export"
import { IconButton } from "@material-ui/core";
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
interface ProgressButtonProps {
	executionStatus: number;
	watsonLoadExecutionId: string;
}
interface StatusResponse {
	SentToQueue?: number;
	ProcessingError?: number;
	Processed?: number;
	NotProcessed?: number;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({ executionStatus, watsonLoadExecutionId }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [buttonClicked, setButtonClicked] = useState(false);

	const handleProgressClick = async () => {
		try {
			setButtonClicked(true)
			const response = await api.getWatsonStatusreturnFile(watsonLoadExecutionId);
			const data = response.data;
			setButtonClicked(false)

			const formattedMessage = `Processando Arquivo Retorno ID: ${watsonLoadExecutionId} Status: Enviado para Fila = ${data.SentToQueue ?? 0} - Erro Processamento = ${data.ProcessingError ?? 0} - Processado = ${data.NotProcessed ?? 0}`;
			enqueueSnackbar(formattedMessage, { variant: 'info' });
		} catch (error) {
			setButtonClicked(false)
			console.error('Erro ao buscar o status', error);
			enqueueSnackbar('Erro ao buscar o status', { variant: 'error' });
		}
	};


	const formatStatus = (status: StatusResponse): string => {
		if (status.ProcessingError) {
			return '2 - Erro Processamento';
		}
		if (status.SentToQueue) {
			return '1 - Enviado a fila';
		}
		if (status.Processed) {
			return '3 - Processado';
		}
		if (status.NotProcessed) {
			return '4 - Não Processado';
		}
		return 'Status Desconhecido';
	};

	return (
		<div>
			{executionStatus === 7 && (
				buttonClicked ? <CircularProgress /> : <IconButton
					color="default"
					size="small"
					onClick={handleProgressClick}
				>
					<HourglassEmptyIcon />
				</IconButton>

			)}
		</div>
	);
};

export default ProgressButton;
