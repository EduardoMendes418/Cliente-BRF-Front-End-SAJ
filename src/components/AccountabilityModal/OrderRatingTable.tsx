import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Typography, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import TableComponent, { ColumnData } from "src/components/Table";
import { t } from "src/locale/i18n";
import {
	getRatings,
	getPaymentOrders,
	getOrders,
} from "src/core/store/modules/provision-order/selectors";
import {
	TGroupedOrderRatingProbabilities,
	TProvisionOrderForm,
	TpaymentOrders,
} from "src/core/models/provision-order";
import { initialValuesPayment } from "./ProvisionForm";
import { PROBABILITY_TYPE_CAMEL } from "src/screen/provisions/utils/constantes";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { associatePaymentOrdersWithOrder } from "src/components/AccountabilityModal/OrderTable";
import { toNumber } from 'src/core/utils/func';


type OrderRatingTableProps = {
	isEditable: boolean;
	setFormValues: (overrideValues: Partial<TProvisionOrderForm>) => void;
	enableEditingOrderRating: () => void;
	paymentOrders: TpaymentOrders[];
	isSpecialSetFormValues?: boolean;
	dictionary?: any;
	form?: any;
	isOrderRatingDescription1Only?:boolean;
};

function OrderRatingTable({
	isEditable,
	setFormValues,
	enableEditingOrderRating,
	paymentOrders,
	isSpecialSetFormValues,
	dictionary,
	form,
	isOrderRatingDescription1Only
}: OrderRatingTableProps) {
	const ratings = useSelector(getRatings);
	const paymentOrdersTotal = useSelector(getPaymentOrders);
	const orders = useSelector(getOrders);

	// const ratingsorderRatingProbababilityId = ratings.filter(({value, orderRatingProbababilityId}) => orderRatingProbababilityId === 1 )
	
	const rows = useMemo(() => {
		const ratingsDictionary = ratings.reduce((acc, item) => {
			if (!acc[item.orderRatingDescriptionId])
				acc[item.orderRatingDescriptionId] =
					{} as TGroupedOrderRatingProbabilities;

			const groupingObj = acc[item.orderRatingDescriptionId];
			// orderRatingProbababilityId - 1 is expected to match ORDER_PROBABILITIES
			// and PROBABILITY_TYPE_CAMEL contants
			const probabilityType =
				PROBABILITY_TYPE_CAMEL[item.orderRatingProbababilityId - 1];
			const indexPayment = paymentOrders.findIndex(
				({ orderRatingId }) => orderRatingId === item.id
			);
			groupingObj[`${probabilityType}Value`] = item.value;
			groupingObj[`${probabilityType}Id`] = item.id;
			groupingObj[`${probabilityType}PaymentValue`] =
				indexPayment === -1 ? 0 : paymentOrders[indexPayment].value;
			groupingObj.orderRatingDescriptionId = item.orderRatingDescriptionId;
			groupingObj.riskValue = item.riskValue;
			groupingObj.dataBase = item.dataBase;
			groupingObj.formulaCorrectionRuleId = item.formulaCorrectionRuleId;
			groupingObj.orderRatingDescription = item.orderRatingDescription?.name;
			groupingObj.formulaCorrectionRule =
				item.formulaCorrectionRule?.formulaName;
			groupingObj.transientId = item.transientId;

			return acc;
		}, {} as any);

		const groupedOrderRatingProbabilites = Object.keys(ratingsDictionary).map(
			(key) => ratingsDictionary[key]
		);
		const filtredOrders = orders.filter(
			({ isActive, orderRatings, orderExpectationId }) => {
				if (!isActive) return false;
				if (orderExpectationId !== 1) return false;
	
				const orderRatingProbabability = orderRatings
					.filter(
						({ orderRatingProbababilityId, value }) =>
							orderRatingProbababilityId === 1 && value !== 0 && value !== null
					)
					.pop();
				if (orderRatingProbabability?.value === undefined) return false;
				return true;
			}
		);
	
		const paymentOrdersWithOrder = associatePaymentOrdersWithOrder(
			paymentOrdersTotal,
			filtredOrders
		);
		const valueOrderEqualValue = {};
	
		for (let index = 1; index <= 5; index++) {
			const value = paymentOrdersWithOrder
			.filter(
				({ orderRatingDescriptionId }: any) => orderRatingDescriptionId === index
			)
			.reduce((sum: number, { value }: any) => sum + Number(value), 0)
			const valueOrder = paymentOrdersWithOrder
			.filter(
				({ orderRatingDescriptionId }: any) => orderRatingDescriptionId === index
			)
			.reduce((sum: number, { valueOrder }: any) => sum + Number(valueOrder), 0)
			const formValue = form?.current?.values ? form.current.values[dictionary[index]] : undefined;
			const accountabilityValue = toNumber(`${formValue}`) as number;
			(valueOrderEqualValue as any)[index] = !!value && value === valueOrder && value < accountabilityValue
		}
		
		return groupedOrderRatingProbabilites.map((item) => ({
			...item,
			isRowEditable: !(valueOrderEqualValue as any)[item.orderRatingDescriptionId]
		})) as TGroupedOrderRatingProbabilities[];
	}, [ratings, paymentOrders, dictionary, form, orders, paymentOrdersTotal]);
	const sendOrderRatingToEditForm = (row: TGroupedOrderRatingProbabilities) => {
		const { orderRatingDescription, formulaCorrectionRule, ...rest } = row;
		setFormValues({ ...initialValuesPayment, ...rest });
		enableEditingOrderRating();
	};

	const openingTableColumns: ColumnData[] = [
		{
			label: "Ações",
			field: "action",
			component: (row: any) => {
				return (
					<>
						<IconButton
							aria-label="edit"
							onClick={() => sendOrderRatingToEditForm(row)}
						>
							{(
								isEditable && 
								(!isSpecialSetFormValues || row.isRowEditable) && 
								(!isOrderRatingDescription1Only || row.orderRatingDescriptionId === 1)
							)? <EditIcon /> : <VisibilityIcon />}
						</IconButton>
					</>
				);
			},
			type: "custom",
		},
		{
			label: t("provisions:request.table.openingDescription"),
			field: "orderRatingDescriptionId",
			component: (row: TGroupedOrderRatingProbabilities) =>
				row.orderRatingDescription,
			type: "custom",
		},
		{
			label: t("provisions:request.table.probableValue"),
			field: "probableValue",
			type: "currency",
		},
		{
			label: "Valor pagamento provável",
			field: "probablePaymentValue",
			type: "currency",
		},
		{
			label: t("provisions:request.table.possibleValue"),
			field: "possibleValue",
			type: "currency",
		},
		{
			label: "Valor pagamento possível",
			field: "possiblePaymentValue",
			type: "currency",
		},
		{
			label: t("provisions:request.table.remoteValue"),
			field: "remoteValue",
			type: "currency",
		},
		{
			label: "Valor pagamento remoto",
			field: "remotePaymentValue",
			type: "currency",
		},
		{
			label: t("provisions:request.table.baseDate"),
			field: "dataBase",
			type: "date",
		},
	];

	return (
		<Grid container>
			<Grid item xs={12}>
				<Box marginX={0} marginY={3}>
					<Typography variant="h3">
						{t("provisions:request.openingListTitle")}
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<TableComponent rows={rows} columns={openingTableColumns} />
			</Grid>
		</Grid>
	);
}

export default memo(OrderRatingTable);

