import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import contactsApi from 'src/core/api/contacts';
import { TContact, TContactParams, TContactWithLikeAndCpfWithoutIncludes, TContactWithLikeParams, TContactWithLikeWithoutIncludes, TContactWithoutIncludes } from 'src/core/models/contacts';
import { CONTACT_SEARCH } from 'src/core/utils/constants';
import { RootState, actions } from '../..';
import { getAxiosError } from 'src/core/utils/func';
import { TPagination } from 'src/core/models/pagination';

const getFormattedAreaCode = (areaCode: string) => {
	if (!areaCode) return '';

	return areaCode.slice(0, 2) + '.' + areaCode.slice(2);
}

const getNormalizedContacts = (list: any[]): TContact[] =>
	list.map(({ address, banks, city, ...data }) => ({
		...data,
		email: (data.email && data.email.email) ?? '',
		phone: data.phone?.number ?? '',
		address: address && address.addressLine1,
		addressNumber: address && address.addressNumber,
		neighborhood: address && address.neighborhood,
		areaCode: getFormattedAreaCode(address && address.areaCode),
		cityId: city && city.id > 0 ? city.id : '',
		stateId: city && city.state && city.state.id > 0 ? city.state.id : '',
	}) as TContact)

export const fetchContacts = createAsyncThunk(
	'contacts/fetchContacts',
	async (params: TContactParams, { rejectWithValue }) => {
		try {
			const response = await contactsApi.list(params);
			const { items, ...data } = response.data
			return { ...data, items: getNormalizedContacts(items) };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchContactsWithLike = createAsyncThunk(
	'contacts/fetchContactsWithLike',
	async (params: TContactWithLikeParams, { rejectWithValue }) => {
		try {
			const response = await contactsApi.listLike(params);
			const { items, ...data } = response.data
			return { ...data, items: getNormalizedContacts(items) };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchContactsWithLikeWithoutIncludes = createAsyncThunk(
	'contacts/fetchContactsWithLikeWithoutIncludes',
	async ({ field, type, ...params }: TContactWithLikeWithoutIncludes & { field?: string, type?: CONTACT_SEARCH }, { rejectWithValue, getState }) => {
		try {
			const { contacts: { multipleList } } = getState() as RootState;

			if (multipleList && field && multipleList[field]) {
				const item = multipleList[field].find(({ id }) => id === params.id)
				if (item) return { items: [item], field };
			}
			
			let response: AxiosResponse<object, unknown>;  

			if(type !== CONTACT_SEARCH.OfficeResponsible) delete params["responsibleAreaIds"]; 

			switch(type) {
				case CONTACT_SEARCH.Agent:
					response = await contactsApi.listLikeAgent(params); // remover responsibleAreaIds
					break;
				case CONTACT_SEARCH.InternalLawyer:
					response = await contactsApi.listLikeInternalLawyer(params); // remover responsibleAreaIds
					break;
				case CONTACT_SEARCH.LegalResponsible:
					response = await contactsApi.listLikeLegalResponsible(params); // remover responsibleAreaIds
					break;
				case CONTACT_SEARCH.OfficeResponsible:
					response = await contactsApi.listLikeOfficeResponsible(params); // OK
				break;
					default:
					response = await contactsApi.listLikeWithoutIncludes({ ...params, notPaginate: true });
			}

			const { data } = response;

			const formattedResponse = {
				items: data,
				page: 0,
				itemCount: 34,
				itemsPerPage: 30,
				pageCount: 2
			};

			return { ...type !== undefined ? formattedResponse : data, field };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchLikeAndCpfWithoutIncludes = createAsyncThunk(
	"contatcs/fetchLikeAndCpfWithoutIncludes",
	async (params: TContactWithLikeAndCpfWithoutIncludes, { rejectWithValue, dispatch }) => {
		try {
			const response = await contactsApi.listLikeAndCpfWithoutIncludes(params)

			const data = response.data as TPagination<TContactWithoutIncludes>

			dispatch(actions.pagination.setPageCount(data.pageCount));
			dispatch(actions.pagination.setItemCount(data.itemCount));

			return data.items
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data)
		}
	}
);

export const SendServiceBusByIds = createAsyncThunk(
	'contacts/SendServiceBusByIds',
	async (params: any, { rejectWithValue }) => {
			const response = await contactsApi.sendServiceBus(params);
			return response.data	
	}
);