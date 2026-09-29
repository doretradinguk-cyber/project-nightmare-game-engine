export class NightmareRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas?.getContext('webgl', { antialias: true, alpha: false }) || null;
    this.ready = Boolean(this.gl);
  }
  resize() {
    if (!this.canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(this.canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(this.canvas.clientHeight * ratio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl?.viewport(0, 0, width, height);
  }
  clear() {
    if (!this.gl) return;
    this.gl.clearColor(0.008, 0.012, 0.014, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
