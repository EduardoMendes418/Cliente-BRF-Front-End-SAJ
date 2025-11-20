import { toNumber } from "src/core/utils/func";
import { setPaymentOrders } from 'src/core/store/modules/provision-order';
import { useDispatch, useSelector } from "react-redux";
import {
	getOrders,
} from "src/core/store/modules/provision-order/selectors";
import { usePaymentType } from "src/hooks/fetchLists";
import { Modulos } from "src/core/models/modules";
import {
	getPaymentSearch,
} from "src/core/store/modules/payment/selectors";

export const HandleOnBlurProvision = () => {
	const orders = useSelector(getOrders);
	const dispatch = useDispatch();
	const { paymentType } = usePaymentType(Modulos.Pagamento);
	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	const handleOnBlur = (event: any, orderRatingDescription = 1) => {
	
		if (tipoPagamento?.abaterSaldoProvisao !== 1) return
		const numberValue = toNumber(event?.target?.value ?? 0)
		const filtredOrders = orders.filter(({isActive, orderRatings, orderExpectationId}) => {
			if (!isActive) return false
			if (orderExpectationId !== 1) return false
	
			const orderRatingProbabability = orderRatings.filter(({orderRatingProbababilityId, value}) => orderRatingProbababilityId === 1 && value !== 0 && value !== null).pop()
			if (orderRatingProbabability?.value === undefined) return false
			return true
		})
		const justOrderRating = filtredOrders.map(({orderRatings})=> orderRatings).flat(1)
		const fitredOrderRating = justOrderRating.filter(({orderRatingDescriptionId, value, orderRatingProbababilityId}) => value && orderRatingDescriptionId === orderRatingDescription && orderRatingProbababilityId === 1)
		const totalValueOrderRating = fitredOrderRating.reduce((sum, { value }) => sum + Number(value), 0)
		if (fitredOrderRating.length === 1) {
			dispatch(setPaymentOrders({
				id: 0,
				paymentId: 0,
				orderRatingId: Number(fitredOrderRating[0].id),
				value: numberValue
			}))
			return
		}
		fitredOrderRating.map(({value, id}) => dispatch(setPaymentOrders({
			id: 0,
			paymentId: 0,
			orderRatingId: Number(id),
			value: numberValue >= totalValueOrderRating ? value : 0
		})))
	}
	return { handleOnBlur }
}
