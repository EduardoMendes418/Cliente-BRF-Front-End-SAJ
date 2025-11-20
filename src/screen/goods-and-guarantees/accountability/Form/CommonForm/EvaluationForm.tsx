import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import { useEffect } from "react";

import {
	SelectField,
	DateField,
	TextField,
	FormikContext,
} from "src/components/form";
import Panel from "src/components/Panel";
import { t } from "src/locale/i18n";

import { TYPE_FLOW } from "src/screen/goods-and-guarantees/constants";
import {
	ACCOUNTABILITY_SITUATION,
	ACCOUNTABILITY_STATUS,
	commonSituationStatusOptions,
	insuranceAccountabilityStatusOptions,
	commonAccountabilityStatusOptionDead,
	accountabilityStatusOptions,
} from "../../constants";
import { useSelector } from "react-redux";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

type Props = {
	isVisible: boolean;
	readOnly: boolean;
	typeFlow: TYPE_FLOW;
	statusFlowId: number;
};

const EvaluationForm = ({
	isVisible,
	readOnly,
	typeFlow,
	statusFlowId,
}: Props) => {
	const { values, setFieldValue } = useFormikContext<FormikContext>();
	const currentUser = useSelector(getDataCurrentUser);

	useEffect(() => {

		if (
			!readOnly && values.status === ACCOUNTABILITY_SITUATION.REJECTED &&
			values.statusFlowId !== ACCOUNTABILITY_STATUS.DEAD
		) {
			setFieldValue("statusFlowId", ACCOUNTABILITY_STATUS.DEAD);
		}
		if(values?.evaluator === null || "" || values?.evaluator?.length === 0){
			setFieldValue("evaluator", currentUser?.name);
		}
	}, [values, setFieldValue, readOnly]);

	if (!isVisible) return null;
	return (
		<Panel
			title={t("goodsAndGuarantees:accountability.evaluation")}
			withPadding
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<DateField
						name="valuationDate"
						label={t("goodsAndGuarantees:accountability.valuationDate")}
						readOnly
					/>
				</Grid>
				<Grid item xs={12} md={9}>
					<TextField
						name="evaluator"
						label={t("goodsAndGuarantees:accountability.evaluator")}
						readOnly
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						name="statusFlowId"
						label={t("goodsAndGuarantees:accountability.accountabilityStatus")}
						options={
							readOnly
								? accountabilityStatusOptions
								: statusFlowId !== 7
								? insuranceAccountabilityStatusOptions
								: commonAccountabilityStatusOptionDead
						}
						readOnly={
							readOnly || values.status === ACCOUNTABILITY_SITUATION.REJECTED
						}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						name="status"
						label={t("goodsAndGuarantees:accountability.situation")}
						options={commonSituationStatusOptions}
						readOnly={readOnly}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={3}
				justifyContent="center"
				className="margin-top-16"
			>
				<Grid item xs={12} md={3}>
					<TextField
						name="email"
						label={t("goodsAndGuarantees:accountability.mail")}
						placeholder={t("form.typeHere")}
						readOnly={readOnly}
					/>
				</Grid>
				<Grid item xs={12} md={9}>
					<TextField
						name="evaluationDescription"
						label={t("goodsAndGuarantees:accountability.description")}
						placeholder={t("form.typeHere")}
						readOnly={readOnly}
						rows={5}
						maxLength={1000}
						multiline
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default EvaluationForm;
