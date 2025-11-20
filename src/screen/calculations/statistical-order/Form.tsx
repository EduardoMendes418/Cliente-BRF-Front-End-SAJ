import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { FieldArray } from "formik";

import Logs from "src/components/Logs";
import { confirm } from "src/components/modals";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { Submit } from "src/components/button";
import Form, { TextField, CurrencyField, Upload } from "src/components/form";
import { accountabilityStatusOptionsAsObject } from "src/screen/goods-and-guarantees/accountability/constants";
import {
    deleteCalculationsFile,
    updateObjectsInformation,
} from "src/core/store/modules/calculations/thunks";
import {
    TStatisticalOrder,
    TOrder,
    TProcessObject,
} from "src/core/models/process";
import { getCalculationsIsSaving } from "src/core/store/modules/calculations/selectors";
import { getObjectsFolder } from "src/core/store/modules/process/selectors";
import { actions } from "src/core/store";
import { t } from "src/locale/i18n";
import { toNumber } from "src/core/utils/func";
import { sum } from "src/core/utils/calc";

type Props = { folderNumber?: string };

const validate =
    (page: number, initialValues: TStatisticalOrder) =>
    (values: TStatisticalOrder) => {
        if (!initialValues.processObject.length) return {};

        const processObject: {
            justificationAmountConviction: string;
            sentenceValueJustification: string;
        }[] = [];

        const startValues = initialValues.processObject[page];
        const actualValues = values.processObject[page];

        if (
            startValues?.justificationAmountConviction &&
            !actualValues?.justificationAmountConviction
        ) {
            processObject[page] = {
                ...processObject[page],
                justificationAmountConviction: t("required"),
            };
        }

        if (
            startValues?.sentenceValueJustification &&
            !actualValues?.sentenceValueJustification
        ) {
            processObject[page] = {
                ...processObject[page],
                sentenceValueJustification: t("required"),
            };
        }

        return processObject.length ? { processObject } : {};
    };

const normalizeRequest = (obj: TProcessObject) => {
    return {
        id: toNumber(obj.objectInformationId) ?? 0,
        processObjectId: toNumber(obj.id),
        convictionValue: toNumber(obj.convictionValue),
        initialRisk: toNumber(obj.initialRisk),
        possibleInitialRisk: toNumber(obj.possibleInitialRisk),
        probableInitialRisk: toNumber(obj.probableInitialRisk),
        remoteInitialRisk: toNumber(obj.remoteInitialRisk),
        sentenceValue: toNumber(obj.sentenceValue),
        initialRiskJustification: obj.initialRiskJustification,
        justificationAmountConviction: obj.justificationAmountConviction,
        sentenceValueJustification: obj.sentenceValueJustification,
    };
};

