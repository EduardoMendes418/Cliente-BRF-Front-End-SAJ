import { useSelector } from "react-redux";
import Panel from "src/components/Panel";
import { Grid } from "@material-ui/core";
import { TPensionStatus } from "src/core/models/pensions";
import { getPensionClosureReasonAsOptions } from "src/core/store/modules/pensions/request-pensions/selectors";
import { t } from "src/locale/i18n";
import { requestStatusAsOptions } from "src/screen/pensions/request/constants";
import { TextField, DateField, SelectField } from "src/components/form";
import { useFormikContext } from "formik";
import { FormikContext } from "src/components/form";

export const initialValues: TPensionStatus = {
    requestStatus: "",
    closureDate: null,
    closureReasonId: "",
    observationWriteOff: "",
};

const Status = ({ isNew }: { isNew: boolean }) => {
    const closureReasons = useSelector(getPensionClosureReasonAsOptions);
    const { values, setFieldValue } = useFormikContext<FormikContext>();

    return (
        <Panel title={t("pension:request.form.status")} withPadding>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("pension:request.form.judicialPensionStatus")}
                        name="requestStatus"
                        options={requestStatusAsOptions}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("pension:request.form.dismissalReason")}
                        name="closureReasonId"
                        options={closureReasons}
                        onChange={(e: any) => {
                            if (e.target.value) {
                                setFieldValue("closureDate", new Date());
                                return;
                            }
                            setFieldValue("closureDate", null);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <DateField
                        label={t("pension:request.form.dismissalDate")}
                        name="closureDate"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        name="observationWriteOff"
                        label={t(
                            "pension:request.form.dismissalReasonJustification"
                        )}
                        rows={3}
                        multiline
                        maxLength={5000}
                        readOnly={values.closureDate === null}
                    />
                </Grid>
            </Grid>
        </Panel>
    );
};

export default Status;
