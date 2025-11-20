import { createSelector } from "@reduxjs/toolkit";
import { TOptionsSelect } from "src/components/form";
import { RootState } from "src/core/store";
import { TError } from "./index";

const state = (state: RootState) => state.officeManagementInvoice;

export const getListOfficeManagementInvoice = createSelector(
  [state],
  (state) => state.list ?? []
);

export const getStatusOfficeManagementInvoice = createSelector(
  [state],
  (state) => state.status
);

export const getErrorMessageOfficeManagementInvoice = createSelector(
  [state],
  ({ error }) => error as TError
);

export const getLoadingOfficeManagementInvoice = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getItemOfficeManagementInvoice = createSelector(
  [state],
  (state) => state.item
);

export const getListFiltersOfficeManagementInvoice = createSelector(
  [state],
  ({ listFilters }) => listFilters
);

export const getOfficeManagementInvoiceAsOptions = createSelector(
  [state],
  ({ list }) => {
    const options: TOptionsSelect[] = [];

    list.forEach((el) => {
      if (el.isActive) {
        options.push({
          label: el.description!,
          value: el.id!,
          group: el.areaId?.toString() ?? 0,
        } as TOptionsSelect);
      }
    });

    return options;
  }
);
