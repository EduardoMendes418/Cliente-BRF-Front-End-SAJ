import { useHistory } from "react-router";
import { useCallback, useEffect, useMemo } from "react";
import { useMsal } from "@azure/msal-react";
import { useDispatch, useSelector } from "react-redux";

import { filterRoutesPermissions } from "./func";
import routes from "./routes/config";
import {
	getDataCurrentUser,
	getPermissionsCurrentUser,
	getScreenPermissionsCurrentUser,
} from "src/core/store/modules/currentUser/selectors";
import { fetchUser } from "src/core/store/modules/currentUser/thunks";
import { pathOr, pipe, replace } from "ramda";


type TPerm = {
	add: boolean;
	edit: boolean;
	del: boolean;
	view: boolean;
	check: boolean;
}


export const useCurrentUser = (param: string) => {
	const { accounts } = useMsal();
	const dispatch = useDispatch()
	const history = useHistory()

	const permissions = useSelector(getPermissionsCurrentUser)
	const screenPermissions = useSelector(getScreenPermissionsCurrentUser)
	const { email, id: userId , isAdmin, idBrf} = useSelector(getDataCurrentUser)

	useEffect(() => {
		accounts[0].username !== email && dispatch(fetchUser(accounts[0].username))
	}, [dispatch, accounts, email]);

	const routesWithPermissions = useMemo(
		() => filterRoutesPermissions(screenPermissions)(routes),
		[screenPermissions]
	)
	const getScreenPermissions = useCallback(
		(screen: string): TPerm => {
			const {
				add = false,
				edit = false,
				del = false,
				view = false,
				check = true,
			} = permissions.find(({ name }) => name === screen) ?? {}

			return { add, edit, del, view, check } as TPerm
		}, [permissions]
	)

	const currentScreenPermissions = useMemo(
		() => {
			const removeRE = new RegExp(`(^/)|(/${param}/?$)`, 'g')
			const pathname = pipe(
				pathOr('', ['location', 'pathname']),
				replace(removeRE, ''),
			)(history)

			if (pathname) return getScreenPermissions(pathname)
			return { add: false, edit: false, del: false, view: false, check: false, name: 's' }
		}, [history, getScreenPermissions, param]
	)

	return {
		userId,
		permissions,
		getScreenPermissions,
		routesWithPermissions,
		currentScreenPermissions,
		isAdmin,
		idBrf
	}
}