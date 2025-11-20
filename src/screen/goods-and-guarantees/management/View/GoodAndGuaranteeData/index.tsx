import { Grid } from "@material-ui/core";

import FieldColumn from "src/components/FieldColumn";
import AccordionPanel from "src/components/AccordionPanel";
import { TextField } from "src/components/form";

import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { t } from "src/locale/i18n";
import {
	requestTypesOptionsAll,
	REQUEST_TYPE,
	TYPE_FLOW,
	updateTypesOptions,
} from "src/screen/goods-and-guarantees/constants";
import GuaranteeProperty from "./GuaranteeProperty";
import GuaranteeInsurance from "./GuaranteeInsurance";
import GuaranteeLetter from "./GuaranteeLetter";
import GuaranteeJudicialDeposit from "./GuaranteeJudicialDeposit";
import { useGuaranteeModality, useGuaranteeType } from "src/hooks/fetchLists";

const title = {
	[TYPE_FLOW.INSURANCE]: t("goodsAndGuarantees:management.insuranceTitle"),
	[TYPE_FLOW.PROPERTY]: t("goodsAndGuarantees:management.propertyTitle"),
	[TYPE_FLOW.LETTER]: t("goodsAndGuarantees:management.letterTitle"),
	[TYPE_FLOW.JUDICIAL_DEPOSIT]: t(
		"goodsAndGuarantees:management.judicialDepositTitle"
	),
};

type TGoodAndGuaranteeData = {
	item: TGoodsGuaranteesRequest;
	typeFlow: TYPE_FLOW;
	startExpanded?: boolean;
};

const GoodAndGuaranteeData = ({
	item,
	typeFlow,
	startExpanded = true,
}: TGoodAndGuaranteeData) => {

	const { guaranteeModalityAsOptions } = useGuaranteeModality();
	const { guaranteeTypeAsOptions } = useGuaranteeType();

	let goodGuaranteeLinkedText = "";

	if (item.payment !== null)
		goodGuaranteeLinkedText = item.payment?.financeChartOfAccountsCategoryName ?? "";
	else if (item.judicialBlocksAndTransfer !== null)
		goodGuaranteeLinkedText = item.judicialBlocksAndTransfer?.financeChartOfAccountsCategoryName ?? "";
	else goodGuaranteeLinkedText = item.financeChartOfAccountsCategoryName ?? "";

	if (goodGuaranteeLinkedText === "") 
		goodGuaranteeLinkedText =
			guaranteeTypeAsOptions.find((itemOp) => itemOp.value === item.guaranteeTypeId)?.label ?? "";

	const updateValue = item.updateValue ?? 0;
	const accountingBalance = item.accountingBalance ?? 0;
	const updateAccountingBalance =  accountingBalance + updateValue;

	return (
		<AccordionPanel
			title={
				item.requestTypeId === REQUEST_TYPE.UPDATE_ENDORSEMENT
					? t("goodsAndGuarantees:management.endorsementTitle")
					: (title as any)[typeFlow]
			}
			startExpanded={startExpanded}
		>
			<Grid container spacing={2} alignItems="flex-start">
				{typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:form.guaranteeDate')}
							value={(item.guaranteeDate ?? item.effectiveDate) as Date}
							type='date'
						/>
					</Grid>
				)}
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:form.guaranteeModality")}
						value={item.guaranteeModalityId}
						type="list"
						options={guaranteeModalityAsOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:form.requestType")}
						value={item.requestTypeId}
						type="list"
						options={requestTypesOptionsAll}
					/>
				</Grid>
				{item.requestTypeId === REQUEST_TYPE.UPDATE_ENDORSEMENT && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t("goodsAndGuarantees:management.updateType")}
							value={item.updateTypeId}
							options={updateTypesOptions}
							type="list"
						/>
					</Grid>
				)}
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:form.guaranteeType")}
						value={goodGuaranteeLinkedText}
					/>
				</Grid>
				{typeFlow !== TYPE_FLOW.JUDICIAL_DEPOSIT && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:form.guaranteeDate')}
							value={(item.guaranteeDate ?? item.effectiveDate) as Date}
							type='date'
						/>
					</Grid>
				)}
				{typeFlow === TYPE_FLOW.INSURANCE && <GuaranteeInsurance item={item} />}
				{typeFlow === TYPE_FLOW.PROPERTY && <GuaranteeProperty item={item} />}
				{typeFlow === TYPE_FLOW.LETTER && <GuaranteeLetter item={item} />}
				{typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT && (
					<GuaranteeJudicialDeposit item={item} />
				)}
				{item.requestTypeId !== REQUEST_TYPE.UPDATE_ENDORSEMENT && (
					<>
						{![TYPE_FLOW.INSURANCE, TYPE_FLOW.JUDICIAL_DEPOSIT].includes(
							typeFlow
						) && (
							<Grid item xs={12} md={3}>
								<FieldColumn
									label={t("goodsAndGuarantees:form.guaranteeAmount")}
									value={item.valueGuarantee}
									type="currency"
								/>
							</Grid>
						)}
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t("goodsAndGuarantees:management.accountingBalance")}
								value={item.accountingBalance}
								type="currency"
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t("goodsAndGuarantees:management.legalBalance")}
								value={item.legalBalance}
								type="currency"
							/>
						</Grid>
						{typeFlow !== TYPE_FLOW.JUDICIAL_DEPOSIT && (
							<>
								<Grid item xs={12} md={3}>
								<FieldColumn
										label={t("goodsAndGuarantees:management.status")}
										value={
											item.isDeleted
												? t("goodsAndGuarantees:management.dead")
												: t("enabled")
										}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={t("goodsAndGuarantees:writeOffDate")}
										value={item.writeOffDate}
										type="date"
									/>
								</Grid>
							</>
						)}
					</>
				)}
				{typeFlow !== TYPE_FLOW.JUDICIAL_DEPOSIT && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={"Valor baixado"}
							value={item.amountWrittenOff}
							type="currency"
						/>
					</Grid>
				)}
				{typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT && (
					<>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.updateAccountingBalance')}
								value={updateAccountingBalance}
								type="currency"
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.updateValue')}
								value={item.updateValue}
								type="currency"
							/>
						</Grid>
					</>
				)}
				{item.requestTypeId === REQUEST_TYPE.UPDATE_ENDORSEMENT && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t("goodsAndGuarantees:management.writeOffDate")}
							value={item.writeOffDate}
							type="date"
						/>
					</Grid>
				)}
				<Grid item xs={12} md={12}>
					<TextField
						name="description"
						label={t('goodsAndGuarantees:accountability.description')}
						readOnly
						rows={5}
						maxLength={1000}
						multiline
					/>
				</Grid>
				<Grid item xs={12} md={12}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<TextField
								label={t("goodsAndGuarantees:observation")}
								name="observation"
								rows={5}
								maxLength={10000}
								multiline
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={12}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<TextField
								label={t("goodsAndGuarantees:conciliationKey")}
								name="conciliationKey"
								rows={5}
								maxLength={100}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</AccordionPanel>
	);
};

export default GoodAndGuaranteeData;
