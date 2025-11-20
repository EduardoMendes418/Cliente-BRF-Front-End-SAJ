import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "src/core/store";

import { getListPaymentMethod } from "src/core/store/modules/payment-method/selectors";
import { TPaymentType } from "src/core/models/payment-type";
import { TOptionsSelect } from "src/components/form";

const state = (state: RootState) => state.paymentType;

export const getListPaymentType = createSelector(
  	[state],
  	(state) => state.list
);

export const getListFiltersPaymentType = createSelector(
  [state],
  ({ listFilters }) => listFilters
);

export const getItemPaymentType = createSelector(
  [state],
  (state) => state.item
);

export const getStatusPaymentType = createSelector(
  [state],
  (state) => state.status
);

export const getLoadingPaymentType = createSelector(
  [state],
  (state) => state.status === "fetching"
);

export const getSavingPaymentType = createSelector(
  [state],
  (state) => state.status === "saving"
);

export const getErrorMessagePaymentType = createSelector(
  [state],
  (state) => state.error
);

type FormsByType = {
  [typeID: number]: {
    label: string;
    value: number;
  }[];
};

export const getFormsOfPaymentByPaymentTypeAsOption = createSelector(
  [getListPaymentType, getListPaymentMethod],
  (paymentTypeList, paymentMethodList) => {
    const formasByTipo: FormsByType = {};
    paymentTypeList.forEach((paymentType) => {
      const formas: {
        label: string;
        value: number;
      }[] = [];
      if (paymentType.formasPagamentoIds) {
        paymentType.formasPagamentoIds.forEach((formaPagamentoID) => {
          const index = paymentMethodList.findIndex(
            (paymentMethod) => paymentMethod.id === formaPagamentoID
          );
          if (index > -1) {
            formas.push({
              label: paymentMethodList[index].descricao,
              value: paymentMethodList[index].id ?? -1,
            });
          }
        });
        if (paymentType.id) formasByTipo[paymentType.id] = formas;
      }
    });
    return formasByTipo;
  }
);

export const getListAsOptionPaymentType = createSelector(
  [getListPaymentType],
  (list) => {
    return list.reduce(
      (acc, { id, financeChartOfAccountsCategory, status }) => {
        if (id && status)
          acc.push({
            label: financeChartOfAccountsCategory?.name ?? "",
            value: id,
          });
        return acc;
      },
      [] as TOptionsSelect[]
    );
  }
);

export const getListAsOptionPaymentTypeAllStatus = createSelector(
  [getListPaymentType],
  (list) => {
    return list.reduce(
      (acc, { id, financeChartOfAccountsCategory }) => {
        if (id)
          acc.push({
            label: financeChartOfAccountsCategory?.name ?? "",
            value: id,
          });
        return acc;
      },
      [] as TOptionsSelect[]
    );
  }
);

export const getPaymentTypeWithExceptionRulesAsOptions = createSelector(
  [getListPaymentType],
  (list) => {
    return list.reduce(
      (acc, { id, status, exceptionRules, financeChartOfAccountsCategory }) => {
        if (id && status && exceptionRules.length)
          acc.push({
            label: financeChartOfAccountsCategory?.name ?? "",
            value: id,
          });

        return acc;
      },
      [] as TOptionsSelect[]
    );
  }
);

export const getPaymentTypeByID = createSelector(
  [getListPaymentType],
  (list) => {
    const a: {
      [key: number]: TPaymentType;
    } = {};

    list.forEach((item) => {
      if (!item.id) return;
      a[item.id] = item;
    });

    return a;
  }
);
