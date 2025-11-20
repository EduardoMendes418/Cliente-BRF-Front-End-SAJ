import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { FormikHelpers } from "formik";

import Form, { NumericField, RadioGroup } from "src/components/form";
import SearchInfo from "src/components/SearchInfo";
import { Submit } from "src/components/button";
import Panel from "src/components/Panel";

import {
	getProcessError,
	getProcessFolderNumber,
} from "src/core/store/modules/process/selectors";
import { fetchSolicitacao } from "src/core/store/modules/payment/thunks";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { useTranslation } from "src/locale/i18n";
import { actions } from "src/core/store";
import { usePagination } from "src/hooks/pagination";
import FieldColumn from "src/components/FieldColumn";

type TCTGFolderSearch = {
	readonly: boolean;
	isLoading: boolean;
	folderNumber: string;
	willLinkAPayment: boolean;
	id: string;
	parentCreditReceiptsId?: number | undefined | null;
};

type TSearchForm = {
	folderNumber: string;
	willLinkAPayment: boolean;
	id: string;
};

const CTGFolderSearch = ({
	readonly,
	isLoading,
	folderNumber,
	willLinkAPayment,
	id,
	parentCreditReceiptsId
}: TCTGFolderSearch) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const processFolderNumber = useSelector(getProcessFolderNumber);
	const error = useSelector(getProcessError);
	const { page, pageSize } = usePagination();

	const onSubmit = (
		{ folderNumber, willLinkAPayment }: TSearchForm,
		{ setSubmitting }: FormikHelpers<TSearchForm>
	) => {
		dispatch(actions.creditReceipt.setFolderNumber(folderNumber));
		dispatch(actions.creditReceipt.setWillLinkAPayment(willLinkAPayment));

		dispatch(fetchProcessFolder({ folderNumber }));
		dispatch(actions.paymentRequest.clear());

		if (willLinkAPayment) {
			dispatch(
				fetchSolicitacao({
					folderNumber,
					statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
					page,
					pageSize,
				})
			);
		}
		setSubmitting(false);
	};

	const onRadioButtonChanged = (
		value: number | string | boolean,
		folderNumber: string
	) => {
		dispatch(actions.creditReceipt.setWillLinkAPayment(!!value));
		if (processFolderNumber === folderNumber && !!value)
			dispatch(
				fetchSolicitacao({
					folderNumber,
					statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
					page,
					pageSize,
				})
			);
	};

	return (
		<Panel title={t("creditReceipt:form.title")} withPadding>
			<Form
				initialValues={{ folderNumber, willLinkAPayment, id }}
				enableReinitialize
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							{readonly && (
								<Grid item xs={12} md={3}>
									<NumericField
										name="id"
										label={t("creditReceipt:form.requestNumber")}
										readOnly={readonly}
										required
									/>
								</Grid>
							)}
							<Grid item xs={12} md={3}>
								<NumericField
									name="folderNumber"
									label={t("form.CTGFolder")}
									readOnly={readonly}
									required
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<RadioGroup
									name="willLinkAPayment"
									label={t("creditReceipt:form.willLinkAPayment")}
									onChange={(value) =>
										onRadioButtonChanged(value, values.folderNumber)
									}
									readOnly={readonly}
									required
								/>
							</Grid>
							{
							parentCreditReceiptsId && (
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={t("goodsAndGuarantees:accountability.parentAccountabilityId")}
										value={parentCreditReceiptsId}	
									/>
							</Grid>
							)
				            }
							{!readonly && (
								<Grid item md={1} xs={2}>
									<Submit
										type="search"
										disabled={!dirty}
										submitting={isLoading}
									/>
								</Grid>
							)}
						</Grid>
						{!isLoading && <SearchInfo error={error} />}
					</form>
				)}
			</Form>
		</Panel>
	);
};

export default CTGFolderSearch;

