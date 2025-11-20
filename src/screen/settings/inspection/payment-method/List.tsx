import { Grid } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Clean, Submit } from "src/components/button";
import { TextField } from "src/components/form";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import TableComponent, { ColumnData } from "src/components/Table";
import { Modulos } from "src/core/models/modules";
import { TPaymentMethod } from "src/core/models/payment-method";
import { actions } from "src/core/store";
import { getPagination } from "src/core/store/modules/pagination/selectors";
import {
	getErrorMessagePaymentMethod,
	getListPaymentMethod,
	getLoadingPaymentMethod,
	getStatusPaymentMethod,
} from "src/core/store/modules/payment-method/selectors";
import {
	editPaymentMethod,
	fetchPaymentMethod,
} from "src/core/store/modules/payment-method/thunks";
import { useRegisterDefault } from "src/hooks";
import { useFetchFormaPagamento } from "src/hooks/paymentMethod";
import { useTranslation } from "src/locale/i18n";

type Search = {
	description: string;
};

const FormaDePagamentoList = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		...history
	} = useHistory();

	const list = useSelector(getListPaymentMethod);
	const isFetching = useSelector(getLoadingPaymentMethod);
	const status = useSelector(getStatusPaymentMethod);

	const { page, pageSize } = useSelector(getPagination);

	const initialValues: Search = { description: "" };

	useFetchFormaPagamento(Modulos.Inspection);
	useRegisterDefault({
		action: "paymentMethod",
		getStatus: getStatusPaymentMethod,
		getErrorMessage: getErrorMessagePaymentMethod,
		route: "",
		updateInListCallback: () =>
			dispatch(
				fetchPaymentMethod({
					page,
					pageSize,
					moduloId: Modulos.Inspection,
				})
			),
	});

	const handleChange = (row: TPaymentMethod) => {
		if (!row.id) return;
		const values = {
			...row,
			status: !row.status,
			moduloId: Modulos.Inspection,
		};
		dispatch(editPaymentMethod({ id: row.id.toString(), values }));
	};

	const handleEdit = (row: TPaymentMethod) => {
		dispatch(actions.paymentMethod.setItem(row));
		history.push(`/configuracoes/fiscalizacao/forma-pagamento/${row.id}`);
	};

	const handleSubmit = (
		value: Search,
		{ setSubmitting }: FormikHelpers<Search>
	) => {
		dispatch(
			fetchPaymentMethod({
				page,
				pageSize,
				moduloId: Modulos.Inspection,
				descricao: value.description,
			})
		);
		setSubmitting(false);
	};

	const handleClear = () => {
		dispatch(fetchPaymentMethod({
			page,
			pageSize,
			moduloId: Modulos.Inspection,
		}))
	}

	const columns: ColumnData[] = [
		{
			label: t("inspection:form.id"),
			field: "id",
		},
		{
			label: t("inspection:form.method"),
			field: "descricao",
		},
		{
			label: t("inspection:form.status"),
			field: "status",
			type: "switch-button",
			onChange: handleChange,
		},
	];

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t("inspection:formaPagamento_search")} withPadding>
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
					enableReinitialize
				>
					{({ handleSubmit }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={2}>
								<Grid item md={6} xs={10}>
									<TextField
										label={t("inspection:form.method")}
										name="description"
									/>
								</Grid>
								<Grid item>
									<Submit
										type="search"
										submitting={
											isFetching || status === "saving"
										}
									/>
								</Grid>
							</Grid>
							<Clean onClick={handleClear} />
						</form>
					)}
				</Formik>
			</Panel>
			<Panel title={t("inspection:formaPagamento_plural")} withPadding>
				<TableComponent
					onEdit={handleEdit}
					columns={columns}
					rows={list}
					isLoading={isFetching}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default FormaDePagamentoList;
