import { createAction, props } from "@ngrx/store";
import { BoxAndInfo } from "./faces.models";

export const startStream = createAction("[Webcam] Start Stream");
export const stopStream  = createAction("[Webcam] Stop Stream");
export const frameTick   = createAction("[Webcam] Frame Tick");

export const facesDetected = createAction(
  "[Face] Faces Detected",
  props<{ faces: BoxAndInfo[] }>()
);
