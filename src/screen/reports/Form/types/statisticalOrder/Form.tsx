import { TReportComponent } from "src/core/models/reports";
import { useReport } from "src/screen/reports/hooks/useReport";
import { Clean } from "src/components/button";

import FormCore from "src/screen/reports/Form/commom/FormCore";
import StatisticalOrderFilter from "src/screen/reports/components/StatisticalOrderFilter";

const initialValues = {
    objectName: "",
    requestInclusionDate: null,
    dataPagamentoFinal: null,
};

const FormStatisticalOrder = () => {
    const {
        item,
        hasItem,
        isSaving,
        customFields,
        setCustomFields,
        initialFormValues,
        customFieldsDictionary,
    } = useReport({
        initialValues,
        reportComponent: TReportComponent.STATISTICAL_ORDER,
    });

    return (
        <FormCore
            item={item}
            hasItem={hasItem}
            reportComponent={TReportComponent.STATISTICAL_ORDER}
            initialValues={initialFormValues}
            setCustomFields={setCustomFields}
            customFieldsDictionary={customFieldsDictionary}
        >
            <StatisticalOrderFilter
                hasItem={hasItem}
                submitting={isSaving}
                customFields={customFields}
            />
            <Clean
                action="reportConfiguration"
                style={{ marginTop: "-35px" }}
            />
        </FormCore>
    );
};

export default FormStatisticalOrder;
