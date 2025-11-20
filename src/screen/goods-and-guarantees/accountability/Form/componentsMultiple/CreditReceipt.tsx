import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, FormikHelpers } from "formik";
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";

import { NumericField } from "src/components/form";
import {
	removeCreditReceipt,
	addCreditReceipt,
} from "src/core/store/modules/guarantee-accountability";
import { Submit } from "src/components/button";
import { useSnackbar } from "notistack";
import { getCreditReceipt } from "src/core/store/modules/guarantee-accountability/selectors";
import TableComponent, { ColumnData } from "src/components/Table";
import { useTranslation } from "src/locale/i18n";
import AccordionPanel from "src/components/AccordionPanel";
import { numberToCurrency } from "src/core/utils/func";
import {
	statusText,
	STATUS_CREDIT_RECEIPT,
} from "src/screen/credit-receipt/constants";
import { getOptionsAsObject } from "src/core/utils/func";
import { getListAsOptionPaymentType } from "src/core/store/modules/payment-type/selectors";
import { AppDispatch } from "src/core/store";
import { fetchCreditReceiptById } from "src/core/store/modules/credit-receipt/thunks";
import { TCreditReceipt } from "src/core/models/credit-receipt";
import { TableDiv } from "./styled";

type TSearchForm = { id: number | "" };

const statusTextApprovals = {
	"-1": "Pendente",
	"0": "Reprovado",
	"1": "Aprovado",
	"20": "",
};

const CreditReceipt = ({hiddeAddNew = false}: {hiddeAddNew?:boolean}) => {
	
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const [loading, setLoading] = useState<boolean>(false);
	const creditReceipt = useSelector(getCreditReceipt);
	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentType);
	const paymentTypeAsObject = useMemo(
		() => getOptionsAsObject(paymentTypeAsOptions),
		[paymentTypeAsOptions]
	);

	const onSubmit = async (
		{ id }: TSearchForm,
		{ setSubmitting, resetForm }: FormikHelpers<TSearchForm>
	) => {
		setLoading(true);

		const { meta, payload } = await dispatch(
			fetchCreditReceiptById(Number(id))
		);

		const credit = payload as TCreditReceipt

		if (
			meta.requestStatus === "rejected" ||
			Object.keys(payload as object).length === 0
		) {
			enqueueSnackbar("Não encontrado", { variant: "error" });
		} else if (
			credit.statusFlowId !== STATUS_CREDIT_RECEIPT.FOR_WITHDRAWAL &&
			credit.statusFlowId !== STATUS_CREDIT_RECEIPT.REQUESTED
		) {
			enqueueSnackbar("Status do recebimento de crédito inválido", { variant: "error" });
		} else {
			dispatch(addCreditReceipt(credit));
		}

		setSubmitting(false);
		resetForm();
		setLoading(false);
	};

	const list = useMemo(
		() =>
			creditReceipt.map((item) => ({
				...item,
				status: statusText[item.statusFlowId],
				paymentType: (paymentTypeAsObject as any)[item.paymentTypeId] ?? "",
				statusTextApproval:
					(statusTextApprovals as any)[item.statusApprovalId ?? "10"] ?? "",
			})),
		[creditReceipt, paymentTypeAsObject]
	);

	const columns: ColumnData[] = [
		{
			label: "Ações",
			field: "action",
			component: (row: any, index: number) => {
				if (hiddeAddNew) return null;
				return (
					<>
						<IconButton
							aria-label="edit"
							onClick={() => dispatch(removeCreditReceipt(index))}
						>
							<Delete style={{ color: "red" }} />
						</IconButton>
					</>
				);
			},
			type: "custom",
		},
		{ label: t("creditReceipt:list.requestNumber"), field: "id" },
		{ label: t("form.CTGFolder"), field: "folderNumber" },
		{
			label: t("creditReceipt:form.requestDate"),
			field: "requestDate",
			type: "date",
		},
		{ label: t("creditReceipt:form.paymentType"), field: "paymentType" },
		{
			label: t("creditReceipt:form.value"),
			field: "creditValue",
			type: "currency",
		},
		{ label: t("status"), field: "status" },
	];

	return (
		<AccordionPanel
			title={`Recebimento de crédito - Quantidade ${
				creditReceipt.length
			} - Total ${numberToCurrency(
				creditReceipt.reduce((soma, { creditValue }) => creditValue + soma, 0)
			)}`}
		>
			{!hiddeAddNew && <Formik initialValues={{ id: "" }} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item md={3}>
								<NumericField
									name="id"
									label={"ID recebimento de crédito"}
									required
								/>
							</Grid>
							<Grid item xs={2}>
								<Submit type="add" disabled={!dirty} submitting={loading} />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>}
			<TableDiv>
				<TableComponent rows={list} columns={columns} isLoading={loading} />
			</TableDiv>
		</AccordionPanel>
	);
};

export default CreditReceipt;
