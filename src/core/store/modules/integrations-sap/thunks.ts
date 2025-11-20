import { createAsyncThunk } from '@reduxjs/toolkit';
import { TContact, TContactParams} from 'src/core/models/contacts';
import integrationsSapAPI from 'src/core/api/integrations-sap';
import { cpf, cnpj } from 'cpf-cnpj-validator';

const getFormattedAreaCode = (areaCode: string) => {
	if (!areaCode) return '';

	return areaCode.slice(0, 2) + '.' + areaCode.slice(2);
}

const formatCPFOrCNPJ = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue.length <= 11) {
        return cpf.format(cleanedValue);
    } else {
        return cnpj.format(cleanedValue);
    }
};

const getNormalizedContacts = (list: any[]): TContact[] =>
	list.map(({ address, banks, city, ...data }) => ({
		...data,
		email: (data.email && data.email.email) ?? '',
		cpfCnpj: formatCPFOrCNPJ(data.cpfCnpj),
		phone: data.phone?.number ?? '',
		address: address && address.addressLine1,
		addressNumber: address && address.addressNumber,
		neighborhood: address && address.neighborhood,
		areaCode: getFormattedAreaCode(address && address.areaCode),
		cityId: city && city.id > 0 ? city.id : '',
		stateId: city && city.stateId,
	}) as TContact)

export const fetchDataSupplier = createAsyncThunk(
	'integrationsSap/fetchDataSupplier',
	async (params: TContactParams, { rejectWithValue }) => {
		try {
			const response = await integrationsSapAPI.list(params);
			const { items, ...data } = response.data
			return { ...data, items: getNormalizedContacts([data]) };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);