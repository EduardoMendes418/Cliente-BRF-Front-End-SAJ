import { TState, TStatus } from 'src/core/models'
import { TDataImportFeedbackLineError } from 'src/core/models/data-import';

type Tcallback = string
	| { [key: string]: string }
	| ((state: any, action: any) => void)

export const caseDefault = (
	addCase: any,
	thunksName: any,
	callback: Tcallback = { list: 'items' }
) => {
	addCase(thunksName.pending, (state: TState) => {
		state.status = 'fetching';
	});

	addCase(thunksName.fulfilled, (state: any, action: any) => {
		if (typeof callback === 'string') state[callback] = action.payload
		else if (typeof callback === 'function') callback(state, action)
		else Object.keys(callback).forEach(key => { state[key] = action.payload[callback[key]] })
		state.status = 'initial';
	});

	addCase(thunksName.rejected, (state: TState, action: any) => {
		state.status = 'failure';
		state.error = action.payload;
	});
}

export const caseDefaultRegister = (
	addCase: any,
	thunksName: any,
	status: TStatus,
	callback?: (state: any, action: any) => void
) => {
	addCase(thunksName.pending, (state: TState) => {
		state.status = 'saving';
	});

	addCase(thunksName.fulfilled, (state: any, action: any) => {
		state.status = status;
		if (callback) callback(state, action)
	});

	addCase(thunksName.rejected, (state: TState, action: any) => {
		state.status = 'failure';
		state.error = action.payload;
	});
}

export const caseDefaultImport = (
	addCase: any,
	thunksName: any,
	insertSuccessResultInLineErrors: boolean = false
) => {
	addCase(thunksName.pending, (state: TState) => {
		state.status = 'saving';
	});

	addCase(thunksName.fulfilled, (state: any, action: any) => {
		state.status = 'imported';
		state.lineErrorsFeedback = insertSuccessResultInLineErrors ? action.payload?.logs : undefined;
	});

	addCase(thunksName.rejected, (state: TState & { lineErrorsFeedback: TDataImportFeedbackLineError[] }, action: any) => {
		state.status = 'failure';

		state.lineErrorsFeedback = action.payload?.logs;
		state.error = action.payload?.logs?.length > 0 ? undefined : action.payload;
	});
}

export const combineCases = (casesFetch: any[][] = [], casesRegister: any[][] = []) => ({ addCase }: any) => {
	casesFetch.forEach(element => caseDefault(addCase, element[0], element[1]));
	casesRegister.forEach(element => caseDefaultRegister(addCase, element[0], element[1]));
}

export const clears = (initialState: any) => ({
	clear: (state: any) => {
		Object.keys(state).forEach(key => {
			if (!['listFilters', 'filters'].includes(key)) {
				state[key] = initialState[key]
			}
		})
	},

	clearFilters: (state: any, { payload }: { payload: string }) => {
		Object.keys(state).forEach(key => {
			if (['listFilters', 'filters'].includes(key)) {
				if (payload) state[key][payload] = initialState[key]
				else state[key] = initialState[key]
			}
		})
	},

	clearStatus: (state: any) => {
		state.status = 'initial';
		state.error = '';
	},
})
