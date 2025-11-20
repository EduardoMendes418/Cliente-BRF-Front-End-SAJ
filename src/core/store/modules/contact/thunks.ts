import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/contact';
import { actions } from '../..';
import { TGetByFilterParams } from 'src/core/models/contact';
import { Contact } from 'src/core/models/contact';

export const fetchContactByFilterList = createAsyncThunk(
	'contacts/fetchByFilter',
	async (params: TGetByFilterParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data?.items || [];
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchContactExportExcel = createAsyncThunk(
  'contacts/exportExcel',
  async (params: TGetByFilterParams, { rejectWithValue }) => {
	try {
	  const response = await api.exportExcel(params);
	  return response.data;
	} catch (err: any) {
	  return rejectWithValue(err.response.data);
	}
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/getById',
  async (id: number, { rejectWithValue }) => {
	try {
	  const response = await api.getContactById(id);
	  return response.data;
	} catch (err: any) {
	  return rejectWithValue(err.response.data);
	}
  }
);

export const createContact = createAsyncThunk(
  'contacts/create',
  async (params: Contact, { rejectWithValue }) => {
	try {
	  const response = await api.createContact(params);
	  return response.data;
	} catch (err: any) {
	  return rejectWithValue(err.response.data);
	}
  }
);

export const editContact = createAsyncThunk(
  'contacts/edit',
  async (params: Contact, { rejectWithValue }) => {
	try {
	  const response = await api.editContact(params);
	  return response.data;
	} catch (err: any) {
	  return rejectWithValue(err.response?.data || err.message);
	}
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id: number, { rejectWithValue }) => {
	try {
	  const response = await api.deleteContact(id);
	  return response.data;
	} catch (err: any) {
	  return rejectWithValue(err.response?.data || err.message);
	}
  }
);

export const fetchContactEnums = createAsyncThunk(
	'contacts/fetchEnums',
	async (_, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.getEnums();
			dispatch(actions.contact.setEnums(response.data));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data || err.message);
		}
	}
);