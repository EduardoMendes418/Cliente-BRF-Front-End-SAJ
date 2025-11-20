import { useEffect } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import moment from "moment";
import { useFormikContext } from "formik";
import Panel from "src/components/Panel";
import { SelectField } from "src/components/form";
import { Grid } from "@material-ui/core";
import FieldColumn from "src/components/FieldColumn";
import { TPensionStatus } from "src/core/models/pensions";
import { getPensionClosureReasonAsOptions } from "src/core/store/modules/pensions/request-pensions/selectors";
import { t } from "src/locale/i18n";
import { requestStatusAsOptions } from "src/screen/pensions/request/constants";

export const validationSchema = {
    closureDate: yup.string(),
    closureReasonId: yup.number(),
    justificativaBaixa: yup.string(),
};

export const initialValues: TPensionStatus = {
    requestStatus: 1,
    closureDate: "",
    closureReasonId: "",
    observationWriteOff: "",
};

const Status = ({ isNew }: { isNew: boolean }) => {
    const formik = useFormikContext<TPensionStatus>();
    const closureReasons = useSelector(getPensionClosureReasonAsOptions);

    const { closureReasonId } = formik.values;
    useEffect(() => {
        if (isNew) {
            const value = closureReasonId ? moment() : "";
            formik.setFieldValue("closureDate", value);
        }
        
    }, [isNew, closureReasonId]);

    return (
        <Panel title={t("pension:request.form.status")} withPadding>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("pension:request.form.judicialPensionStatus")}
                        name="requestStatus"
                        options={requestStatusAsOptions}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("pension:request.form.dismissalReason")}
                        name="closureReasonId"
                        options={closureReasons}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FieldColumn
                        type="date"
                        label={t("pension:request.form.dismissalDate")}
                        value={formik.values.closureDate}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <FieldColumn
                        label={t(
                            "pension:request.form.dismissalReasonJustification"
                        )}
                        value={formik.values.observationWriteOff}
                    />
                </Grid>
            </Grid>
        </Panel>
    );
};

export default Status;
