import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TInspectionMethod } from "src/core/models/inspection-method";
import { actions } from "src/core/store";
import { getItemInspectionMethod } from "src/core/store/modules/inspection-method/selectors";
import { fetchInspectionMethod } from "src/core/store/modules/inspection-method/thunks";

export const useInspectionMethodInitialValues = (): TInspectionMethod => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const isNew = id === "novo";
    const item = useSelector(getItemInspectionMethod);
    const [hasItem] = useState(Object.keys(item ?? {}).length > 0);

    useEffect(() => {
        if (isNew) return;
        if (!hasItem) dispatch(fetchInspectionMethod({ id }));

        return () => {
            dispatch(actions.inspectionMethod.setItem({}));
        };
    }, [isNew, hasItem, dispatch, id]);

    return {
        id: 0,
        describe: item.describe ?? "",
        status: item.status ?? true,
        moduleId: 0,
    };
};
