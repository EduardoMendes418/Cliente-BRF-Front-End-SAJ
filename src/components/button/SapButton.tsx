import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

import { Button } from "src/components/button";
// import { ESocialEventLaunchStatus } from 'src/core/models/e-social-events';
// import { getItemESocialEventLauch } from "src/core/store/modules/e-social-event-launch/selectors";
import api from 'src/core/api/e-social-event-launch'
import { useSnackbar } from 'notistack';

const SapButton = () => {
	const params: { id: string } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	const { location: { pathname }, ...history } = useHistory()

	// const { eventLaunchStatus } = useSelector(getItemESocialEventLauch) as any;
	// if (!(eventLaunchStatus === ESocialEventLaunchStatus?.Pendente ||
	// 	eventLaunchStatus === ESocialEventLaunchStatus?.['Erro Validador'])) return null


	const idESocial = params?.id?.split(':')?.[0];
	const handleClick = async () => {
		try {
			await api.sendToSAP({id:idESocial});
			enqueueSnackbar("Enviado para o SAP com sucesso.", {
				variant: "success",
			})
			history.push(pathname.replace(/\/[^/]+$/, ''))
			
		} catch (error) {
			enqueueSnackbar("Algo deu errado no envio", {
				variant: "error",
			})
		}
	}

	return (
		<Button
			color="primary"
			variant="contained"
			text="Enviar ao SAP"
			onClick={handleClick}
		/>
	);


};

export default SapButton;
