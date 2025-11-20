import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { t } from "src/locale/i18n";
import Form from "src/components/form";
import { actions } from "src/core/store";
import routes from "src/config/routes/config";
import { useRegisterDefault } from "src/hooks";
import { fillIfValue } from "src/core/utils/func";
import ScreenTemplate from "src/components/Screen";
import { TPermissions, TProfiles } from "src/core/models/profiles";

import {
	getProfiles,
	addProfiles,
	editProfiles,
} from "src/core/store/modules/profiles/thunks";

import {
	getItemProfiles,
	getStatusProfiles as getStatus,
	getErrorMessageProfiles as getErrorMessage,
} from "src/core/store/modules/profiles/selectors";

import ProfilesPanel from "./profilesPanel";

const sortByRoutes = (permissions: TPermissions[], routes: any, prefix?: string):any => {
	if (routes && routes.length) return routes.map((newRoutes: any) => sortByRoutes(permissions, newRoutes, prefix)).flat(Infinity)
	if (routes && routes.subroutes && routes.subroutes.length) return routes.subroutes.map((newRoutes: any) => sortByRoutes(permissions, newRoutes, prefix === undefined ? routes.path : `${prefix ?? ""}/${routes.path}`)).flat(Infinity)
	const finalPath = prefix === undefined ? routes.path : `${prefix}/${routes.path}`
	const finalPermition = permissions.find((item) => item.name === finalPath)
	return finalPermition 
};

const validate = ({ permissions }: TProfiles) =>
	!permissions.length ? { permissionNames: t("required") } : {};

const ProfilesForm = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();

	const item = useSelector(getItemProfiles);
	const isNew = id === "novo";

	useEffect(() => {
		if (id && !isNew) dispatch(getProfiles(id));
		return () => {
			dispatch(actions.profiles.clear());
		};
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: "profiles",
		getStatus,
		getErrorMessage,
	});

	const onSubmit = ({ permissions, ...values }: TProfiles) => {
		const normalizedValue = {
			...values,
			permissions: permissions.filter(({ view }) => view),
		};
		if (isNew) dispatch(addProfiles(normalizedValue));
		else dispatch(editProfiles({ ...normalizedValue, id: Number(id) }));
	};

	const initialValues: TProfiles = useMemo(() => {
		const initialValues: TProfiles = {
			status: true,
			description: "",
			permissionNames: [],
			permissions: [],
		};
		return fillIfValue<TProfiles>({
			...item, 
			permissions: item.permissions && item.permissions?.length !== 0 ? sortByRoutes([...item.permissions], routes).filter((item: TPermissions) => item) : item.permissions 
		}, initialValues);
	}, [item]);
	
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validate={validate}
				onSubmit={onSubmit}
			>
				{() => <ProfilesPanel />}
			</Form>
		</ScreenTemplate>
	);
};

export default ProfilesForm;
