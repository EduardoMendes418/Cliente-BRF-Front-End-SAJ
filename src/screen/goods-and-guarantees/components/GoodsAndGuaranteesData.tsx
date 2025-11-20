import { Grid } from "@material-ui/core";

import AccordionPanel from "src/components/AccordionPanel";
import FieldColumn from "src/components/FieldColumn";
import { t } from "src/locale/i18n";

import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { useGuaranteeModality, useGuaranteeMethod, useGuaranteeType } from "src/hooks/fetchLists";

import {
	requestTypesOptions,
	updateTypesOptions,
	REQUEST_TYPE,
	TYPE_FLOW
} from "../constants";

type TGoodsAndGuaranteesData = {
	item: TGoodsGuaranteesRequest,
	typeFlow?: TYPE_FLOW
}

const GoodsAndGuaranteesData = ({ item, typeFlow }: TGoodsAndGuaranteesData) => {

	const { guaranteeModalityAsOptions } = useGuaranteeModality()
	const { guaranteeMethodAsOptions } = useGuaranteeMethod()
	const { guaranteeTypeAsOptions } = useGuaranteeType()

	if (!item.id) return null

	return (
		<AccordionPanel title={t('goodsAndGuarantees:form.goodsAndGuaranteesData')}>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.requestType')}
						value={item.requestTypeId}
						options={requestTypesOptions}
						type='list'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.guaranteeModality')}
						value={item.guaranteeModalityId}
						options={guaranteeModalityAsOptions}
						type='list'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.guaranteeType')}
						value={item.guaranteeTypeId}
						options={guaranteeTypeAsOptions}
						type='list'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.formOfGuarantee')}
						value={item.guaranteeMethodId}
						options={guaranteeMethodAsOptions}
						type='list'
					/>
				</Grid>
				{item.requestTypeId !== REQUEST_TYPE.NEW_GUARANTEE && (
					<Grid item md={3} xs={12}>
						<FieldColumn
							label={t('goodsAndGuarantees:form.updateType')}
							value={item.updateTypeId}
							options={updateTypesOptions}
							type='list'
						/>
					</Grid>
				)}
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.locationOfProperty')}
						value={item.goodLocation ?? item.judicialBlocksAndTransfer?.locateDistrict}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.requestDate')}
						value={item.requestDate ?? item.payment?.requestDate ?? item.judicialBlocksAndTransfer?.createdDate}
						type='date'
					/>
				</Grid>
					<Grid item md={3} xs={12}>
						<FieldColumn
							label={t("goodsAndGuarantees:form.dateOfAcknowledgment")}
							value={(item.dateOfAcknowledgment ?? null) as unknown as Date}
							type='date'
					/>
					</Grid> 
					<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("goodsAndGuarantees:form.safeDate")}
						value={(item.safeDate ?? null) as unknown as Date}
						type='date'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("goodsAndGuarantees:form.finalDate")}
						value={(item.finalDate ?? null) as unknown as Date}
						type='date'
					/>
				</Grid> 
				{item.requestTypeId !== REQUEST_TYPE.NEW_GUARANTEE && (
					<>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:form.initialPolicyNumber')}
								value={item.policyNumber}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:form.startDate')}
								value={item.startEffective as Date}
								type='date'
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:form.finishDate')}
								value={item.endEffective as Date}
								type='date'
							/>
						</Grid>
					</>
				)}
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.guaranteeAmount')}
						value={item.valueGuarantee}
						type='currency'
					/>
				</Grid>
				{typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT && (
					<>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.accountingBalance')}
								value={item.accountingBalance}
								type='currency'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.legalBalance')}
								value={item.legalBalance}
								type='currency'
							/>
						</Grid>
					</>
				)}
				<Grid item md={12} xs={12}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.description')}
						value={item.description ?? item.payment?.observation ?? item.judicialBlocksAndTransfer?.description}
					/>
				</Grid>
				{typeFlow === TYPE_FLOW.INSURANCE && (
					<>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:tasks.insuranceCompany')}
								value={item.insuranceCompany}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:form.startDate')}
								value={item.startEffective as string}
								type='date'
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:form.finishDate')}
								value={item.endEffective as string}
								type='date'
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.status')}
								value={item.isDeleted ? t('goodsAndGuarantees:management.dead') : t('enabled')}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:writeOffDate')}
								value={item.writeOffDate}
								type='date'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.accountingBalance')}
								value={item.accountingBalance}
								type='currency'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.legalBalance')}
								value={item.legalBalance}
								type='currency'
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:management.amountWrittenOff')}
								value={item.amountWrittenOff}
								type='currency'
							/>
						</Grid>
					</>
				)}
			</Grid>
		</AccordionPanel>
	)
}

export default GoodsAndGuaranteesData;
