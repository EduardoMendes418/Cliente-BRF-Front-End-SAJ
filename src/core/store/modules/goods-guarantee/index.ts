import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import { fetchGoodGuarantiesCompanies, fetchGoodsGuaranteesRequestList, fetchNotificationList, updateGoodsGuaranteesStatusFlow, fetchGoodsGuaranteesRequestListSimplify } from './thunks';
import {
	NotificationFilter,
	TGoodsGuaranteesRequest,
	TGoodsGuaranteesRequestFilters,
	TGuaranteesNotification
} from 'src/core/models/goods-guarantee';
import { t } from 'src/locale/i18n';
import {
	addGoodsGuaranteesRequest,
	editGoodsGuaranteesRequest,
	fetchGoodsGuaranteesRequestById
} from './thunks';
import { caseDefault, caseDefaultRegister, clears } from '..';
import { TCustomFieldOption } from 'src/core/models/custom-fields';

export type State = {
	list: TGoodsGuaranteesRequest[];
	listFilters: { [page: string]: TGoodsGuaranteesRequestFilters };
	item: TGoodsGuaranteesRequest;
	redirectUrl: string;
	notificationList: TGuaranteesNotification[];
	notificationStatus: 'initial' | 'fetching' | 'failure';
	notificationFilter?: NotificationFilter
	companies?: TCustomFieldOption[],
	emails: string
};

const initialState: TState & State = {
	status: 'initial',
	error: '',
	list: [] as TGoodsGuaranteesRequest[],
	listFilters: {} as { [page: string]: TGoodsGuaranteesRequestFilters },
	item: {} as TGoodsGuaranteesRequest,
	redirectUrl: '',
	notificationList: [],
	notificationStatus: 'initial',
	emails: ''
};

const slice = createSlice({
	name: 'goodsGuaranteesRequest',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		},

		setEmail(state, { payload }: { payload: string }) {
			state.emails = payload
		},

		setNotificationFilters(state, action: PayloadAction<NotificationFilter>) {
			const oldFilter = state.notificationFilter || {}
			const newFilter = action.payload
			if (oldFilter.userId !== newFilter.userId
				|| oldFilter.page !== newFilter.page
				|| oldFilter.pageSize !== newFilter.pageSize
			)
				state.notificationFilter = action.payload
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchGoodsGuaranteesRequestList)
		caseDefault(addCase, fetchGoodsGuaranteesRequestListSimplify)
		caseDefaultRegister(addCase, addGoodsGuaranteesRequest, 'added')
		caseDefaultRegister(addCase, editGoodsGuaranteesRequest, 'edited')
		caseDefaultRegister(addCase, updateGoodsGuaranteesStatusFlow, 'edited')

		addCase(fetchGoodsGuaranteesRequestById.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(fetchGoodsGuaranteesRequestById.fulfilled, (state, action) => {
			if (action.payload) {
				state.item = action.payload
					? action.payload
					: {};
				state.status = 'initial';
			} else {
				state.status = 'failure';
				state.error = t('goodsAndGuarantees:form.noGoodsAndGuaranteesFound');
			}
		});
		addCase(fetchGoodsGuaranteesRequestById.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload as Error;
			state.redirectUrl = '';
		});

		addCase(fetchNotificationList.pending, (state) => { state.notificationStatus = 'fetching'})
		addCase(fetchNotificationList.fulfilled, (state, action) => {
			state.notificationStatus = 'initial'
			state.notificationList = action.payload.items
		})
		addCase(fetchNotificationList.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload;
		})

		caseDefault(addCase, fetchGoodGuarantiesCompanies, "companies")
	},
});

export default slice;
