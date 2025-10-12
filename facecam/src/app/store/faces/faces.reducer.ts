import { createReducer, on } from "@ngrx/store";
import * as FaceActions from "./faces.actions";
import { BoxAndInfo } from "./faces.models";

export interface FacesState {
  active: boolean;
  items: BoxAndInfo[];
}

const initialState: FacesState = { active: false, items: [] };

export const facesReducer = createReducer(
  initialState,
  on(FaceActions.startStream, (s) => ({ ...s, active: true })),
  on(FaceActions.stopStream,  (s) => ({ ...s, active: false, items: [] })),
  on(FaceActions.facesDetected, (s, { faces }) => ({ ...s, items: faces }))
);
