import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CameraService {
  private stream?: MediaStream;

  async start(
    videoEl: HTMLVideoElement,
    constraints: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false }
  ) {
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = this.stream;
    await videoEl.play();
  }

  stop() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = undefined;
  }
}
