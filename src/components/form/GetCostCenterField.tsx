import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

import { AutocompleteField, FormikContext } from "src/components/form";
import { actions } from "src/core/store";
import {
  getIsFetchingCostCenter,
  getListCostCenter,
} from "src/core/store/modules/cost-center/selectors";
import { fetchCostCenter } from "src/core/store/modules/cost-center/thunks";
import { TCostCenter } from "src/core/models/cost-center";

type TCostCenterField = {
  name: string;
  label: string;
  setInvalidValueWhenTyping?: boolean;
  required?: boolean;
};

const GetCostCenterField = ({
  setInvalidValueWhenTyping,
  required,
  ...props
}: TCostCenterField) => {
  const dispatch = useDispatch();
  const { initialValues, setFieldValue } = useFormikContext<FormikContext>();

  const costCenters = useSelector(getListCostCenter);
  const loading = useSelector(getIsFetchingCostCenter);

  const options = useMemo(
    () =>
      (costCenters ?? []).map((costCenter: TCostCenter) => ({
        label: costCenter.costCenter,
        value: costCenter.id,
      })),
    [costCenters]
  );

  const delayedFetch = debounce((value: string) => {
    dispatch(fetchCostCenter(value));
  }, 500);

  const search = useCallback(
    (value: string, reason: AutocompleteInputChangeReason) => {
      if (reason === "clear") dispatch(actions.costCenter.clearList());
      else if (reason === "input" && value) {
        if (setInvalidValueWhenTyping) setFieldValue(props.name, -1);
        if (value.length >= 3) delayedFetch(value);
      }
    },
		
    []
  );

  useEffect(() => {
    if (initialValues[props.name] && Number(initialValues[props.name]))
      dispatch(fetchCostCenter(initialValues[props.name]));
    else dispatch(actions.costCenter.clearList());
  }, [initialValues, props.name, dispatch]);

  return (
    <AutocompleteField
      {...props}
	  required={required}
      options={options}
      loading={loading}
      onValueChange={search}
      onDemand
    />
  );
};

export default GetCostCenterField;
