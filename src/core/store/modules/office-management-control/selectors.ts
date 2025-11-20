import { createSelector } from "@reduxjs/toolkit";
import { TOptionsSelect } from "src/components/form";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementControl;

export const getListOfficeManagementControl = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getStatusOfficeManagementControl = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementControl = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementControl = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getItemOfficeManagementControl = createSelector(
  [state],
  (state) => state.item
);

export const getListFiltersOfficeManagementControl = createSelector(
  [state],
  ({ listFilters }) => listFilters
);

export const getOfficeManagementControlAsOptions = createSelector(
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
