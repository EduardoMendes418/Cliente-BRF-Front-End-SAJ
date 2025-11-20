import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
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
	TOptionsSelect,
	ContactsAutocompleteFieldUnifier,
} from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import { TPensionPayeeData } from "src/core/models/pensions";
import { t } from "src/locale/i18n";
import { getPensionCategoriesAsOptions } from "src/core/store/modules/pensions/request-pensions/selectors";
import { getParameterizationItems } from "src/core/store/modules/parameterization/selectors";
import { fetchParameterization } from "src/core/store/modules/parameterization/thunks";
import { AppDispatch, actions } from "src/core/store";

import {
	getFormsOfPaymentByPaymentTypeAsOption,
	getListAsOptionPaymentType,
} from "src/core/store/modules/payment-type/selectors";
import { numberValidator } from "src/core/utils/yup-validations";
import { toNumber } from "src/core/utils/func";
import { getListFormulaCorrectionRuleAsOptionsFromList } from "src/core/store/modules/formula-correction-rule/selectors";
import { Button } from "src/components/button";
import { useUpdateSupplierModal } from "../hooks/useModal";

import { useParams } from "react-router-dom";

import { TContact, TContactWithoutIncludes } from "src/core/models/contacts";
import { listPaymentBanks } from "src/core/store/modules/payment/selectors";
import { getPaymentBanks } from "src/core/store/modules/payment/thunks";
import { useBanks } from "src/hooks/fetchLists";
import { useSnackbar } from "notistack";

export const validationSchema = {
	bankId: yup.number().when("paymentFormatId", {
		is: "",
		then: yup.number().required(t("required")),
	}),
	agency: yup.string().when("paymentFormatId", {
		is: "",
		then: yup.number().required(t("required")),
	}),
	account: yup.string().when("paymentFormatId", {
		is: "",
		then: yup.number().required(t("required")),
	}),
	processReview: yup.boolean().when("pensionCategoryId", {
		is: 3,
		then: yup.boolean().required(t("required")),
	}),
	fgtsPayment: yup.boolean(),
	pensionFgtsLinkedAccount: yup.boolean(),
	vacationPayment: yup.boolean(),
	thirteenthSalaryPayment: yup.boolean(),
	favoredId: numberValidator,
};

const onChangeCategory =
	(setFieldValue: any) => (event: ChangeEvent<HTMLInputElement>) =>
		Number(event.target.value) !== 3
			? setFieldValue("processReview", false)
			: event.target.value;

type Props = { item?: TPensionPayeeData };

