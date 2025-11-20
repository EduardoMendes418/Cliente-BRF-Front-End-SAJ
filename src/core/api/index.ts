import * as queryString from 'query-string'
import axios, { AxiosError } from 'axios';
import { identity, pathOr } from 'ramda'

import { getIdToken } from '../utils/func';
import { msalInstance } from 'src/config/auth';
import { reduceRoute } from 'src/config/func';

const defaultConfig = {
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${getIdToken()}`
	},
	paramsSerializer: (params: Record<string, any>) => queryString.stringify(params),
}

export const apimConfig = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getIdToken()}`,
        'Ocp-Apim-Subscription-Key': import.meta.env.REACT_APP_APIM_KEY,
    }
};

export const paymentsInstance = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_PAYMENTS,
});

export const processProgressInstance = axios.create({
	...apimConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_PROCESS_PROGRESS,
});


export const ordersInstance = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_ORDERS,
});

export const integrationInstance = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_INTEGRATION
})

export const tablesInstance = axios.create({
	...apimConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_TABLES
})

export const processInstance = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_PROCESS,
})

export const processSheetInstance = axios.create({
    ...apimConfig,
    baseURL: import.meta.env.REACT_APP_BASE_URL_PROCESS_APIM,
})


export const contactInstance = axios.create({
	...apimConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_CONTACT,
})

export const formProcessInstance = axios.create({
	...apimConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_FORM_PROCESS,
})

export const formAppointmentsInstance = axios.create({
	...apimConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_APPOINTMENTS_APIM,

})

export const gedInstance = axios.create({
	...apimConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_GED,
});

import { InternalAxiosRequestConfig } from 'axios';

const updateHeaders = (token: string = '') => (config: InternalAxiosRequestConfig) => {
	
	config.headers.set('Authorization', `Bearer ${token || getIdToken()}`);
	config.headers.set('PermissionScope', reduceRoute('path', window.location.pathname.split('/').filter(v => v)).join('/'));
	if ("/pagamentos/solicitacao-imposto/novo" === window.location.pathname){
		config.headers.set('PermissionScope', "pagamentos/solicitacao");
	}
	if ("/pagamentos/solicitacao-imposto/novo" === window.location.pathname){
		config.headers.PermissionScope = "pagamentos/solicitacao"
	}
	return config
}

const retryIfInvalidToken = (error: AxiosError) => {

	if (pathOr(null, ['response', 'status'], error) === 401) {
		const account = msalInstance.getAllAccounts()[0] ?? {}
		return msalInstance.acquireTokenSilent({ scopes: [], account })
			.then(({ idToken }) => {
				if (error.config) {
					return paymentsInstance.request(updateHeaders(idToken)(error.config));
				}
				return Promise.reject(error);
			})
	}

	return Promise.reject(error);
}

paymentsInstance.interceptors.request.use(updateHeaders())
ordersInstance.interceptors.request.use(updateHeaders())
integrationInstance.interceptors.request.use(updateHeaders())
processProgressInstance.interceptors.request.use(updateHeaders())
formAppointmentsInstance.interceptors.request.use(updateHeaders())
processInstance.interceptors.request.use(updateHeaders())
processSheetInstance.interceptors.request.use(updateHeaders())
contactInstance.interceptors.request.use(updateHeaders())
formProcessInstance.interceptors.request.use(updateHeaders())
tablesInstance.interceptors.request.use(updateHeaders())
gedInstance.interceptors.request.use(updateHeaders());



paymentsInstance.interceptors.response.use(identity, retryIfInvalidToken)
ordersInstance.interceptors.response.use(identity, retryIfInvalidToken)
integrationInstance.interceptors.response.use(identity, retryIfInvalidToken)
processProgressInstance.interceptors.request.use(identity, retryIfInvalidToken)
contactInstance.interceptors.response.use(identity, retryIfInvalidToken)
formProcessInstance.interceptors.response.use(identity, retryIfInvalidToken)
formAppointmentsInstance.interceptors.response.use(identity, retryIfInvalidToken)
processInstance.interceptors.response.use(identity, retryIfInvalidToken)
processSheetInstance.interceptors.response.use(identity, retryIfInvalidToken)
tablesInstance.interceptors.response.use(identity, retryIfInvalidToken)
gedInstance.interceptors.response.use(identity, retryIfInvalidToken);


export const paymentsInstanceDev = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_PAYMENTS_DEV,
})

export const paymentsInstanceQas = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_PAYMENTS_QAS,
})

export const paymentsInstancePrd = axios.create({
	...defaultConfig,
	baseURL: import.meta.env.REACT_APP_BASE_URL_PAYMENTS_PRD,
})

paymentsInstanceDev.interceptors.request.use(updateHeaders())
paymentsInstanceQas.interceptors.request.use(updateHeaders())
paymentsInstancePrd.interceptors.request.use(updateHeaders())

paymentsInstanceDev.interceptors.response.use(identity, retryIfInvalidToken)
paymentsInstanceQas.interceptors.response.use(identity, retryIfInvalidToken)
paymentsInstancePrd.interceptors.response.use(identity, retryIfInvalidToken)