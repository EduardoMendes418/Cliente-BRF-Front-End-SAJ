import { useState, ChangeEvent } from "react";

import { TBudget, TBudgetFile } from 'src/core/models/goods-guarantee-estimates';
import { alert } from 'src/components/modals'
import { t } from "src/locale/i18n";
import { useSnackbar } from "notistack";

export const useGoodsAndGuaranteesBudgets = (budgets: TBudget[] | undefined) => {
	const [budgetList, setBudgetList] = useState<TBudget[]>(
		budgets
			? [...budgets].map(budget => ({ ...budget, isSelected: budget.isApproved }))
			: []
	);

	const { enqueueSnackbar } = useSnackbar();

	const getNextId = () => {
		if (!budgetList || budgetList.length === 0) return 1;

		const lastItemIndex = budgetList.length - 1
		return budgetList[lastItemIndex].id + 1
	}

	const getItemIndex = (id: number) => budgetList.findIndex(item => item.id === id);
	
	const editDescription = (id: number, field:string, value: string) => {
		const items = [...budgetList];
		const index = getItemIndex(id);

		items[index] = { ...budgetList[index], [field]: value };
		setBudgetList(items);
	}

	const onAddBudget = (budget: TBudget) => {
		if (budget.isApproved && budgetList.some((item) => item.isApproved)) {
			alert(t('goodsAndGuarantees:tasks.enforceOnlyOneFavorit'), t('goodsAndGuarantees:tasks.favoriteModalTitle'));
			return false;
		}

		const newBudget = { ...budget, id: getNextId(), isSelected: false };
		setBudgetList([...budgetList, newBudget]);
		return true;
	}

	const onEditBudget = (budget: TBudget) => {
		if (budget.isApproved && budgetList.some((item) => item.isApproved && budget.id !== item.id)) {
			alert(t('goodsAndGuarantees:tasks.enforceOnlyOneFavorit'), t('goodsAndGuarantees:tasks.favoriteModalTitle'));
			return;
		}

		const items = [...budgetList];
		const index = getItemIndex(budget.id);

		items[index] = { ...budget };

		setBudgetList(items);
	}

	const onDeleteBudget = (budget: TBudget) => {
		setBudgetList([...budgetList.filter(item => item.id !== budget.id)]);
	}

	const onAddAttachment = (event: ChangeEvent, budget: TBudget, isMainFile = false) => {
		const { files } = event.target as HTMLInputElement;

		const normalizeFiles = Array.from(files || []).map(file => ({ isMainFile, file }))
		
		if(normalizeFiles[0].file?.name.length > 119){
			return enqueueSnackbar(
				t("goodsAndGuarantees:characterLimiterWarningMessage"),
				{ variant: "error" }
			);
		}
	
		const itemToUpdate = { ...budget };
		itemToUpdate.files = [...itemToUpdate.files, ...normalizeFiles];

		onEditBudget(itemToUpdate);
	}

	const onDeleteAttachment = (budgetId: number, file: File) => {
		const currentBudget = budgetList.find(item => item.id === budgetId);

		if (!currentBudget) return;

		let fileFilter = ({ file: value }: TBudgetFile) => value.name !== file.name;
		if ((file as any).id) {
			fileFilter = ({ file: value }: any) => value.id !== (file as any).id;
		}

		const newValue = currentBudget.files.filter(fileFilter);

		onEditBudget({ ...currentBudget, files: [...newValue] });
	}

	const onSelectBudget = (budget: TBudget) => {
		let itemsToUpdate = [...budgetList];
		itemsToUpdate = itemsToUpdate.map(item => {
			const isApproved = item.id === budget.id;
			return ({ ...item, isApproved, isSelected: isApproved })
		});
		setBudgetList(itemsToUpdate);
	}

	const hasMainfile = () => {
		for (let index = 0; index < budgetList.length; index++) {
			const currentBudget = budgetList[index];
			for (let index = 0; index < currentBudget.files.length; index++) {
				const element = currentBudget.files[index];
				if (element.isMainFile) return true;
			}
		}
		return false
	}

	return {
		budgetList,
		onAddBudget,
		onEditBudget,
		onDeleteBudget,
		onAddAttachment,
		onDeleteAttachment,
		onSelectBudget,
		hasMainfile,
		editDescription
	}
}