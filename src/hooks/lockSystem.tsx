import { modal } from "src/components/modals";
import { LockSystem } from "src/core/models/lock-system";
import { getIsLockSystem, getListIsLockSystem } from "src/core/store/modules/lock-system/selectors";
import { checkLockSystem } from "src/core/store/modules/lock-system/thunks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
	lockSystems: LockSystem[];
};

const ModalComponent = (props: Props) => {
	if (props.lockSystems.length === 0) {
		return <></>;
	}

	const lock = props.lockSystems[0];

	return <>{lock.message}</>;
};

export const useLockSystem = () => {
	const dispatch = useDispatch();
	const lockSystems = useSelector(getListIsLockSystem);
	const lock = useSelector(getIsLockSystem)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		dispatch(checkLockSystem());

		const interval = setInterval(() => {
			dispatch(checkLockSystem());
		}, 600000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (!isOpen && lockSystems && lockSystems.length > 0) {
			setIsOpen(true)
			modal({
				title: "Aviso do sistema",
				component: <ModalComponent lockSystems={lockSystems} />,
				buttons: [],
				onCloseAction() {
					setIsOpen(false)
				},
			})
		}
	}, [lockSystems, isOpen]);

	return {
		lock,
	};
};
