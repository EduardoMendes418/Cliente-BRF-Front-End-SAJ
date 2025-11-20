import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormikContext } from "formik";

import AccordionPanel from "src/components/AccordionPanel";
import TableComponent, { ColumnData } from "src/components/Table";

import { getListGuaranteeAccountability, getLoadingGuaranteeAccountability } from "src/core/store/modules/guarantee-accountability/selectors";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import useSelectableTable, { TSelectableTable } from "src/hooks/selectableTable";
import { useCurrentUser } from "src/config/permissions";
import { useTranslation } from "src/locale/i18n";
import { TCreditReceipt } from "src/core/models/credit-receipt";

type TAccountabilityTable = {
	folderNumber: string,
	account: string,
	bank: string,
	guaranteeDate: string,
	valueGuarantee: number,
	accountingBalance: number,
	amountWrittenOff: number
} & TSelectableTable;

type TAccountabilityList = {
	readonly: boolean;
	accountabilities?: TGuaranteeAccountability[];
}

const AccountabilityList = ({ readonly, accountabilities }: TAccountabilityList) => {
	const { setFieldValue } = useFormikContext<TCreditReceipt>();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();

	const items = useSelector(getListGuaranteeAccountability);

	const loading = useSelector(getLoadingGuaranteeAccountability);

	const rows = useMemo(() => (accountabilities ? accountabilities : items).map((item: TGuaranteeAccountability) => {
		const { id, folderNumber, bankToSendLicence, amountWrittenOff, goodsGuaranteesRequest } = item;
		const {
			guaranteeDate,
			valueGuarantee,
			accountingBalance,
			account
		} = goodsGuaranteesRequest ?? {} as TGoodsGuaranteesRequest;

		return ({
			id,
			folderNumber,
			account,
			bank: bankToSendLicence,
			guaranteeDate,
			valueGuarantee,
			accountingBalance,
			amountWrittenOff,
			checked: false,
		})
	}), [items, accountabilities]);

	const selectableTable = useSelectableTable(rows as TAccountabilityTable[]);

	const columns: ColumnData[] = [
		{ label: t('form.CTGFolder'), field: 'folderNumber' },
		{ label: t('creditReceipt:list.accountability.account'), field: 'account' },
		{ label: t('form.bank'), field: 'bank' },
		{ label: t('creditReceipt:list.accountability.depositDate'), field: 'guaranteeDate', type: 'date' },
		{ label: t('creditReceipt:list.accountability.depositValue'), field: 'valueGuarantee', type: 'currency' },
		{ label: t('creditReceipt:list.accountability.accountingBalance'), field: 'accountingBalance', type: 'currency' },
		{ label: t('creditReceipt:list.accountability.amountWrittenOff'), field: 'amountWrittenOff', type: 'currency' }
	];

	const handleOnCheckedChange = (id: number) => {
		selectableTable.changeSelectedItems(+id);
	}

	const handleOnCheckedAllChange = () => {
		selectableTable.handleOnSelectAllItems();
	}

	useEffect(() => {
		const accountabilities = selectableTable.selectedItems.reduce((acc, current) => {
			acc.push({ id: current });
			return acc;
		}, [] as { id: number }[]);
		setFieldValue('accountabilities', accountabilities);
		
	}, [selectableTable.selectedItems]);

	const { currentScreenPermissions } = useCurrentUser(id);

	return (
		<AccordionPanel title={t('creditReceipt:form.accountabilityList')} startExpanded noContentMargin>
			<TableComponent
				columns={columns}
				rows={selectableTable.items}
				isLoading={loading}
				showCheckboxColumn={readonly ? false : currentScreenPermissions.edit}
				onCheckedChange={handleOnCheckedChange}
				onCheckedAllChange={handleOnCheckedAllChange}
				isAllItemsSelected={selectableTable.areAllItemsSelected}
				isCheckboxIndeterminate={
					selectableTable.haveAnySelectedItemFromCurrentPage &&
					!selectableTable.areAllItemsSelected}
			/>
		</AccordionPanel>
	);
}

export default AccountabilityList;