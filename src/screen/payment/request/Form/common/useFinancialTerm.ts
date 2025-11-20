import moment from "moment";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { getParameterizationItems } from "src/core/store/modules/parameterization/selectors";

const useFinancialTerm = () => {
	const { prazoDiasFinanceiro } = useSelector(getParameterizationItems);
	const { enqueueSnackbar } = useSnackbar();


	return (date: any) => {
		const dateLimit = moment().add(prazoDiasFinanceiro, 'days');
		const isOnLimit = moment(date).diff(dateLimit, 'days') < 0;
		if (isOnLimit) {
			enqueueSnackbar(
				`A solicitação efetuada é fora do prazo de ${prazoDiasFinanceiro} dias e será comunicado ao gerente da área.`,
				{ variant: 'warning' }
			);
		}
	};
}

export default useFinancialTerm