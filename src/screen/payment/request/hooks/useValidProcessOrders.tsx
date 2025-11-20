import { useSelector } from "react-redux";
import { TProvisionOrder } from "src/core/models/provision-order";
import { getProvisionsProcess } from "src/core/store/modules/provision-order/selectors";

const useValidProcessOrders = () => {
	const process = useSelector(getProvisionsProcess);

	const validProcessOrders = process?.orders?.filter((order: TProvisionOrder) => {
		return (
			order.isActive === true &&
			order.orderDescription?.sumProvision === true &&
			order.orderStatus?.name === "Aprovado" &&
			order.orderExpectation?.name === "Perda"
		);
	});

	return validProcessOrders;
};

export default useValidProcessOrders;
