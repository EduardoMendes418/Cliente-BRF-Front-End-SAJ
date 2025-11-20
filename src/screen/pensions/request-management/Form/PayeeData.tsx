import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useFormikContext } from "formik";
import { Grid } from "@material-ui/core";
import Panel from "src/components/Panel";

import {
    TextField,
    SelectField,
    DateField,
    CurrencyField,
    RadioGroup,
    CheckboxField,
} from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import { TPensionPayeeData } from "src/core/models/pensions";
import { t } from "src/locale/i18n";
import { getPensionCategoriesAsOptions } from "src/core/store/modules/pensions/request-pensions/selectors";
import { getParameterizationItems } from "src/core/store/modules/parameterization/selectors";
import { fetchParameterization } from "src/core/store/modules/parameterization/thunks";
import { actions } from "src/core/store";
import { getBanksAsOptions } from "src/core/store/modules/banks/selectors";
import { getListFormulaCorrectionRuleAsOptionsFromList } from "src/core/store/modules/formula-correction-rule/selectors";
import {
    getFormsOfPaymentByPaymentTypeAsOption,
    getListAsOptionPaymentType,
} from "src/core/store/modules/payment-type/selectors";
import { toNumber } from "src/core/utils/func";

import CPFField from "./CPFField";

const onChangeCategory =
    (setFieldValue: any) => (event: ChangeEvent<HTMLInputElement>) =>
        Number(event.target.value) !== 3
            ? setFieldValue("processReview", false)
            : event.target.value;

type Props = { item?: TPensionPayeeData };

