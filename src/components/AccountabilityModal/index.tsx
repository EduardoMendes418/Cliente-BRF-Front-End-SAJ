import { useSelector } from "react-redux";
import { TpaymentOrders, TProvisionOrder } from "src/core/models/provision-order";
import {
	getProvisionsProcess,
	getProvisionsProcessRequestScreenLoading,
	getPaymentOrders
} from "src/core/store/modules/provision-order/selectors";

import {useManageFormFieldsProvision} from "src/screen/provisions/hooks/use-manage-provision-form-fields";
import OrderTable from "./OrderTable";
import ProvisionForm from "./ProvisionForm";

type Props = {
	folderNumber: string;
	handleSubmitModal?: (accountabilityOrders: TpaymentOrders[]) => void;
	isEditable: boolean;
	form?: any
	isSpecialSetFormValues?: boolean
	dictionary?: any;
	isOrderRatingDescription1Only?: boolean
};

const AccountabilityModal = ({ isEditable, form, isSpecialSetFormValues, dictionary, isOrderRatingDescription1Only = false }: Props) => {
	const {
		formikRef,
		setFormValues,
		onChangeOrderDescription,
		clearOrderDescription,
	} = useManageFormFieldsProvision();

	const process = useSelector(getProvisionsProcess);
	const paymentOrders = useSelector(getPaymentOrders);
	const isLoading = useSelector(getProvisionsProcessRequestScreenLoading);

	const validProcessOrders = process?.orders.filter((order: TProvisionOrder) => { return order.isActive === true && order.orderDescription?.sumProvision === true && order.orderStatus?.name === "Aprovado" && order.orderExpectation?.name === "Perda"}) 

	return (
		<>
			<OrderTable
				process={validProcessOrders }
				paymentOrders={paymentOrders}
				setFormValues={setFormValues}
				isLoading={isLoading}
				isEditable={isEditable}
			/> 
			<ProvisionForm
				formikRef={formikRef}
				isEditable={isEditable}
				setFormValues={setFormValues}
				onChangeOrderDescription={onChangeOrderDescription}
				clearOrderDescription={clearOrderDescription}
				paymentOrders={paymentOrders}
				form={form}
				isSpecialSetFormValues={isSpecialSetFormValues}
				dictionary={dictionary}
				isOrderRatingDescription1Only={isOrderRatingDescription1Only}
			/>
		</>
	);
};

export default AccountabilityModal;

