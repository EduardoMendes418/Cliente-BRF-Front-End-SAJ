import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

import { AutocompleteField, FormikContext } from "src/components/form";
import { actions } from "src/core/store";
import {
	getFilterCostCenter,
	getIsFetchingCostCenter,
	getListCostCenter,
	getMultipleListCostCenter,
} from "src/core/store/modules/cost-center/selectors";
import {
	fetchCostCenter,
	fetchCostCenterSmartSwap,
	fetchCostCenterWithLike,
} from "src/core/store/modules/cost-center/thunks";
import { TOptions } from "./AutocompleteField";
import { TCostCenter } from "src/core/models/cost-center";

type TCostCenterField = {
	name: string;
	label: string;
	setInvalidValueWhenTyping?: boolean;
	disabled?: boolean;
	withDescription?: boolean;
	sendId?: boolean;
	getFromSmartSwap?: boolean;
	groupingCostCenter?: boolean;
	onClearCostCenter?: () => void;
	onSelectCostCenter?: (contact: TCostCenter) => void
	initialValue?: TOptions | undefined;
	required?: boolean
};

const CostCenterField = ({
	setInvalidValueWhenTyping,
	name,
	disabled,
	withDescription,
	sendId,
	getFromSmartSwap,
	onSelectCostCenter,
	onClearCostCenter,
	groupingCostCenter,
	initialValue,
	required,
	...props
}: TCostCenterField) => {
	const dispatch = useDispatch();
	const { initialValues, setFieldValue } = useFormikContext<FormikContext>();

	const costCenters = useSelector(getMultipleListCostCenter);
	const loading = useSelector(getIsFetchingCostCenter);
	const currentSearchFilter = useSelector(getFilterCostCenter);
	const listCostCenter = useSelector(getListCostCenter);
	const [smartSwapOptions, setSmartSwapOptions] = useState<any>([]);

	const options = useMemo(
		() =>
			(costCenters[name] ?? []).map((costcenter) => ({
				label: `${costcenter}`.replace(/^0+/, ""),
				value: `${costcenter}`,
			})),
		[costCenters, name]
	);

	const optionsWithDescription = useMemo(
		() =>
			(listCostCenter ?? []).map((x) => ({
				label:
					sendId !== true
						? `${x.costCenter} - ${x.description}`.replace(/^0+/, "")
						: `${x.costCenter}`.replace(/^0+/, ""),
				value: sendId === true ? x.id : `${x.costCenter}`,
			})),
		[listCostCenter, sendId]
	);

	const optionsWithDescriptionSmartSwap = useMemo(
		() =>
			(smartSwapOptions ?? []).map((x: { Value: any; Id: any }) => ({
				label: `${x.Value}`,
				value: sendId === true ? x.Id : `${x.Value}`,
			})),
		[smartSwapOptions, sendId]
	);

	const delayedFetch = debounce(async (value: string) => {
		dispatch(actions.costCenter.changeFilter(name));
		if (getFromSmartSwap) {
			const { payload } = (await dispatch(
				fetchCostCenterSmartSwap({
					valueCriteria: value,
					customFieldName: groupingCostCenter === true ? "CentroDeCustoAgrupador_ProcessoEntitySchema" : "CentroDeCustoOrigem_ProcessoEntitySchema",
				})
			)) as any;
			setSmartSwapOptions(payload?.items);
			return;
		}
		if (withDescription) {
			dispatch(fetchCostCenter(value));
			return;
		} else {
			dispatch(
				fetchCostCenterWithLike({
					costCenter: value,
					field: name,
					disableCache: true,
				})
			);
			return;
		}
	}, 500);

	const search = useCallback(
		(value: string, reason: AutocompleteInputChangeReason) => {
			if (reason === "clear") {
				onClearCostCenter?.()
				dispatch(actions.costCenter.clearList(name));
			} else if (reason === "input" && value) {
				if (setInvalidValueWhenTyping) setFieldValue(name, -1);
				if (value.length >= 1) delayedFetch(value);
			} else if (reason === "input" && !value) {
				onClearCostCenter?.()
			}
		},
		[delayedFetch, dispatch, name, onClearCostCenter, setFieldValue, setInvalidValueWhenTyping]
	);

	useEffect(() => {
		if (initialValues[name] && Number(initialValues[name]))
			dispatch(
				fetchCostCenterWithLike({
					costCenter: initialValues[name].toString(),
					field: name,
				})
			);
		else dispatch(actions.costCenter.clearList(name));
	}, [initialValues, name, dispatch]);

	const optionCostCenters =
		withDescription === true ? optionsWithDescription : options;

		const onSelect = (selectedItem: TOptions | null) => {
			if (!selectedItem) {
				return
			}
	
			const costCenter = withDescription 
				? listCostCenter.find(x => x.costCenter === selectedItem.value)
				: costCenters[name].find(x => x.costCenter === selectedItem.value)
	
			if (costCenter?.id) {
				onSelectCostCenter?.(costCenter)
			}
		}

	return (
		<AutocompleteField
			{...props}
			options={
				getFromSmartSwap === true
					? optionsWithDescriptionSmartSwap
					: optionCostCenters
			}
			loading={loading && currentSearchFilter === name}
			onValueChange={search}
			disabled={disabled}
			disableField={disabled}
			onDemand
			name={name}
			onSelectValue={onSelect}
			initialValue={initialValue}
			required={required}
		/>
	);
};

export default CostCenterField;
