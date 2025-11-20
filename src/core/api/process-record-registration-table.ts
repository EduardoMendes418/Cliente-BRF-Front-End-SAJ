import { tablesInstance } from '.';
import { TCreateProcessRecordRegistration, TGetTableAttributes, TSearchTableProcessRecordRegistration } from '../models/process-record-registration-table';

const BASE_URL = 'ProcessRegistrationTable';

const processRecordRegistrationAPI = {
    listGrid({ page, pageSize, ...params }: TSearchTableProcessRecordRegistration) {
        return tablesInstance.post(
            `${BASE_URL}/grid-list`,
            { ...params },
            { params: { page, pageSize } }
        );
    },

    listById(id: number | Record<string, any>) {
        const formattedId = typeof id === 'object'
            ? Number(Object.values(id).map(Number).join(''))
            : Number(id);
            
        return tablesInstance.get(`${BASE_URL}/get-by-id-with-includes?id=${Number(formattedId)}`);
    },

    listByTableAttributes({ ...params }: TGetTableAttributes) {
        return tablesInstance.post(`${BASE_URL}/get-by-table-attributes`, { ...params });
    },

    listByTableAttributesWithLike({ ...params }: TGetTableAttributes) {
        return tablesInstance.post(`${BASE_URL}/get-by-table-attributes`, { ...params });
    },

    create(values: TCreateProcessRecordRegistration) {
        return tablesInstance.post(`${BASE_URL}/create`, JSON.stringify(values));
    },

    update(values: TCreateProcessRecordRegistration) {
        return tablesInstance.put(`${BASE_URL}/update`, JSON.stringify(values));
    },

    delete(id: number | Record<string, any>) {
        const formattedId = typeof id === 'object'
            ? Number(Object.values(id).map(Number).join(''))
            : Number(id);
        return tablesInstance.delete(`${BASE_URL}/delete?id=${Number(formattedId)}`);
    }
};

export default processRecordRegistrationAPI;