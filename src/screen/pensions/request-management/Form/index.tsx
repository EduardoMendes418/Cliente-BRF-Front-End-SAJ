import { useState } from "react";
import ScreenTemplate from "src/components/Screen";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { useEffect } from "react";
import { actions } from "src/core/store";
import SeekPensionsForm from "./SeekPensionsForm";
import Info from "./Info";
import PayeeData from "./PayeeData";
import Status, { initialValues as statusDataInitialValues } from "./Status";
import Attachments from "src/components/Attachments";
import CancelButton from "src/components/button/Cancel";
import { Submit } from "src/components/button";

import * as yup from "yup";
import { TPensionPayeeData, TPensionStatus } from "src/core/models/pensions";
import {
    getPensionRequestByID,
    getPensionRequestFolderInfo,
    getErrorMessagePensionRequest,
    getPensionRequestStatus,
} from "src/core/store/modules/pensions/request-pensions/selectors";
import { fetchBanks } from "src/core/store/modules/banks/thunks";
import moment from "moment";
import { fetchFormulaCorrectionRuleList } from "src/core/store/modules/formula-correction-rule/thunks";

import { Modulos } from "src/core/models/modules";
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import {
    fetchPensionRequest,
    fetchPensionCategories,
    fetchPensionClosureReason,
    editPensionRequest,
} from "src/core/store/modules/pensions/request-pensions/thunks";
import Logs from "src/components/Logs";
import Form from "src/components/form";
import { useRegisterDefault } from "src/hooks";
import ListPaymentsMini from "./PaymentsMini";
import Payment from "./Payment";
import { statusTextApprovalsFlow } from "src/core/utils/constants";

const payeeDataInitialValues: TPensionPayeeData = {
    requestDate: moment().format("YYYY-MM-DD"),
    cpf: "",
    fullName: "",
    favoredId: null,
    bornDate: "",
    paymentTypeId: "",
    paymentFormatId: "",
    bankId: "",
    agency: "",
    agencyDv: "",
    account: "",
    accountDv: "",
    pensionCategoryId: "",
    processReview: false,
    correctionFormId: "",
    decision: "",
    paymentStartDate: "",
    paymentFinishDate: "",
    installments: 0,
	installmentsPending: 0,
    monthlyPensionValue: 0,
    pensionFgtsValue: 0,
    fgtsPayment: false,
    pensionFgtsLinkedAccount: false,
    vacationPensionValue: 0,
    vacationPayment: false,
    thirteenthSalaryValue: 0,
    thirteenthSalaryPayment: false,
    termValue: 0,
    shortTermValue: 0,
    attachments: [],
};

const RequestPensionsForm = () => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [isPaymentScreen, setIsPaymentScreen] = useState(false);

    const isNew = id === "novo";
    const item = useSelector(getPensionRequestByID(Number(id)));
    const editable = true;

    useRegisterDefault({
        action: "pensionRequest",
        getStatus: getPensionRequestStatus,
        getErrorMessage: getErrorMessagePensionRequest,
        isMultilevel: true,
    });

    useEffect(() => {
        dispatch(fetchPaymentMethod({ moduloId: Modulos.Pension }));
        dispatch(fetchPaymentType({ modulo: Modulos.Pension, status: true }));
        dispatch(
            fetchFormulaCorrectionRuleList({ pageSize: 100, notPaginate: true })
        );
        dispatch(fetchBanks());
        dispatch(fetchPensionCategories());
        dispatch(fetchPensionClosureReason());

        dispatch(fetchPensionRequest({ id: Number(id) }));

        return () => {
            dispatch(actions.pensions.requestPensions.clear());
            dispatch(actions.process.clear());
            dispatch(actions.paymentRequest.clear());
        };

        
    }, [dispatch]);

    const folderInfo = useSelector(getPensionRequestFolderInfo);

    const { cpf, bornDate, folderNumber } = folderInfo;

    const paymentStartDate =
        item?.paymentStartDate.split("/").reverse().concat(["01"]).join("-") ??
        "";
    const paymentFinishDate =
        item?.paymentFinishDate.split("/").reverse().concat(["01"]).join("-") ??
        "";

    const initialValues = {
        ...payeeDataInitialValues,
        ...statusDataInitialValues,
        cpf,
        bornDate,
        attachments: [],
        ...item,
        paymentStartDate,
        paymentFinishDate,
        closureDate: null,
    };

    const validationSchema = yup.object().shape({
        attachments: yup.mixed(),
    });

    const onSubmit = ({
        requestStatus,
        closureReasonId,
        closureDate,
        observationWriteOff,
		shortTermValue,
		termValue
    }: TPensionPayeeData & TPensionStatus) => {
        dispatch(
            editPensionRequest({
                ...item,
				shortTermValue,
				termValue,
                requestStatus,
                closureReasonId,
                closureDate,
                observationWriteOff,
            })
        );
    };
    return (
        <ScreenTemplate>
            {!isPaymentScreen ? (
                <>
                    <SeekPensionsForm
                        readOnly
                        folderNumber={folderNumber ?? item?.folderNumber}
                        loading={false}
                        closed={false}
                    />
                    <Form
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        permission={editable ? undefined : false}
                    >
                        {({ handleSubmit, values, isSubmitting }) => {
                            return (
                                <form onSubmit={handleSubmit} noValidate>
                                    <Info folderNumber={item?.folderNumber} />
                                    <PayeeData item={item} />
                                    <Status isNew={isNew} />
                                    <ListPaymentsMini
                                        pathname={"/pagamentos/solicitacao"}
                                        id={Number(id)}
                                        setIsPaymentScreen={setIsPaymentScreen}
                                    />
                                    <Logs
                                        logs={item?.logs}
                                        statusOrder={["flow", "approvalCenter"]}
                                        statuses={statusTextApprovalsFlow}
                                    />
                                    <Attachments name="attachments" disabled />
                                    <Grid
                                        container
                                        justifyContent="flex-end"
                                        className="margin-top-16"
                                        spacing={2}
                                    >
                                        <Grid item>{<CancelButton />}</Grid>
                                        <Grid item>
                                            <Submit submitting={isSubmitting} />
                                        </Grid>
                                    </Grid>
                                </form>
                            );
                        }}
                    </Form>
                </>
            ) : (
                <Payment
                    pathname={"/pagamentos/solicitacao"}
                    id={Number(id)}
                    setIsPaymentScreen={setIsPaymentScreen}
                />
            )}
        </ScreenTemplate>
    );
};

export default RequestPensionsForm;
