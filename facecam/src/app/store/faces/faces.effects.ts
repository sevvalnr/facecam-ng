import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as FaceActions from "./faces.actions";
import { FaceService } from "../../core/face.service";
import { map, switchMap, takeUntil, throttleTime } from "rxjs/operators";
import { interval, merge, Subject } from "rxjs";

@Injectable()
export class FacesEffects {
  private videoEl?: HTMLVideoElement;
  private stop$ = new Subject<void>();
  private face = inject(FaceService);
  private actions$ = inject(Actions);

  setVideo(el: HTMLVideoElement) { this.videoEl = el; }

  detect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FaceActions.startStream),
      switchMap(() =>
        interval(200).pipe( // ~5 FPS
          throttleTime(100),
          map(() => FaceActions.frameTick()),
          takeUntil(merge(this.actions$.pipe(ofType(FaceActions.stopStream)), this.stop$))
        )
      )
    )
  );

  onFrame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FaceActions.frameTick),
      switchMap(async () => {
        if (!this.videoEl) return FaceActions.facesDetected({ faces: [] });
        const dets = await this.face.detect(this.videoEl);
        const faces = dets.map((d, idx) => ({
          id: String(idx),
          box: d.detection.box,
          age: d.age ? Math.round(d.age) : undefined,
          gender: d.gender,
          expressions: { ...d.expressions } as { [key: string]: number }
        }));
        return FaceActions.facesDetected({ faces });
      })
    )
  );
}
