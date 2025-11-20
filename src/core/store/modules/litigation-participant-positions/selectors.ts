import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../index";

const state = (state: RootState) => state.litigationParticipantPositions

export const getLitigationParticipantPositions = createSelector(
	[state],
	(state) => state.list ?? []
)