const PayeeData = ({ item }: Props) => {

	const dispatch = useDispatch<AppDispatch>();
	const paymentBanks = useSelector(listPaymentBanks);
	const { enqueueSnackbar } = useSnackbar()

	const [formaPagamentoOptions, setFormaPagamentoOptions] = useState<
		{
			label: string;
			value: number;
		}[]
	>([]);

	const { banks } = useBanks();
	const [contactSelected, setContactSelected] =
		useState<TContactWithoutIncludes | null | TContact>(null);
	const tipoPagamentoOptions = useSelector(getListAsOptionPaymentType);
	const formaPagamentoByTipo = useSelector(getFormsOfPaymentByPaymentTypeAsOption);
	const { values, setFieldValue, setValues } = useFormikContext<TPensionPayeeData>();

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
		installments,
	} = values;
	
	const { id } = useParams<{ id: string }>();

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
	const onSelectContact = async (contact: TContact) => {
		setContactSelected(contact);
		setValues({
			...values,
			favoredId: contact.id,
			fullName: contact.name,
			nameOrCpf: String(contact.id),
			cpf: contact.cpfCnpj,
		});

		const { meta, payload } = await dispatch(getPaymentBanks(contact.cpfCnpj));
		
		if (meta.requestStatus === "rejected") {
			enqueueSnackbar(payload.detail, { variant: "error" })
		}
	};

	const shortTerm = installments >= 12 ? 12 : installments;
	const longTerm = installments <= 12 ? 0 : installments - 12;

	useEffect(() => {
		dispatch(fetchParameterization(["indiceFgts"]));
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	const categories = useSelector(getPensionCategoriesAsOptions);
	const formaCorrecaoOptions = useSelector(
		getListFormulaCorrectionRuleAsOptionsFromList
	);
	const { indiceFgts } = useSelector(getParameterizationItems);
	const { showModal } = useUpdateSupplierModal();

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
			thirteenthSalaryValue = (installments / 12) * toNumber(monthlyPensionValue);
		}
		setFieldValue("thirteenthSalaryValue", thirteenthSalaryValue);
	}, [thirteenthSalaryPayment, monthlyPensionValue]);

	useEffect(() => {
		const sum =
			toNumber(monthlyPensionValue) +
			Number(pensionFgtsValue) +
			Number(thirteenthSalaryValue) +
			Number(vacationPensionValue);
		const shortTermValue = sum * shortTerm;
		setFieldValue("shortTermValue", isNaN(shortTermValue) ? 0 : shortTermValue);
		
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
		const termValue = sum * longTerm;
		setFieldValue("termValue", isNaN(termValue) ? 0 : termValue);
		
	}, [
		monthlyPensionValue,
		pensionFgtsValue,
		thirteenthSalaryValue,
		vacationPensionValue,
		longTerm,
	]);

	const isNew = id === "novo";

	const openUpdateSupplierModal = useCallback(() => {
		showModal({
			data: values,
			callback: (data) => {
				setValues({
					...values,
					...data,
				});
			},
		});
	}, [showModal, values, setValues]);

	useEffect(() => {
		if (paymentBanks && paymentBanks.length > 0 && contactSelected?.id) {
			const paymentBank = paymentBanks[0];

			if (paymentBanks.length === 1) {
				const bank = banks.find((x) => x.code === paymentBank.codBanco);
				setFieldValue("bancoId", bank?.id);
			}

			setFieldValue("agency", paymentBank.codAgencia);
			setFieldValue(
				"agencyDv",
				paymentBank.digAgencia === null ? 0 : paymentBank.digAgencia
			);
			setFieldValue("account", paymentBank.codConta);
			setFieldValue(
				"accountDv",
				paymentBank.digConta === null ? 0 : paymentBank.digConta
			);
			setFieldValue('bornDate', contactSelected?.birthDate)
		}
		
	}, [banks, paymentBanks, setFieldValue, contactSelected]);

	const bankOption = useMemo<TOptionsSelect[]>(
		() =>
			contactSelected?.id && paymentBanks
				? banks
						.slice()
						.filter((b) => paymentBanks?.find((x) => x.codBanco === b.code))
						.map((x) => {
							return {
								label: x.name,
								value: x.id,
							};
						})
				: banks.slice().map((x) => {
						return {
							label: x.name,
							value: x.id,
						};
				  }),
		[banks, paymentBanks, contactSelected]
	);
			  
	return (
		<Panel
			title="Solicitar provisão de pensão"
			withPadding
			slotTopRight={
				isNew && (
					<Button
						text={t(
							"solicitacaoPagamento:dadosFavorecido.supplierChangeButton"
						)}
						onClick={openUpdateSupplierModal}
					/>
				)
			}
			slotTopRightPermission="edit"
		>
			<Grid container spacing={3}>
				<ContactsAutocompleteFieldUnifier
					filter="cpfCnpj"
					name={item ? "cpf" : "nameOrCpf"}
					label={t("solicitacaoPagamento:dadosFavorecido.cpfcnpj")}
					onSelectContact={onSelectContact}
					mainLabel={t("pension:request.form.name")}
					mainName="fullName"
					popoverDisabled={true}
				>
					<Grid item md={3} xs={12}>
						<FieldColumn
							label={t("pension:request.form.name")}
							value={values.fullName}
						/>
					</Grid>
				</ContactsAutocompleteFieldUnifier>
				<Grid item xs={12} md={3}>
					<DateField
						required
						label={t("personInformation.birthDate")}
						name="bornDate"
						maxDate={moment()}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						label={t("Pagamentos:tipoPagamento")}
						name="paymentTypeId"
						options={tipoPagamentoOptions}
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						label={t("Pagamentos:formaPagamento")}
						name="paymentFormatId"
						options={formaPagamentoOptions ?? []}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t("solicitacaoPagamento:dadosFavorecido.banco")}
						name="bankId"
						options={bankOption}
						readOnly={paymentBanks?.length === 1}
						required
					/>
				</Grid>
				<Grid item xs={10} md={2}>
					<TextField
						label={t("solicitacaoPagamento:dadosFavorecido.agencia")}
						name="agency"
						readOnly
					/>
				</Grid>
				<Grid item xs={2} md={1}>
					<TextField label="DV" name="agencyDv" maxLength={4} readOnly />
				</Grid>
				<Grid item xs={10} md={2}>
					<TextField
						label={t("solicitacaoPagamento:dadosFavorecido.conta")}
						name="account"
						readOnly
					/>
				</Grid>
				<Grid item xs={2} md={1}>
					<TextField label="DV" name="accountDv" readOnly maxLength={1} />
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						label={t("pension:request.form.pensionCategory")}
						name="pensionCategoryId"
						options={categories}
						onChange={onChangeCategory(setFieldValue)}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<RadioGroup
						label={t("pension:request.form.reviewAction")}
						name="processReview"
						disabled={values.pensionCategoryId !== 3}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t("pension:request.form.correctionForm")}
						name="correctionFormId"
						options={formaCorrecaoOptions}
					/>
				</Grid>

				<Grid item xs={12} md={3}>
					<TextField
						label={t("pension:request.form.decision")}
						name="decision"
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						required
						label={t("pension:request.form.pensionPaymentStartDate")}
						name="paymentStartDate"
						views={["year", "month"]}
						format="MM/yyyy"
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						required
						label={t("pension:request.form.pensionPaymentEndDate")}
						name="paymentFinishDate"
						minDate={
							values.paymentStartDate === ""
								? moment()
								: moment(values.paymentStartDate)
						}
						views={["year", "month"]}
						format="MM/yyyy"
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						required
						label={t("pension:request.form.monthlyPensionAmount")}
						name="monthlyPensionValue"
						min={0.01}
					/>
				</Grid>
				<Grid item xs={12}>
					<FieldColumn
						label={t("pension:request.form.numberOfPensionInstallments")}
						value={values.installments}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CheckboxField
						label={t("pension:request.form.FGTSPayment")}
						name="fgtsPayment"
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
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CheckboxField
						label={t("pension:request.form.vacationPayment")}
						name="vacationPayment"
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
