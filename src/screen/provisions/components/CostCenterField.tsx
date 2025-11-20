import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

import { AutocompleteField, FormikContext } from "src/components/form";
import { actions } from "src/core/store";
import {
  getFilterCostCenter,
  getIsFetchingCostCenter,
  getMultipleListCostCenter,
} from "src/core/store/modules/cost-center/selectors";
import { fetchCostCenterWithLike } from "src/core/store/modules/cost-center/thunks";

type TCostCenterField = {
  name: string;
  label: string;
  setInvalidValueWhenTyping?: boolean;
};

const CostCenterField = ({
  setInvalidValueWhenTyping,
  ...props
}: TCostCenterField) => {
  const dispatch = useDispatch();
  const { initialValues, setFieldValue } = useFormikContext<FormikContext>();

  const costCenters = useSelector(getMultipleListCostCenter);
  const loading = useSelector(getIsFetchingCostCenter);
  const currentSearchFilter = useSelector(getFilterCostCenter);

  const options = useMemo(
    () =>
      (costCenters[props.name] ?? []).map((costcenter) => ({
        label: `${costcenter}`,
        value: `${costcenter}`,
      })),
    [costCenters, props.name]
  );

  const delayedFetch = debounce((value: string) => {
    dispatch(actions.costCenter.changeFilter(props.name));
    dispatch(fetchCostCenterWithLike({ costCenter: value, field: props.name, disableCache: true }));
  }, 800);

  const search = useCallback(
    (value: string, reason: AutocompleteInputChangeReason) => {
      if (reason === "clear")
        dispatch(actions.costCenter.clearList(props.name));
      else if (reason === "input" && value) {
        if (setInvalidValueWhenTyping) setFieldValue(props.name, -1);
        if (value.length >= 3) delayedFetch(value);
      }
    },
		
    []
  );

  useEffect(() => {
    if (initialValues[props.name] && Number(initialValues[props.name]))
      dispatch(
        fetchCostCenterWithLike({
          id: Number(initialValues[props.name]),
          field: props.name,
        })
      );
    else dispatch(actions.costCenter.clearList(props.name));
  }, [initialValues, props.name, dispatch]);

  return (
    <AutocompleteField
      {...props}
      options={options}
      loading={loading && currentSearchFilter === props.name}
      onValueChange={search}
      onDemand
    />
  );
};

export default CostCenterField;
