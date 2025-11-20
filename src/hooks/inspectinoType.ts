import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TInspectionType } from "src/core/models/inspection-type";
import { actions } from "src/core/store";
import { getItemInspectionType } from "src/core/store/modules/inspection-type/selectors";
import { fetchInspectionType } from "src/core/store/modules/inspection-type/thunks";

export const useInspectionTypeInitialValues = (): TInspectionType => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const isNew = id === "novo";
    const item = useSelector(getItemInspectionType);
    const [hasItem] = useState(Object.keys(item ?? {}).length > 0);

    useEffect(() => {
        if (isNew) return;
        if (!hasItem) dispatch(fetchInspectionType({ id }));

        return () => {
            dispatch(actions.inspectionType.setItem({}));
        };
    }, [isNew, hasItem, dispatch, id]);

    return {
        id: 0,
        form: item.form ?? "",
        inspectionPaymentId: item.inspectionPaymentId,
    };
};
