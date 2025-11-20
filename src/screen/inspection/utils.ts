import { useLocation, useParams } from "react-router-dom";

export const useStage = () => {
	const { id } = useParams<{ id: string }>();
	const { pathname } = useLocation();

	const isNew = id === "novo";
	const isSolicitation = pathname.includes("solicitacao");
	const isLegalControlValidation = pathname.includes(
		"aprovacao-controle-juridico"
	);
	const isInternalLawyerApproval = pathname.includes(
		"aprovacao-advogado-interno"
	);

	return {
		isNew,
		isSolicitation,
		isLegalControlValidation,
		isInternalLawyerApproval,
	};
};
