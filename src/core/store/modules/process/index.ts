import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchProcessFolder,
	fetchProcessFolderPayW,
	fetchIndividual,
	fetchProcessFolders,
	fetchStatisticalOrderCalculate,
	fetchProcessStatisticalOrderCalculate,
	fetchContingencies,
	fetchSpheres,
	fetchStatuses,
	fetchResults,
	fetchClosing,
	fetchSpeciesCategory,
} from './thunks';
import { TOptions, TProcess, TResults } from 'src/core/models/process';
import { TState, TStatus } from 'src/core/models'
import { caseDefault, clears } from '..';

export type State = {
	folder: TProcess;
	list: TProcess[];
	listLoading: TStatus;
	error: string | null;
	contingencies: string[];
	spheres: string[];
	statuses: object;
	results: TResults[],
	closing: TOptions[],
	speciesCategory: TOptions[],
};

const initialState: TState & State = {
	status: 'initial',
	folder: {} as TProcess,
	list: [],
	listLoading: 'initial',
	error: null,
	contingencies: [],
	spheres: [],
	statuses: {},
	results: [],
	closing: [],
	speciesCategory: [],
};

const slice = createSlice({
	name: 'process',
	initialState,
	reducers: {
		...clears(initialState),
		setProcess(state, action) {
			state.folder = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		addCase(fetchProcessFolder.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(fetchProcessFolder.fulfilled, (state, action) => {
			state.folder = action.payload;
			state.status = 'initial';
			state.error = '';
		});
		addCase(fetchProcessFolder.rejected, (state, action) => {
			state.folder = {} as TProcess;
			state.status = 'initial';
			state.error = action.payload as string;
		});
		addCase(fetchProcessFolderPayW.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(fetchProcessFolderPayW.fulfilled, (state, action) => {
			state.folder = action.payload;
			state.status = 'initial';
			state.error = '';
		});
		addCase(fetchProcessFolderPayW.rejected, (state, action) => {
			state.folder = {} as TProcess;
			state.status = 'initial';
			state.error = action.payload as string;
		});

		addCase(fetchProcessFolders.pending, (state) => {
			state.listLoading = 'fetching';
		});
		addCase(fetchProcessFolders.fulfilled, (state, action) => {
			state.list = action.payload.items;
			state.listLoading = 'initial';
		});
		addCase(fetchProcessFolders.rejected, (state) => {
			state.list = [];
			state.listLoading = 'initial';
		});

		addCase(fetchProcessStatisticalOrderCalculate.pending, (state) => {
			state.listLoading = 'fetching';
		});

		addCase(fetchProcessStatisticalOrderCalculate.fulfilled, (state, action: PayloadAction<any>) => {
			state.list = action.payload.items;
			state.listLoading = 'initial';
		});

		addCase(fetchProcessStatisticalOrderCalculate.rejected, (state) => {
			state.list = [];
			state.listLoading = 'initial';
		});

		addCase(fetchStatisticalOrderCalculate.pending, (state) => {
			state.status = 'fetching';
		});

		addCase(fetchStatisticalOrderCalculate.fulfilled, (state, action) => {
			state.folder = action.payload;
			state.status = 'initial';
			state.error = '';
		});

		addCase(fetchStatisticalOrderCalculate.rejected, (state, action) => {
			state.folder = {} as TProcess;
			state.status = 'initial';
			state.error = action.payload as string;
		});

		caseDefault(addCase, fetchIndividual, (state, action) => {
			const index = state.folder.processParties?.findIndex(
				(individual: any) => individual.position?.toUpperCase() === 'RECLAMANTE'
			);
			if (index >= 0) {
				state.folder.processParties[index] = {
					...state.folder.processParties[index],
					...action.payload.items?.[0],
				};
			}
			state.folder.individual = action.payload.items[0];
			state.status = 'initial';
		})

		caseDefault(addCase, fetchContingencies, 'contingencies')

		caseDefault(addCase, fetchSpheres, 'spheres')

		caseDefault(addCase, fetchStatuses, 'statuses')

		caseDefault(addCase, fetchResults, 'results')

		caseDefault(addCase, fetchClosing, 'closing')

		caseDefault(addCase, fetchSpeciesCategory, 'speciesCategory')
	},
});

export default slice;
