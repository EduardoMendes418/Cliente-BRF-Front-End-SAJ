import routes, { TRoutes } from 'src/config/routes/config'
import { TPermissions } from 'src/core/models/profiles';

import { assocPath, pathOr, pipe, prop, reduce } from 'ramda';

export const filterRoutesPermissions = (permissions: any) => (routes: TRoutes[], path: string[] = []) =>
	routes.reduce((acc, current) => {
		if (current.path === '' && !path.length) acc.push(current)
		else {
			const accPath = [...path, current.path]
			if (pathOr(false, accPath, permissions)) {
				if (current.subroutes) {
					acc.push({ ...current, subroutes: filterRoutesPermissions(permissions)(current.subroutes, accPath) })
				} else {
					acc.push(current)
				}
			}
		}
		return acc
	}, [] as TRoutes[])

export const permissionsScreens = reduce<TPermissions, any>((acc, { name, view }) => view
	? assocPath(name.split('/').filter((v: string) => v), true, acc)
	: acc, {})

export const reduceRoute = (name: string, paths: string[], routesCustom?: TRoutes[]) => pipe(
	reduce((acc, item) => {
		const menu = acc.routes.find(({ path }) => path === item)
		if (menu && (menu as any)[name]) {
			if (menu.subroutes) acc.routes = menu.subroutes
			else acc.routes = []
			// @ts-ignore
			acc.acc.push(prop(name, menu))
		}
		return acc
	}, { routes: routesCustom ?? routes, acc: [] as string[] }),
	prop('acc')
)(paths)
