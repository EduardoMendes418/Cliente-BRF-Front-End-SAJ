import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	SelectField,
	DateField,
	TextField,
	FormikContext,
	CurrencyField,
} from "src/components/form";
import Panel from "src/components/Panel";
import { useBanks } from "src/hooks/fetchLists";
import { t } from "src/locale/i18n";
import { BEARISH_REASONS } from "src/screen/goods-and-guarantees/constants";
import { IconButton, Grid } from "@material-ui/core";
import CalculateIcon from "@material-ui/icons/Functions";

import {
	depositAccountabilityStatusOptions,
	ACCOUNTABILITY_SITUATION,
	ACCOUNTABILITY_STATUS,
	situationStatusOptions,
} from "../../../constants";
import CreditPostingOnSapForm from "./CreditPostingOnSapForm";
import ReleasedToCompanyForm from "./ReleasedToCompanyForm";
import TransferForm from "./TransferForm";
import { valuesToNumber } from "src/core/utils/func";
import { TForm } from "src/screen/goods-and-guarantees/accountability/Form/hooks/useAccountability";
import { fetchExplanatoryNote } from "src/core/store/modules/explanatory-note/thunks";
import { getListExplanatoryNoteAsOptions } from "src/core/store/modules/explanatory-note/selectors";
import { TOptions } from "src/components/form/AutocompleteField";
import { getItemGuaranteeAccountability } from "src/core/store/modules/guarantee-accountability/selectors";

type Props = {
	hasItem: boolean;
	isVisible: boolean;
	readOnly: boolean;
	bearishReasons: BEARISH_REASONS;
	isReverseAccountability: boolean;
	statusFlowId: number;
	isReversal?: boolean
};

const EvaluationForm = ({
	hasItem,
	isVisible,
	readOnly,
	bearishReasons,
	isReverseAccountability,
	isReversal
}: Props) => {
	const { values, setFieldValue } = useFormikContext<FormikContext>();
	const dispatch = useDispatch();
	const itemAccountability = useSelector(getItemGuaranteeAccountability);

	useEffect(() => {
		if(readOnly === true){
			setFieldValue('valuationDate', itemAccountability?.valuationDate);
			setFieldValue('evaluator', itemAccountability?.evaluator);
		}
	}, [])

	useEffect(() => {
		dispatch(fetchExplanatoryNote({ notPaginate: true }));
	}, [dispatch]);
	const noteTypesOptions = useSelector(
		getListExplanatoryNoteAsOptions
	) as TOptions[];

	const { banksAsOptions } = useBanks();

	const isUnlocked = bearishReasons === BEARISH_REASONS.UNLOCKED;
	const isTransferBetweenProcess = bearishReasons === BEARISH_REASONS.TRANSFER_BETWEEN_PROCESS;
	const isTransfer = bearishReasons === BEARISH_REASONS.TRANSFER_BETWEEN_ACCOUNTS || isTransferBetweenProcess;

	useEffect(() => {
		if (
			values.status === ACCOUNTABILITY_SITUATION.REJECTED &&
			values.statusFlowId !== ACCOUNTABILITY_STATUS.DEAD
		) {
			setFieldValue("statusFlowId", ACCOUNTABILITY_STATUS.DEAD);
		}
	}, [values, setFieldValue]);

	const calculateTotalAmountWrittenOff = (event: any, fieldName: string) => {
		const { amountWrittenOff, fine, historicalInterest, charge, succumbence } =
			valuesToNumber(
				[
					"amountWrittenOff",
					"fine",
					"historicalInterest",
					"charge",
					"succumbence",
				],
				{ ...values, [fieldName]: event.target.value }
			) as TForm;

		const totalAmountWrittenOff =
			amountWrittenOff + fine + historicalInterest + charge + succumbence;

		setFieldValue("totalAmountWrittenOff", totalAmountWrittenOff);
		setFieldValue(fieldName, event.target.value);
	};

	let filtredDepositAccountabilityStatusOptions = [...depositAccountabilityStatusOptions]
	if (!isReversal && !readOnly) filtredDepositAccountabilityStatusOptions = depositAccountabilityStatusOptions.filter(({value}) => value !== ACCOUNTABILITY_STATUS.OVERTURNED)
	if (!isVisible) return null;

	const verifyStatusFlowId = values.statusFlowId === 4 || values.statusFlowId === 6 || values.statusFlowId === 5 ? true : false;
	const verifyStatus = values.status === 0 || values.status === 3 ? true : false;
	const isRequired = values.status ===  ACCOUNTABILITY_SITUATION.REJECTED ? false : !(verifyStatusFlowId && verifyStatus === true);

	return (
		<Panel
			title={t("goodsAndGuarantees:accountability.evaluation")}
			withPadding
		>
			<IconButton
				aria-label="Calculator"
				onClick={() => window.open("Calculator:///")}
				style={{ position: "absolute", right: "25px" }}
			>
				<CalculateIcon />
			</IconButton>
			<Grid container spacing={3}>
				{((!hasItem && !isReverseAccountability) ||
					!(
						hasItem &&
						isReverseAccountability &&
						values.status === ACCOUNTABILITY_SITUATION.OFFICE_PENDING
					)) && (
					<>
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
					</>
				)}
				<Grid item xs={12} md={3}>
					<SelectField
						required
						name="statusFlowId"
						label={t("goodsAndGuarantees:accountability.accountabilityStatus")}
						options={filtredDepositAccountabilityStatusOptions}
						readOnly={readOnly || values.status === ACCOUNTABILITY_SITUATION.REJECTED || isReversal}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						name="status"
						label={t("goodsAndGuarantees:accountability.situation")}
						options={situationStatusOptions}
						readOnly={readOnly || isReversal}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="note"
						label={t("goodsAndGuarantees:accountability.explanatoryNote")}
						options={noteTypesOptions}
						readOnly={readOnly}
					/>
				</Grid>
				<TransferForm
					isVisible={isTransfer}
					readOnly={readOnly || !!isReversal}
					banksAsOptions={banksAsOptions}
					isTransferBetweenProcess={isTransferBetweenProcess}
					isRequired={isRequired}
				/>
				<CreditPostingOnSapForm
					isVisible={isReverseAccountability || isUnlocked}
					readOnly={readOnly || !!isReversal}
					banksAsOptions={banksAsOptions}
					isReverseAccountability={isReverseAccountability}
					isRequired={isRequired}
				/>
				<ReleasedToCompanyForm
					isVisible={isReverseAccountability}
					readOnly={readOnly || !!isReversal}
					banksAsOptions={banksAsOptions}
					isRequired={isRequired}
				/>
				{!isTransfer && !isReverseAccountability && (
					<Grid item xs={12} md={3}>
						<DateField
							name="writeOffDate"
							label={t("goodsAndGuarantees:writeOffDate")}
							placeholder={t("form.typeHere")}
							readOnly={readOnly || !!isReversal}
							required={isRequired}
						/>
					</Grid>
				)}
				{values.bearishReasons === BEARISH_REASONS.UNLOCKED && (
					<Grid item xs={12} md={3}>
						<CurrencyField
							label={t("goodsAndGuarantees:accountability.amountWrittenOff")}
							name="amountWrittenOff"
							readOnly={readOnly || !!isReversal}
							onChange={(event) => {calculateTotalAmountWrittenOff(event, "amountWrittenOff");}}
						/>
					</Grid>
				)}
				{isTransfer && (
					<>
						<Grid item xs={12} md={3}>
							<CurrencyField
								label={"Valor da Atualização"}
								name="creditedAmount"
								readOnly
							/>
						</Grid>
					</>
				)}
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
