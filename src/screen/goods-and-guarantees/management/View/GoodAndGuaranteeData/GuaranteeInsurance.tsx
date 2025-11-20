import { Grid } from "@material-ui/core";

import FieldColumn from "src/components/FieldColumn";

import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { t } from "src/locale/i18n";

type TGuaranteeInsurance = {
	item: TGoodsGuaranteesRequest
}

const GuaranteeInsurance = ({ item }: TGuaranteeInsurance) => (
	<>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:management.broker')}
				value={item.insuranceCompany}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:management.policyNumber')}
				value={item.policyNumber}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:management.endorsementNumber')}
				value={item.endorsementNumber}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:emissionDate')}
				value={item.emissionDate as Date}
				type='date'
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:form.startDate')}
				value={item.startEffective as Date}
				type='date'
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:form.finishDate')}
				value={item.endEffective as Date}
				type='date'
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:form.guaranteeAmount')}
				value={item.valueGuarantee}
				type='currency'
			/>
		</Grid>
	</>
)

export default GuaranteeInsurance;