const PayeeData = ({ item }: Props) => {
    const dispatch = useDispatch();
    const [formaPagamentoOptions, setFormaPagamentoOptions] = useState<
        {
            label: string;
            value: number;
        }[]
    >([]);

    const tipoPagamentoOptions = useSelector(getListAsOptionPaymentType);
    const formaPagamentoByTipo = useSelector(
        getFormsOfPaymentByPaymentTypeAsOption
    );

    useEffect(() => {
        if (item && formaPagamentoByTipo) {
            setFormaPagamentoOptions(
                formaPagamentoByTipo[item.paymentTypeId as number]
            );
        }
    }, [item, formaPagamentoByTipo]);

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        const { value } = event.target;
        setFormaPagamentoOptions(formaPagamentoByTipo[value as number]);
    };

    const { values, setFieldValue } = useFormikContext<TPensionPayeeData>();
    const {
        paymentStartDate,
        paymentFinishDate,
        monthlyPensionValue,
        fgtsPayment,
        pensionFgtsValue,
        thirteenthSalaryPayment,
        thirteenthSalaryValue,
        vacationPayment,
        vacationPensionValue,
		installmentsPending,
    } = values;

	const shortTerm = installmentsPending >= 12 ? 12 : installmentsPending;
	const longTerm = installmentsPending <= 12 ? 0 : installmentsPending - 12;

    useEffect(() => {
        dispatch(fetchParameterization(["indiceFgts"]));
        return () => {
            dispatch(actions.parameterization.clear());
        };
    }, [dispatch]);

    const banks = useSelector(getBanksAsOptions);
    const categories = useSelector(getPensionCategoriesAsOptions);
    const formaCorrecaoOptions = useSelector(
        getListFormulaCorrectionRuleAsOptionsFromList
    );
    const { indiceFgts } = useSelector(getParameterizationItems);

    //Calcula installments
    useEffect(() => {
        const installments = moment(paymentFinishDate).diff(
            moment(paymentStartDate),
            "months"
        );
        setFieldValue("installments", installments);
        
    }, [paymentStartDate, paymentFinishDate]);

    //Calcula valor pensão FGTS
    useEffect(() => {
        let pensionFgtsValue = 0;
        if (fgtsPayment) {
            pensionFgtsValue =
                toNumber(monthlyPensionValue) * (Number(indiceFgts) / 100);
        }
        setFieldValue("pensionFgtsValue", pensionFgtsValue);
        
    }, [fgtsPayment, monthlyPensionValue, indiceFgts]);

    //Calcula valor pensão férias
    useEffect(() => {
        let vacationPensionValue = 0;
        if (vacationPayment) {
            vacationPensionValue = toNumber(monthlyPensionValue) / 3;
        }
        setFieldValue("vacationPensionValue", vacationPensionValue);
        
    }, [vacationPayment, monthlyPensionValue]);

    //Calcula valor pensão 13º
    useEffect(() => {
        let thirteenthSalaryValue = 0;
        if (thirteenthSalaryPayment) {
            thirteenthSalaryValue = toNumber(monthlyPensionValue);
        }
        setFieldValue("thirteenthSalaryValue", thirteenthSalaryValue);
        
    }, [thirteenthSalaryPayment, monthlyPensionValue]);

    useEffect(() => {
        const sum =
            toNumber(monthlyPensionValue) +
            Number(pensionFgtsValue) +
            Number(thirteenthSalaryValue) +
            Number(vacationPensionValue);

        const shortTermValue = Number(sum.toFixed(2)) * shortTerm;
        
        setFieldValue(
            "shortTermValue",
            isNaN(shortTermValue) ? 0 : shortTermValue
        );
        
    }, [
        monthlyPensionValue,
        pensionFgtsValue,
        thirteenthSalaryValue,
        vacationPensionValue,
        shortTerm,
    ]);

    //Calcula valor longo prazo
    useEffect(() => {
        const sum =
            toNumber(monthlyPensionValue) +
            Number(pensionFgtsValue) +
            Number(thirteenthSalaryValue) +
            Number(vacationPensionValue);

        const termValue = Number(sum.toFixed(2)) * longTerm;

        setFieldValue("termValue", isNaN(termValue) ? 0 : termValue);
        
    }, [
        monthlyPensionValue,
        pensionFgtsValue,
        thirteenthSalaryValue,
        vacationPensionValue,
        longTerm,
    ]);

    return (
        <Panel title="Solicitar provisão de pensão" withPadding>
            <Grid container spacing={3}>
                <CPFField />
                <Grid item xs={12} md={3}>
                    <FieldColumn
                        label={t("personInformation.name")}
                        value={values.fullName}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <DateField
                        label={t("personInformation.birthDate")}
                        name="bornDate"
                        maxDate={moment()}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("Pagamentos:tipoPagamento")}
                        name="paymentTypeId"
                        options={tipoPagamentoOptions}
                        onChange={handleChange}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("Pagamentos:formaPagamento")}
                        name="paymentFormatId"
                        options={formaPagamentoOptions ?? []}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("solicitacaoPagamento:dadosFavorecido.banco")}
                        name="bankId"
                        options={banks}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={10}>
                            <TextField
                                label={t("solicitacaoPagamento:dadosFavorecido.agencia")}
                                name="agency"
                                readOnly
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField label="DV" name="agencyDv" readOnly />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={10}>
                            <TextField
                                label={t("solicitacaoPagamento:dadosFavorecido.conta")}
                                name="account"
                                readOnly
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField label="DV" name="accountDv" readOnly />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("pension:request.form.pensionCategory")}
                        name="pensionCategoryId"
                        options={categories}
                        onChange={onChangeCategory(setFieldValue)}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RadioGroup
                        label={t("pension:request.form.reviewAction")}
                        name="processReview"
                        disabled={values.pensionCategoryId !== 3}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <SelectField
                        label={t("pension:request.form.correctionForm")}
                        name="correctionFormId"
                        options={formaCorrecaoOptions}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        label={t("pension:request.form.decision")}
                        name="decision"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <DateField
                        label={t( "pension:request.form.pensionPaymentStartDate")}
                        name="paymentStartDate"
                        views={["year", "month"]}
                        format="MM/yyyy"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <DateField
                        label={t("pension:request.form.pensionPaymentEndDate")}
                        name="paymentFinishDate"
                        minDate={values.paymentStartDate === "" ? moment() : moment(values.paymentStartDate)}
                        views={["year", "month"]}
                        format="MM/yyyy"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <CurrencyField
                        label={t("pension:request.form.monthlyPensionAmount")}
                        name="monthlyPensionValue"
                        min={0.01}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FieldColumn
                        label={t("pension:request.form.numberOfPensionInstallments")}
                        value={values.installments}
                    />				
                </Grid>
				<Grid item xs={12} md={6}>
				<FieldColumn
                        label={t("pension:request.form.numberOfPensionInstallmentLeft") }
                        value={values.installmentsPending === null ? "" : values.installmentsPending}
                    />
				</Grid>
                <Grid item xs={12} md={3}>
                    <CheckboxField
                        label={t("pension:request.form.FGTSPayment")}
                        name="fgtsPayment"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FieldColumn
                        type="currency"
                        label={t("pension:request.form.FGTSPensionAmount")}
                        value={values.pensionFgtsValue === 0 ? "" : values.pensionFgtsValue}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CheckboxField
                        label={t("pension:request.form.FGTSLinkedAccount")}
                        name="pensionFgtsLinkedAccount"
                        disabled={!values.fgtsPayment}
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <CheckboxField
                        label={t("pension:request.form.vacationPayment")}
                        name="vacationPayment"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={9}>
                    <FieldColumn
                        type="currency"
                        label={t("pension:request.form.vacationPensionAmount")}
                        value={values.vacationPensionValue === 0 ? "" : values.vacationPensionValue}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <CheckboxField
                        label={t("pension:request.form.paymentOf13thSalary")}
                        name="thirteenthSalaryPayment"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} md={9}>
                    <FieldColumn
                        type="currency"
                        label={t("pension:request.form.pensionAmount13thSalary")}
                        value={values.thirteenthSalaryValue === 0 ? "" : values.thirteenthSalaryValue}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FieldColumn
                        type="currency"
                        label={"Valor Provisionado SAP"}
                        value={values.termValue + values.shortTermValue}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FieldColumn
                        type="currency"
                        label={t("pension:request.form.shortTermValue")}
                        value={values.shortTermValue}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FieldColumn
                        type="currency"
                        label={t("pension:request.form.longTermValue")}
                        value={values.termValue}
                    />
                </Grid>
            </Grid>
        </Panel>
    );
};

export default PayeeData;
