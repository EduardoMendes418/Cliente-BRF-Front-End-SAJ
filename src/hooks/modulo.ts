import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOptionsSelect } from "src/components/form";
import { getModuloList } from "src/core/store/modules/modulo/selectors";
import { fetchModuloList } from "src/core/store/modules/modulo/thunks";

export const useModulos = (isRejectionAndReturnReason: boolean = true) => {
	const dispatch = useDispatch();

	const modulos = useSelector(getModuloList);

	useEffect(() => {
		dispatch(fetchModuloList({
			isRejectionAndReturnReason
		}));
	}, [dispatch, isRejectionAndReturnReason]);

	const modulosAsOptions = useMemo<TOptionsSelect[]>(
		() =>
			modulos.map((x) => ({
				label: x.descricao,
				value: x.id,
			})),
		[modulos]
	);

	return {
		modulos,
		modulosAsOptions,
	};
};

