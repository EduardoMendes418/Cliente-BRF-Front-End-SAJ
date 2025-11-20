import { createSelector } from "@reduxjs/toolkit";
import { TOptionsSelect } from "src/components/form";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementResponsible;

export const getListOfficeManagementResponsible = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getStatusOfficeManagementResponsible = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementResponsible = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementResponsible = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getItemOfficeManagementResponsible = createSelector(
  [state],
  (state) => state.item
);

export const getListFiltersOfficeManagementResponsible = createSelector(
  [state],
  ({ listFilters }) => listFilters
);

export const getOfficeManagementResponsibleAsOptions = createSelector(
  [state],
  ({ list }) => {
    const options: TOptionsSelect[] = [];

    list.forEach((el) => {
      if (el.isActive) {
        options.push({
          label: el.name!,
          value: el.id!,
        } as TOptionsSelect);
      }
    });

    return options;
  }
);
