import {useCallback, useEffect, useMemo, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOptionsSelect } from "src/components/form";
import { TUserFilters } from "src/core/models/users";
import {
	getIsFetchingUsers,
	getListUsersFromMultiple
} from "src/core/store/modules/users/selectors";
import { fetchUsers} from "src/core/store/modules/users/thunks";
import {actions} from "../core/store";
import debounce from "lodash/debounce";

export const useSearchUsers = (searchAtributes: TUserFilters, fieldName?: string) => {
	const dispatch = useDispatch();
	const users = useSelector(getListUsersFromMultiple(fieldName));
	const isLoading = useSelector(getIsFetchingUsers)
	const oldSearch = useRef<TUserFilters | null>(null)
	
	
	const cleanList = useCallback(() => {
		dispatch(actions.users.clearList(fieldName))
	}, [dispatch, fieldName])

	const usersFetch = useRef(
		debounce((search: TUserFilters) => dispatch(fetchUsers({...search, field: fieldName, isActive: search.isActive})), 800)
	);

	useEffect(() => {
		if (
			searchAtributes.name !== oldSearch.current?.name ||
			searchAtributes.profileId !== oldSearch.current?.profileId ||
			searchAtributes.email !== oldSearch.current?.email
		){
			oldSearch.current = searchAtributes;
			usersFetch.current?.(searchAtributes);
		}

	}, [dispatch, searchAtributes, usersFetch, oldSearch]);

	const emailOptions = useMemo<TOptionsSelect[]>(
		() =>
			users.map((x) => ({
				label: x.email,
				value: x.email,
			})),
		[users]
	);

	const usersOptions = useMemo<TOptionsSelect[]>(
		() =>
			users.map((x) => ({
				label: x.name,
				value: x.id ?? 0,
			})),
		[users]
	);

	return {
		users,
		emailOptions,
		usersOptions,
		isLoading,
		cleanList
	};
};