const OrderCalculationForm = ({ folderNumber: folderNumberParam }: Props) => {
    const {
        id,
        folderNumber,
        orders,
        processObject,
        processParties,
        attachedDocuments,
        logsObjects,
    } = useSelector(getObjectsFolder);

    const dispatch = useDispatch();
    const isSaving = useSelector(getCalculationsIsSaving);

    const [page, setPage] = useState(0);

    const initialValues: TStatisticalOrder = {
        id,
        folderNumber,
        orders,
        processObject,
        processParties,
        attachedDocuments: (attachedDocuments || []) as any[],
    };

    const title: string = `${processObject[page]?.description ?? ""} ${
        processObject.length > 1 ? `(${page + 1}/${processObject.length})` : ""
    }`;

    const onSubmit = useCallback(
        async ({ processObject }: TStatisticalOrder) => {
            const modalInitialRiskZero: TOrder[] = processObject.filter(
                function (obj: TProcessObject) {
                    const initialRisk = sum([
                        obj.probableInitialRisk,
                        obj.possibleInitialRisk,
                        obj.remoteInitialRisk,
                    ]);

                    if (
                        initialRisk === 0 &&
                        obj.initialRiskJustification.length > 0
                    )
                        return obj;
                    return false;
                }
            );

            if (modalInitialRiskZero.length >= 1) {
                let message: string = "";

                modalInitialRiskZero.forEach((item) => {
                    message = `${message} - ${item.description}`;
                });

                if (
                    !(await confirm(
                        t("calculations:form.modal.initialRiskValue.message"),
                        t("calculations:form.modal.initialRiskValue.title"),
                        message
                    ))
                )
                    return;
            }

            const newObjects: TOrder[] = processObject
                .filter(function (obj: TProcessObject) {
                    const initialRisk = sum([
                        obj.probableInitialRisk,
                        obj.possibleInitialRisk,
                        obj.remoteInitialRisk,
                    ]);

                    if (
                        !obj.objectInformationId &&
                        (initialRisk > 0 ||
                            obj.initialRiskJustification.length > 0)
                    )
                        return obj;
                    return false;
                })
                .map((item) => normalizeRequest(item));

            const existingObjects: TOrder[] = processObject
                .filter(function (obj: TProcessObject) {
                    return !!obj.objectInformationId;
                })
                .map((item) => normalizeRequest(item));

            dispatch(updateObjectsInformation({ newObjects, existingObjects }));
        },
        [dispatch]
    );

    const handleDelete = (file: any) => {
        file?.id && dispatch(deleteCalculationsFile(file.id));
    };

    const previousPage = () => {
        if (page === 0) return;
        setPage(page - 1);
    };

    const nextPage = () => {
        if (page === processObject.length - 1) return;
        setPage(page + 1);
    };

    useEffect(() => {
        if (!folderNumberParam) dispatch(actions.process.clear());
    }, [dispatch, folderNumberParam]);

    const pagination = processObject.length > 1 && (
        <Grid container>
            <Grid item>
                <IconButton
                    aria-label="search"
                    disabled={page === 0}
                    onClick={previousPage}
                >
                    <ArrowBackIosIcon />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="search"
                    disabled={page === processObject.length - 1}
                    onClick={nextPage}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Grid>
        </Grid>
    );

    return (
        <Form
            initialValues={initialValues}
            validate={validate(page, initialValues)}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ handleSubmit, dirty, initialValues, values, status }) => {
                const objectInitialValues =
                    initialValues.processObject[page] ?? {};
                const objectValues = values.processObject[page] ?? {};
                const { processObject } = values;

                let totalPossibleInitialRisk = 0;
                let totalProbableInitialRisk = 0;
                let totalRemoteInitialRisk = 0;

                if (!!processObject.length) {
                    totalPossibleInitialRisk = processObject.reduce(
                        (acc, { possibleInitialRisk }) =>
                            acc + toNumber(possibleInitialRisk),
                        0
                    );
                    totalProbableInitialRisk = processObject.reduce(
                        (acc, { probableInitialRisk }) =>
                            acc + toNumber(probableInitialRisk),
                        0
                    );
                    totalRemoteInitialRisk = processObject.reduce(
                        (acc, { remoteInitialRisk }) =>
                            acc + toNumber(remoteInitialRisk),
                        0
                    );
                }

                return (
                    <form
                        id="calculo-pedido-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {!!processObject.length && (
                            <>
                                <Panel
                                    title={"Total do pedido"}
                                    slotTopRightPermission="view"
                                    withPadding
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={3}>
                                            <FieldColumn
                                                label="Valor do risco inicial"
                                                value={sum([
                                                    totalPossibleInitialRisk,
                                                    totalProbableInitialRisk,
                                                    totalRemoteInitialRisk,
                                                ])}
                                                type="currency"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FieldColumn
                                                label="Valor do risco inicial provável"
                                                value={totalProbableInitialRisk}
                                                type="currency"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FieldColumn
                                                label="Valor do risco inicial possível"
                                                value={totalPossibleInitialRisk}
                                                type="currency"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FieldColumn
                                                label="Valor do risco inicial remoto"
                                                value={totalRemoteInitialRisk}
                                                type="currency"
                                            />
                                        </Grid>
                                    </Grid>
                                </Panel>
                                <FieldArray name="processObject">
                                    {() => (
                                        <Panel
                                            title={title}
                                            slotTopRight={pagination}
                                            slotTopRightPermission="view"
                                            withPadding
                                        >
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={3}>
                                                    <FieldColumn
                                                        label="Valor do risco inicial"
                                                        value={sum([
                                                            objectValues.probableInitialRisk,
                                                            objectValues.possibleInitialRisk,
                                                            objectValues.remoteInitialRisk,
                                                        ])}
                                                        type="currency"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <CurrencyField
                                                        label="Valor do risco inicial provável"
                                                        name={`processObject.${page}.probableInitialRisk`}
                                                        disabled={
                                                            objectInitialValues.sentenceValue !==
                                                            0
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <CurrencyField
                                                        label="Valor do risco inicial possível"
                                                        name={`processObject.${page}.possibleInitialRisk`}
                                                        disabled={
                                                            objectInitialValues.sentenceValue !==
                                                            0
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <CurrencyField
                                                        label="Valor do risco inicial remoto"
                                                        name={`processObject.${page}.remoteInitialRisk`}
                                                        disabled={
                                                            objectInitialValues.sentenceValue !==
                                                            0
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Justificativa do valor do risco inicial"
                                                        name={`processObject.${page}.initialRiskJustification`}
                                                        disabled={
                                                            !!objectInitialValues.sentenceValueJustification ||
                                                            !!objectInitialValues.sentenceValueJustification
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <CurrencyField
                                                        label="Valor da sentença"
                                                        name={`processObject.${page}.sentenceValue`}
                                                        disabled={
                                                            !objectInitialValues.initialRiskJustification ||
                                                            !!objectInitialValues.justificationAmountConviction ||
                                                            !!objectInitialValues.justificationAmountConviction
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <TextField
                                                        label="Justificativa do valor da sentença"
                                                        name={`processObject.${page}.sentenceValueJustification`}
                                                        disabled={
                                                            !objectInitialValues.initialRiskJustification ||
                                                            !!objectInitialValues.justificationAmountConviction ||
                                                            !!objectInitialValues.justificationAmountConviction
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <CurrencyField
                                                        label="Valor da condenação"
                                                        name={`processObject.${page}.convictionValue`}
                                                        disabled={
                                                            !objectInitialValues.sentenceValueJustification
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={9}>
                                                    <TextField
                                                        label="Justificativa do valor da condenação"
                                                        name={`processObject.${page}.justificationAmountConviction`}
                                                        disabled={
                                                            !objectInitialValues.sentenceValueJustification
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Panel>
                                    )}
                                </FieldArray>
                            </>
                        )}

                        <Panel
                            title="Anexos"
                            slotBottomRight={
                                <Submit
                                    submitting={isSaving}
                                    disabled={!dirty}
                                />
                            }
                            slotBottonRightPermission={
                                status !== "readOnly" && "edit"
                            }
                            withPadding
                        >
                            <Upload
                                multiple
                                name="attachedDocuments"
                                onDelete={handleDelete}
                            />
                        </Panel>

                        <Logs
                            logs={logsObjects}
                            statuses={accountabilityStatusOptionsAsObject}
                            statusOrder={["flow"]}
                        />
                    </form>
                );
            }}
        </Form>
    );
};

export default OrderCalculationForm;
