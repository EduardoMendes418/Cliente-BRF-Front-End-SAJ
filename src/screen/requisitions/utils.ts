import { toNumber } from "src/core/utils/func";
import { STATUS } from "./constants";

type TUsersActives = {
	label: string;
	value: number;
};

export const handleAdministrativeControl = (
	status: STATUS,
	userIds: number[] | undefined,
	serviceUser: string[] | undefined,
	usersActives: TUsersActives[],
	separator: string
) => {
	let administrativeTeam: string = "";

	if (
		status === STATUS.APPROVED_DEFINITIVE ||
		status === STATUS.REJECTED_DEFINITIVE
	) {
		administrativeTeam = serviceUser?.join(` ${separator} `) ?? ""

		return administrativeTeam
	} else {
		usersActives?.forEach((user) => {
			if (userIds) {
				userIds.forEach((id) => {
					if (toNumber(user.value) === toNumber(id)) {
						administrativeTeam =
							administrativeTeam + `${user.label.toUpperCase()} ${separator} `;
					}
				});
			}
		});
	}

	return administrativeTeam.substring(0, administrativeTeam.length - 3);
};
