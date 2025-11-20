import { Formik, FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Box, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";

import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { DateField, NumericField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import {
    generatePayments,
    generateSinglePayment,
} from "src/core/store/modules/pensions/interest-update/thunks";
import { TPeriodDateFilter } from "src/core/models/pensions";
import { AppDispatch } from "src/core/store";
import { t } from "src/locale/i18n";
import moment from "moment";

type FilterForm = TPeriodDateFilter & {
    id: number | "";
};

const initialValues: FilterForm = {
    id: "",
    date: null,
};

export default function PensionInterestUpdate() {
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (
        { id, ...dates }: FilterForm,
        { setSubmitting }: FormikHelpers<FilterForm>
    ) => {
        const { date } = dates;
        const requestFunction = () =>  id ? dispatch(generateSinglePayment(id)) : dispatch(generatePayments({
                          startDate: moment(date).startOf("month").format("MM/yyyy"),
                          endDate: moment(date).endOf("month").format("MM/yyyy"),
                      }));

        const { type } = await requestFunction();
        if (type.endsWith("/rejected"))
            enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
        if (type.endsWith("/fulfilled"))
            enqueueSnackbar(t("successfulOperation"), { variant: "success" });

        setSubmitting(false);
    };

    return (
        <ScreenTemplate>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ handleSubmit, isSubmitting, dirty }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Panel
                            title={t("pension:interestUpdate.title")}
                            withPadding
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <NumericField
                                        label={t("pension:interestUpdate.field.requestId")}
                                        name="id"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DateField
                                        label={t("solicitacaoPagamento:dadosPagamento.dataPagamento")}
                                        name="date"
                                        views={["year", "month"]}
                                        format="MM/yyyy"
                                    />
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6}>
                                        <Clean />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Panel>

                        <Box textAlign="right" marginY={3}>
                            <Submit
                                text={t("pension:interestUpdate.process")}
                                disabled={!dirty}
                                submitting={isSubmitting}
                            />
                        </Box>
                    </form>
                )}
            </Formik>
        </ScreenTemplate>
    );
}
