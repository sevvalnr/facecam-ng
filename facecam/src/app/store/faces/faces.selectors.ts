import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FacesState } from "./faces.reducer";

export const selectFacesState = createFeatureSelector<FacesState>("faces");
export const selectActive = createSelector(selectFacesState, s => s.active);
export const selectFaces  = createSelector(selectFacesState, s => s.items);
