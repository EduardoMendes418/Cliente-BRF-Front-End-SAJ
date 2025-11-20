import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FormControlLabel, IconButton, Switch } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AttachmentIcon from "@material-ui/icons/Attachment";

import AccordionPanel from "src/components/AccordionPanel";
import TableComponent, { ColumnData } from "src/components/Table";
import {
	clearOrderToEdit,
	deleteOrder,
	editOrder,
	setOrderToEdit,
} from "src/core/store/modules/provision-order";
import { getOrders } from "src/core/store/modules/provision-order/selectors";
import { useCurrentUser } from "src/config/permissions";
import { confirm } from "src/components/modals";
import {
	TOrderRating,
	TProvisionOrder,
	TProvisionOrderForm,
	TProvisionProcess,
} from "src/core/models/provision-order";
import { t } from "src/locale/i18n";

import {
	getOrderForm,
	getOrderRatingForm,
} from "../utils/func";

type OrderTableProps = {
	process: TProvisionProcess;
	setFormValues: (overrideValues: Partial<TProvisionOrderForm>) => void;
	isEditable: boolean;
	isLoading: boolean;
	setToActive: any;
};

export default function OrderTable({
	process,
	setFormValues,
	isEditable,
	isLoading,
	setToActive,
}: OrderTableProps) {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const { currentScreenPermissions } = useCurrentUser(id);

	const orders: any = useSelector(getOrders);

	const resetForm = useCallback(() => {
		const emptyForm = { ...getOrderForm(), ...getOrderRatingForm() };
		setFormValues(emptyForm);
		dispatch(clearOrderToEdit());
	}, [dispatch, setFormValues]);

	const handleEdit = useCallback(
		(row: TProvisionOrder) => {
			dispatch(setOrderToEdit(row));
			const orderFormValues = getOrderForm(row);
			setFormValues(orderFormValues);
		},
		[dispatch, setFormValues]
	);

	const handleDelete = useCallback(
		(row: any) => {
			dispatch(deleteOrder(row));
		},
		[dispatch]
	);

	const handleSwitchButton = useCallback(
		async (row: TProvisionOrder) => {
			const newOrder: TOrderRating[] = [];

			if (row.isActive === false) {
				setToActive(true)
				dispatch(editOrder({ ...row, isActive: !row.isActive }));
				return;
			}

			if (row.isActive === true) {
				const changeStatus = await confirm(
					"Todos os valores das aberturas e probabilidades serão zerados. Deseja continuar?",
					t("watchout")
				);
				if (changeStatus === true) {
					const orderRatings = row.orderRatings;

						handleEdit(row);

						orderRatings.forEach((rating) => {
							newOrder.push({ ...rating, value: 0 });
						});

					dispatch(
						editOrder({
							...row,
							isActive: !row.isActive,
							orderRatings: newOrder,
						})
					);
					resetForm();
				} else {
					return;
				}
			}
		},
		
		[dispatch, handleEdit, resetForm]
	);

	const requestTableColumns: ColumnData[] = useMemo(
		() => [
			{
				label: "Ações",
				field: "",
				component: (row: any) => {
					return (
						<>
							<IconButton aria-label="edit" onClick={() => handleEdit(row)}>
								{!isEditable || !row.isActive ? (
									<VisibilityIcon />
								) : (
									<EditIcon />
								)}
							</IconButton>
							{row.transientId && (
								<IconButton onClick={() => handleDelete(row)}>
									<DeleteIcon color="error" />
								</IconButton>
							)}
						</>
					);
				},
				type: "custom",
			},
			{
				label: t("provisions:request.table.requestDescription"),
				field: "",
				component: (row: TProvisionOrder) => row.orderDescription?.name,
				type: "custom",
			},
			{
				label: t("provisions:request.table.requestDate"),
				field: "createdDate",
				type: "date",
			},
			{
				label: t("provisions:request.table.expectation"),
				field: "",
				component: (row: TProvisionOrder) => row.orderExpectation?.name,
				type: "custom",
			},
			/* {
				label: t("provisions:request.table.probability"),
				field: "",
				component: (row: TProvisionOrder) => row.orderProbability?.name,
				type: "custom",
			}, */
			{
				label: t("provisions:request.table.requestStatus"),
				field: "",
				component: (row: TProvisionOrder) => row.orderStatus?.name,
				type: "custom",
			},
			{
				label: t("provisions:request.table.forecastValue"),
				field: "provisionValue",
				type: "currency",
			},
			{
				label: "Valor total do pedido",
				field: "provisionValueTotal",
				type: "currency",
			},
			{
				label: t("provisions:orderDescription.sumProvision"),
				field: "",
				type: "custom",
				component: (row: TProvisionOrder) => {
					const label = row.orderDescription?.sumProvision
						? t("sim")
						: t("nao");
					return label;
				},
			},
			{
				label: t("form.attachments"),
				field: "",
				type: "custom",
				component: (row: TProvisionOrder) => {
					if (!row.orderFiles?.length) return null;
					const paths = row.orderFiles
						.filter((file) => file.path)
						.map((file) => file.path);
					return (
						<IconButton
							onClick={() => paths.forEach((path) => window.open(path))}
						>
							<AttachmentIcon />
						</IconButton>
					);
				},
			},
			{
				label: t("provisions:request.table.enableDisable"),
				field: "",
				type: "custom",
				component: (row: TProvisionOrder) => {
					const label = row.isActive ? t("enabled") : t("disabled");
					if (currentScreenPermissions.del && !isEditable) return label;
					return (
						<FormControlLabel
							control={
								<Switch
									checked={row.isActive}
									onChange={() => handleSwitchButton(row)}
									name={`switch${row.orderDescriptionId}`}
									color="primary"
								/>
							}
							label={label}
						/>
					);
				},
			},
		],
		[
			currentScreenPermissions.del,
			handleDelete,
			handleEdit,
			handleSwitchButton,
			isEditable,
		]
	);

	const ordersWithSummedProvisionValue = useMemo(
		() =>
			orders.map((item: any) => {
				let provisionValueTotal = 0;
				let summedProvisionValue = 0;

				if (item.isActive) {
					provisionValueTotal = item.orderRatings.reduce(
						(sum: any, or: any) => {
							sum += or.value ?? 0;
							return sum;
						},
						0
					);

					summedProvisionValue = 0;
					for (let i = 0; i < item.orderRatings.length; i++) {
						if (item.orderRatings[i].orderRatingProbababilityId === 1)
							summedProvisionValue += item.orderRatings[i].value;
					}
				}

				return {
					...item,
					provisionValue: summedProvisionValue,
					provisionValueTotal: provisionValueTotal,
				};
			}),
		[orders]
	);

	return (
		<AccordionPanel
			title={t("provisions:request.requestListTitle")}
			startExpanded
			noContentMargin
		>
			<TableComponent
				columns={requestTableColumns}
				rows={ordersWithSummedProvisionValue}
				isLoading={isLoading}
				numItemsLoading={3}
			/>
		</AccordionPanel>
	);
}
