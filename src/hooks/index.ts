import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";

import { t } from "src/locale/i18n";
import { actions } from "src/core/store";
import { TStatus } from "src/core/models";

export const useHandleRequestError = () => {
	const { enqueueSnackbar } = useSnackbar();
	/* eslint-disable no-console */

	const showRequestError = useCallback(
		(error: string | undefined, callback?: Function) => {
			const errorMessage =
				error && typeof error === "string" ? error : t("anErrorHasOcurred");
			const normalizedErrorMessage =
				errorMessage.length > 200
					? `${errorMessage.slice(0, 200)}...`
					: errorMessage;
			!error?.hasOwnProperty('error') && enqueueSnackbar(normalizedErrorMessage, { variant: "error" });
			if (callback) callback();
		},
		[enqueueSnackbar]
	);

	return { showRequestError };
};

type RegisterDefaultProps = {
	action: string;
	route?: string | "noRedirect";
	getStatus?: any;
	getErrorMessage?: any;
	updateInListCallback?: () => void;
	isMultilevel?: boolean;
};

export const useRegisterDefault = ({
	route,
	getStatus,
	getErrorMessage,
	action,
	updateInListCallback,
	isMultilevel = false
}: RegisterDefaultProps) => {
	const [isSaving, setIsSaving] = useState(false);
	const history = useHistory();

	const defaultRoute = useMemo(() => {
		const defaultPath = history.location.pathname.split("/");
		defaultPath.pop();
		return defaultPath.join("/");
	}, [history.location.pathname]);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { showRequestError } = useHandleRequestError();

	const status = useSelector(getStatus) as TStatus;
	const error = useSelector(getErrorMessage) as string | undefined;

	useEffect(() => {
		if (["added", "edited", "deleted"].includes(status)) {
			enqueueSnackbar(
				status === "deleted" ? t("registerDeleted") : t("registerSuccess"),
				{ variant: "success" }
			);
			if (route && route !== "noRedirect")
				history.push(route);
			else if (route === undefined)
				history.push(defaultRoute);
			if (!isMultilevel)
				dispatch(actions[action].clearStatus());
		} else if (status === "failure") {
			if (!isMultilevel && error){
			showRequestError(error, () => dispatch(actions[action].clearStatus()));
			}
		}

		if (
			updateInListCallback &&
			isSaving &&
			["edited", "failure", "deleted"].includes(status)
		) {
			updateInListCallback();
		}
	}, [
		error,
		route,
		status,
		history,
		dispatch,
		enqueueSnackbar,
		showRequestError,
		action,
		defaultRoute,
		updateInListCallback,
		isSaving,
		isMultilevel
	]);

	useEffect(() => {
		setIsSaving(status === "saving");
	}, [status]);
};
