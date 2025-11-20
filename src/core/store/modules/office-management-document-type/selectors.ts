import { createSelector } from "@reduxjs/toolkit";
import { TOptionsSelect } from "src/components/form";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementDocumentType;

export const getListOfficeManagementDocumentType = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getStatusOfficeManagementDocumentType = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementDocumentType = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementDocumentType = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getOfficeManagementDocumentTypeIsFetching = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getItemOfficeManagementDocumentType = createSelector(
  [state],
  (state) => state.item
);

export const getOfficeManagementDocumentTypeAsOptions = createSelector(
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

export const getListFiltersOfficeManagementDocumentType = createSelector(
  [state],
  ({ listFilters }) => listFilters
);
