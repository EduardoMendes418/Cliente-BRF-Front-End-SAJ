import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";

import {
	CheckboxField,
	CurrencyField,
	SelectField,
	TextField,
} from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";

import { TCreditReceipt } from "src/core/models/credit-receipt";
import { useSelector } from "react-redux";
import { useTranslation } from "src/locale/i18n";

import { allStatusOptions } from "../constants";
import { getListAsOptionPaymentTypeAllStatus } from "src/core/store/modules/payment-type/selectors";

const RequesterForm = ({
	readonly,
	isEditable,
	initialValues,
}: {
	readonly: boolean;
	isPaymentTypeReadonly: boolean;
	isEditable: boolean;
	initialValues: TCreditReceipt;
}) => {
	const { t } = useTranslation();
	const { values } = useFormikContext<TCreditReceipt>();
	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentTypeAllStatus);

	return (
		<Panel title={t("creditReceipt:form.requesterFormTitle")} withPadding>
			<Grid container spacing={2}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("form.legalDepartmentArea")}
						value={values.process?.legalDepartmentArea}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("form.costCenter")}
						value={values.process?.costCenter}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("creditReceipt:form.requestDate")}
						value={values.requestDate}
						type="date"
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("status")}
						value={initialValues.statusFlowId}
						type="list"
						options={allStatusOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						name="paymentTypeId"
						label={t("creditReceipt:form.paymentType")}
						options={paymentTypeAsOptions}
						readOnly={!isEditable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="creditValue"
						label={t("creditReceipt:form.value")}
						readOnly={!isEditable}
						min={0.01}
						required
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						name="licenseNumber"
						label={t("creditReceipt:form.licenseNumber")}
						readOnly={!isEditable}
						maxLength={20}
						required
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						name="creditJudicialAccount"
						label={"Nº conta judicial"}
						readOnly={!isEditable}
						maxLength={20}
						required
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CheckboxField
						name="restatementInterestAmount"
						label={t("creditReceipt:form.interestAmount")}
						readOnly={readonly}
						required
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField
						name="observation"
						label={t("form.comments")}
						readOnly={readonly}
						maxLength={2500}
						rows={3}
						multiline
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default RequesterForm;
