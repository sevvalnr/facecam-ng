import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FaceService {
  private ready = false;
  private _faceapi?: typeof import('face-api.js');
  private _libPromise?: Promise<typeof import('face-api.js')>;

  private async ensureLib() {
    if (!this._libPromise) {
      this._libPromise = import('face-api.js').then(m => {
        this._faceapi = m;
        return m;
      });
    }
    return this._libPromise;
  }

  async loadModels(base = new URL('models/', document.baseURI).toString()) {
    const faceapi = await this.ensureLib();
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(base),
      faceapi.nets.faceLandmark68Net.loadFromUri(base),
      faceapi.nets.ageGenderNet.loadFromUri(base),
      faceapi.nets.faceExpressionNet.loadFromUri(base),
    ]);
    this.ready = true;
  }

  private assertReady() {
    if (!this.ready) throw new Error('Models not loaded');
  }

  async detect(input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) {
    const faceapi = await this.ensureLib();
    this.assertReady();
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224, 
      scoreThreshold: 0.5 
    });
    const dets = await faceapi
      .detectAllFaces(input, options)
      .withFaceLandmarks()
      .withAgeAndGender()
      .withFaceExpressions();
    return dets;
  }
}
