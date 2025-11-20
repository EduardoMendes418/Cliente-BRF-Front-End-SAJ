import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

import { FormikContext } from "src/components/form";
import AutocompleteMultipleField from "../form/AutocompleteMultipleField";
import { actions } from "src/core/store";
import {
  getFilterCostCenter,
  getIsFetchingCostCenter,
  getListCostCenter,
  getMultipleListCostCenter,
} from "src/core/store/modules/cost-center/selectors";
import { fetchCostCenter, fetchCostCenterSmartSwap, fetchCostCenterWithLike } from "src/core/store/modules/cost-center/thunks";

type TCostCenterField = {
  name: string;
  label: string;
  setInvalidValueWhenTyping?: boolean;
  withDescription?: boolean;
  sendId?: boolean;
  getFromSmartSwap?: boolean;
};

const CostCenterMultipleField = ({
  setInvalidValueWhenTyping,
	name,
	withDescription,
	sendId,
	getFromSmartSwap,
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
        label: `${costcenter}`.replace(/^0+/, ''),
        value: `${costcenter}`,
      })),
    [costCenters, name]
  );

  const optionsWithDescription = useMemo(
    () =>
      (listCostCenter ?? []).map((x) => ({
        label: (sendId === true && withDescription === true) ? `${x.costCenter} - ${x.description}`.replace(/^0+/, '') : `${x.costCenter}`.replace(/^0+/, ''),
        value: sendId === true ? x.id : `${x.costCenter}`,
      })),
    [listCostCenter, sendId, withDescription]
  ); 

  const optionsWithDescriptionSmartSwap = useMemo(
    () =>
      (smartSwapOptions ?? []).map((x: { Value: any; Id: any; }) => ({
        label: `${x.Value}`,
        value: sendId === true ? x.Id : `${x.Value}`,
      })),
    [smartSwapOptions, sendId]
  );  
  
  const delayedFetch = debounce(async (value: string) => {
    dispatch(actions.costCenter.changeFilter(name));
	if(getFromSmartSwap){
		const {payload} =  await dispatch(fetchCostCenterSmartSwap({valueCriteria: value, customFieldName: 'CentroDeCustoOrigem_ProcessoEntitySchema'})) as any
		setSmartSwapOptions(payload?.items)
		return
	}
	if(withDescription){
		dispatch(fetchCostCenter(value));		
		return

	} else {
		dispatch(fetchCostCenterWithLike({ costCenter: value, field: name, disableCache: true }));
		return

	}
  }, 500);
 
  const search = useCallback(
    (value: string, reason: AutocompleteInputChangeReason) => {
      if (reason === "clear")
        dispatch(actions.costCenter.clearList(name));
      else if (reason === "input" && value) {
        if (setInvalidValueWhenTyping) setFieldValue(name, -1);
        if (value.length >= 1) delayedFetch(value);
      }
    },
    [delayedFetch, dispatch, name, setFieldValue, setInvalidValueWhenTyping]
  );

  useEffect(() => {
    if (initialValues[name] && Number(initialValues[name]))
      dispatch(
        fetchCostCenterWithLike({
          id: Number(initialValues[name]),
          field: name,
        })
      );
    else dispatch(actions.costCenter.clearList(name));
  }, [initialValues, name, dispatch]);

  const optionCostCenters = withDescription === true ? optionsWithDescription : options;

  return (
    <AutocompleteMultipleField
      {...props}
	  options={getFromSmartSwap === true ? optionsWithDescriptionSmartSwap : optionCostCenters}
      loading={loading && currentSearchFilter === name}
      onValueChange={search}
      onDemand
	  name={name}
    />
  );
};

export default CostCenterMultipleField;
