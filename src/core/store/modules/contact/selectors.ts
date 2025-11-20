
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import { State } from './index'

const toEnum = (obj: Record<string, string>) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Record<string, string>);
}

const state = (state: RootState) => state.contact;

export const getIsFetchingContact = createSelector(
  [state],
  ({ status }) => status === 'fetching',
);

export const getFilterContact = createSelector(
  [state],
  ({ listFilters }: State) => listFilters || {}
);

export const getListContact = createSelector(
  [state],
  ({ list }) => list
);

export const getItemContact = createSelector(
  [state],
  ({ item }) => item
);


export const getContactPhoneTypeAsOptions = createSelector(
  [state],
  (contact) => {
    const enums = contact.enums?.ContactPhoneType || {};
    return Object.entries(enums).map(([value, label]) => ({ value: Number(value), label }));
  }
);

export const getContactTypeAsOptions = createSelector(
  [state],
  (contact) => {
    const enums = contact.enums?.ContactType || {};
    return Object.entries(enums).map(([value, label]) => ({ value: Number(value), label }));
  }
);

export const getContactEmailTypeAsOptions= createSelector(
  [state],
  (contact) => {
    const enums = contact.enums?.ContactEmailType || {};
    return Object.entries(enums).map(([value, label]) => ({ value: Number(value), label }));
  }
);

export const getContactAddressTypeAsOptions = createSelector(
  [state],
  (contact) => {
    const enums = contact.enums?.ContactAddressType || {};
    return Object.entries(enums).map(([value, label]) => ({ value: Number(value), label }));
  }
);

export const contactTypeAsOptions = createSelector(
  [state],
  (contact) => {
    const enums = contact.enums?.ContactType || {};
    return Object.entries(enums).map(([value, label]) => ({ value: Number(value), label }));
  }
);

export const getGenderTypeAsOptions = createSelector(
  [state],
  (contact) => {
    const enums = contact.enums?.ContactGender || {};
    return Object.entries(enums).map(([value, label]) => ({ value: Number(value), label }));
  }
);