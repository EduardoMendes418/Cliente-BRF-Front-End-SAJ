import { createSelector } from "@reduxjs/toolkit";
import { TUser, TUserRequest } from "src/core/models/users";
import { RootState } from "src/core/store";
import { isNull } from "src/core/utils/func";
import { State } from "./index";

const state = (state: RootState) => state.users;

const normalizeUser = ({
  usersAdditionalInformation,
  ...item
}: TUserRequest): TUser => ({
  ...(!isNull(usersAdditionalInformation)
    ? usersAdditionalInformation
    : {
        rg: "",
        cpf: "",
        oab: "",
        office: "",
        departament: "",
        location: "",
        phone: "",
        officeName: "",
        dejurArea: [],
        responsibleArea: [],
        isInternal: false,
      }),
  ...item,
});

export const getIsFetchingUsers = createSelector(
	[state],
	({ status }) => status === 'fetching',
);

export const getListUsers = createSelector([state], ({ list }: State) =>
  list.map(normalizeUser)
);

export const getListUsersFromMultiple = (field?: string) => {
	if(field) {
		return createSelector([state], ({ multipleLists }: State) => 
			multipleLists[field]?.map(normalizeUser) ?? []
		);
	}
	
	return getListUsers
}

export const getListUsersActives = createSelector(
  [state],
  ({ listActives }: State) => listActives.map(normalizeUser)
);

export const getListUsersActivesAsOptionsByName = createSelector(
  [getListUsersActives],
  (list) => list.map(({ name }) => ({ label: name, value: name }))
);

export const getListUsersActivesAsOptionsById = createSelector(
  [getListUsersActives],
  (list) =>
    list
      .map(({ name, id }) => ({ label: name, value: Number(id) }))
      .sort(function (a, b) {
        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
      })
      .filter((el) => el.label.length)
);

export const getListUsersActivesAsOptionsByEmail = createSelector(
  [getListUsersActives],
  (list) =>
    list
      .map(({ email }) => ({
        label: email?.toLowerCase(),
        value: email?.toLowerCase(),
      }))
      .filter((item) => item?.value?.length > 0)
      .sort(function (a, b) {
        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
      })
);

export const getListUsersAsOptionsById = createSelector(
  [getListUsers],
  (list) =>
    list
      .map(({ name, id }) => ({ label: name, value: Number(id) }))
      .sort(function (a, b) {
        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
      })
);

export const getListUsersAsOptionsByBrfId = createSelector(
  [getListUsersActives],
  (list) =>
    list
      .map(({ name, idBrf, id }) => ({
        label: name,
        value: Number(idBrf),
        group: Number(id),
      }))
      .sort(function (a, b) {
        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
      })
);

export const getItemUsers = createSelector([state], ({ item }) =>
  normalizeUser(item)
);

export const getStatusUsers = createSelector([state], ({ status }) => status);

export const getLoadingUsers = createSelector(
  [state],
  ({ status }) => status === "fetching"
);

export const getErrorMessageUsers = createSelector(
  [state],
  ({ error }: State): string => error?.detail
);

export const getListFiltersUsers = createSelector(
  [state],
  ({ listFilters }: State) => listFilters
);

export const getListUsersAsOptions = createSelector([state], ({ list }) =>
  list
    .map(({ name, id }) => ({ label: name, value: id ?? 0 }))
    .sort(function (a, b) {
      return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
    })
);
