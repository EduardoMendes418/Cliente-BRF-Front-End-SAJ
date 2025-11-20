import { Grid } from "@material-ui/core";

import FieldColumn from "src/components/FieldColumn";

import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { t } from "src/locale/i18n";

type TGuaranteeProperty = {
	item: TGoodsGuaranteesRequest
}

const GuaranteeProperty = ({ item }: TGuaranteeProperty) => (
	<>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:form.locationOfProperty')}
				value={item.goodLocation}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:formFlow.registrationNumber')}
				value={item.registrationNumber}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:formFlow.fixedAssetRegistryNumber')}
				value={item.fixedAssetRegistryNumber}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<FieldColumn
				label={t('goodsAndGuarantees:formFlow.invoiceNumber')}
				value={item.invoiceNumber}
			/>
		</Grid>
	</>
)

export default GuaranteeProperty;