import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import { DateField } from "src/components/form";
import { Submit, Clean } from "src/components/button";

import { actions } from "src/core/store";
import { TPaymentRequestFilters } from "src/core/models/payment";

const Search = ({ pathname }: { pathname: string }) => {
    const dispatch = useDispatch();

    const onSubmit = (values: TPaymentRequestFilters) => {
        dispatch(
            actions.paymentRequest.setFilters({
                filters: values,
                page: pathname,
            })
        );
    };

    const initialValues = {
        startDate: null,
        endDate: null,
    } as TPaymentRequestFilters;

    return (
        <div className="panel-content">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ handleSubmit, dirty }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12}>
                                <DateField name="startDate" label={"De"} />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <DateField name="endDate" label={"Até"} />
                            </Grid>
                            <Grid item md={6} xs={6}>
                                <Submit type="search" disabled={!dirty} />
                            </Grid>
                        </Grid>
                        <Clean action="pensions.requestPensions" />
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default Search;
