import {RootState} from "../../index";
import {createSelector} from "@reduxjs/toolkit";
import {TOptionsSelect} from "../../../../components/form";

const state = (state: RootState) => state.litigationJustice

export const getLitigationJusticeOptions = createSelector(
	[state],
	(state) => state.list.map(x => ({label: x.name, value: x.id} as TOptionsSelect))
)