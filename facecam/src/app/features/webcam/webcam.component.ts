import { Component, ViewChild, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraService } from '../../core/camera.service';
import { FaceService } from '../../core/face.service';
import { Store } from '@ngrx/store';
import * as FaceActions from '../../store/faces/faces.actions';
import { selectFaces } from '../../store/faces/faces.selectors';
import { FacesEffects } from '../../store/faces/faces.effects';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';   // ✅ tek seferlik okumak için

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit, OnDestroy {
  uploadedImgSrc: string | null = null;
  uploadedFaces: any[] | null = null;
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('uploadedImg') uploadedImgRef!: ElementRef<HTMLImageElement>;
  @ViewChild('uploadedOverlay') uploadedOverlayRef!: ElementRef<HTMLCanvasElement>;

  private camera = inject(CameraService);
  private face = inject(FaceService);
  private store = inject(Store);
  private effects = inject(FacesEffects);

  faces$ = this.store.select(selectFaces);
  private drawSub?: Subscription;

  async ngOnInit() {
    await this.face.loadModels(); // Ensure models are loaded for both webcam and upload
    this.effects.setVideo(this.videoRef.nativeElement);
    this.drawSub = interval(200).subscribe(() => this.drawOverlay());
  }

  ngOnDestroy(): void {
    this.drawSub?.unsubscribe();
  }

  async onStart() {
    await this.face.loadModels();
    await this.camera.start(this.videoRef.nativeElement, { video: { facingMode: 'user' }, audio: false });
    this.store.dispatch(FaceActions.startStream());
  }

  onStop() {
    this.camera.stop();
    this.store.dispatch(FaceActions.stopStream());
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    ctx?.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  onSnapshot() {
    const v = this.videoRef.nativeElement;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')!.drawImage(v, 0, 0);
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = 'snapshot.png'; a.click();
  }

  async onUpload(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const img = new Image();
    img.onload = async () => {
      const dets = await this.face.detect(img);
      console.log('Detected faces:', dets);
      const faces = dets.map((d, idx) => ({
        id: String(idx),
        box: d.detection.box,
        age: d.age ? Math.round(d.age) : undefined,
        gender: d.gender,
        expressions: Object.fromEntries(Object.entries(d.expressions)) as { [key: string]: number }
      }));
      console.log('Faces mapped for store:', faces);
      this.uploadedImgSrc = img.src;
      this.uploadedFaces = faces;
      this.store.dispatch(FaceActions.facesDetected({ faces }));

      const cnv = this.canvasRef.nativeElement;
      cnv.width = img.width; cnv.height = img.height;
      cnv.getContext('2d')!.drawImage(img, 0, 0);
      this.drawOverlay();
    };
    img.src = URL.createObjectURL(file);
  }

  topExpression(expr?: { [k: string]: number }) {
    if (!expr) return '?';
    const [k] = Object.entries(expr).sort((a,b)=>b[1]-a[1])[0];
    return k;
  }

  private drawOverlay() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    if (!video.videoWidth) return;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // ✅ süresiz subscribe yerine tek seferlik oku
    this.faces$.pipe(take(1)).subscribe(faces => {
      const scaleX = canvas.width / video.videoWidth;
      const scaleY = canvas.height / video.videoHeight;

      faces.forEach(f => {
        const x = f.box.x * scaleX, y = f.box.y * scaleY;
        const w = f.box.width * scaleX, h = f.box.height * scaleY;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FF88';
        ctx.strokeRect(x, y, w, h);

        const label = `Age:${f.age ?? '?'} | ${f.gender ?? '?'} | ${this.topExpression(f.expressions)}`;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.font = '12px sans-serif';
        ctx.fillRect(x, y - 18, ctx.measureText(label).width + 10, 18);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, x + 5, y - 5);
      });
    });
  }
}
