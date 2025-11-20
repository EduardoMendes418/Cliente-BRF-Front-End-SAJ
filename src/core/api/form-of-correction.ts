import { paymentsInstance } from '.';
import { TFormOfCorrection } from 'src/core/models/pensions';

const BASE_URL = 'FormaCorrecao'

const formOfCorrectionAPI = {
	list() {
		return paymentsInstance.get(BASE_URL);
	},

	add(value: TFormOfCorrection) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(value));
	},

	edit(values: TFormOfCorrection) {
		return paymentsInstance.put(`${BASE_URL}/${values.id}`, JSON.stringify(values));
	},

	delete(id: string) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	},
};

export default formOfCorrectionAPI;
