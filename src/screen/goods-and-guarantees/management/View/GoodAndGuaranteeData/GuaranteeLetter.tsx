import { Grid } from "@material-ui/core";

import FieldColumn from "src/components/FieldColumn";

import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { useBanks } from "src/hooks/fetchLists";
import { t } from "src/locale/i18n";

type TGuaranteeLetter = {
	item: TGoodsGuaranteesRequest
}

const GuaranteeLetter = ({ item }: TGuaranteeLetter) => {
	const { banksAsOptions } = useBanks();

	return (
		<>
			<Grid item xs={12} md={3}>
				<FieldColumn
					label={t('form.bank')}
					value={item.bankId}
					type='list'
					options={banksAsOptions}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<FieldColumn
					label={t('goodsAndGuarantees:formFlow.suretyLetterNumber')}
					value={item.suretyLetterNumber}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<FieldColumn
					label={t('goodsAndGuarantees:formFlow.startEffective')}
					value={item.startEffective as Date}
					type='date'
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<FieldColumn
					label={t('goodsAndGuarantees:formFlow.endEffective')}
					value={item.endEffective as Date}
					type='date'
				/>
			</Grid>
		</>
	)
}

export default GuaranteeLetter;