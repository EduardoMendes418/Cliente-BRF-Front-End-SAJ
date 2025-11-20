import { FC, ComponentType } from "react";
import { Route, Switch } from "react-router-dom";
import { joinPaths } from "src/core/utils/func";
import { useCurrentUser } from "src/config/permissions";
interface ComponentRoute {
	path: string;
	component?: ComponentType<any> | ComponentType<any>[];
	subroutes?: Subroute[];
}

interface Subroute {
	path: string;
	component?: ComponentType<any> | ComponentType<any>[];
	subroutes?: Subroute[];
}

const addId = (idx: number): string => (idx === 0 ? ":id" : "");

const mountRoutes = (routes: ComponentRoute[]): JSX.Element[] => {
	return [...routes.slice(1), routes[0]]
		.filter(Boolean)
		.reduce<JSX.Element[]>((acc, { path, component, subroutes = [] }, idx) => {
			const deepSubroutes = (subroutes: Subroute[], basePath = ""): void => {
				subroutes.forEach((subroute, idx2) => {
					if (subroute.subroutes)
						deepSubroutes(subroute.subroutes, subroute.path);

					if (Array.isArray(subroute.component)) {
						subroute.component.forEach((component, idx3) => {
							acc.push(
								<Route
									path={joinPaths([path, basePath, subroute.path, addId(idx3)])}
									component={component}
									key={`subroute-${idx}-${idx2}-${idx3}`}
									exact
								/>
							);
						});
					} else if (subroute.component) {
						acc.push(
							<Route
								path={joinPaths([path, basePath, subroute.path])}
								component={subroute.component}
								key={`subroute-${idx}-${idx2}`}
								exact
							/>
						);
					}
				});
			};

			deepSubroutes(subroutes);

			if (component) {
				if (Array.isArray(component)) {
					component.forEach((item, subIdx) => {
						acc.push(
							<Route
								path={joinPaths([path, addId(subIdx)])}
								component={item}
								key={`route-${idx}-${subIdx}`}
								exact
							/>
						);
					});
				} else {
					acc.push(
						<Route
							path={joinPaths([path])}
							component={component}
							key={`route-${idx}`}
							exact
						/>
					);
				}
			}

			return acc;
		}, []);
};

export const SwitchRouter: FC = () => {
	const { routesWithPermissions } = useCurrentUser("");

	return (
		<Switch>{mountRoutes(routesWithPermissions as ComponentRoute[])}</Switch>
	);
};

