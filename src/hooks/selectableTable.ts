import { useState, useEffect } from "react";

export type TSelectableTable = {
	id: number;
	checked?: boolean;
	notAllowed?: boolean;
}

const useSelectableTable = <T extends TSelectableTable>(tableItems: T[]) => {
	const [items, setItems] = useState<T[]>([]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [areAllItemsSelected, setAreAllItemsSelected] = useState<boolean>(false);
	const [haveAnySelectedItemFromCurrentPage, setHaveAnySelectedItemFromCurrentPage] = useState<boolean>(false);

	const isItemSelected = (itemId: number) => (
		!!selectedItems.find(item => item === itemId)
	);

	const selectItem = (itemId: number) => {
		const newSelectedItems = [...selectedItems, itemId];
		setSelectedItems(newSelectedItems);
	};

	const unselectItem = (itemId: number) => {
		const newSelectedItems = [...selectedItems].filter(item => item !== itemId);
		setSelectedItems(newSelectedItems);
	};

	const changeSelectedItems = (id: number) => {
		const isSelected = isItemSelected(id);
		if (isSelected) unselectItem(id);
		else selectItem(id);

		const updatedItems = [...items].map(item => {
			if (item.id !== id) return item;
			return ({ ...item, checked: !item.checked })
		});

		setItems(updatedItems);
	};

	const changeAllItems = (allSelected: boolean) => {
		let newSelectedItems = [...selectedItems];
		const updatedItems = [...items].map(item => {
			if (item.notAllowed) return ({ ...item });

			const itemId = Number(item.id);

			const isSelected = isItemSelected(itemId);
			if (allSelected && !isSelected) newSelectedItems.push(itemId);
			else if (!allSelected && isSelected) newSelectedItems = newSelectedItems.filter(item => item !== itemId);

			return ({ ...item, checked: allSelected });
		});

		setItems(updatedItems);
		setSelectedItems(newSelectedItems);
	}

	const handleOnSelectAllItems = () => {
		const allSelected = !areAllItemsSelected;
		setAreAllItemsSelected(allSelected);
		changeAllItems(allSelected);
	}

	const unselectAllItems = () => {
		changeAllItems(false);
	}

	useEffect(() => {
		const itemsList = [...tableItems].map((item) => {
			const isSelected = item.notAllowed ? undefined : isItemSelected(Number(item.id));
			return ({ ...item, checked: isSelected });
		});
		setItems(itemsList as T[]);
		
	}, [tableItems])

	useEffect(() => {
		const selectedItems = items.filter(item => item.checked);
		setAreAllItemsSelected(selectedItems.length === items.length);
		setHaveAnySelectedItemFromCurrentPage(selectedItems.length > 0)
	}, [items])

	return {
		items,
		selectedItems,
		unselectAllItems,
		areAllItemsSelected,
		changeSelectedItems,
		handleOnSelectAllItems,
		haveAnySelectedItemFromCurrentPage
	};
};

export default useSelectableTable;