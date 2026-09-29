export class NightmareInput {
  constructor(target = window) {
    this.keys = new Set();
    this.look = { x: 0, y: 0 };
    this.pointerLocked = false;
    this.target = target;
    this.onKeyDown = event => this.keys.add(event.code);
    this.onKeyUp = event => this.keys.delete(event.code);
    this.onPointerLock = () => {
      this.pointerLocked = document.pointerLockElement === target;
    };
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerlockchange', this.onPointerLock);
  }

  attachPointer(canvas) {
    canvas.addEventListener('click', () => {
      if (canvas.requestPointerLock) canvas.requestPointerLock();
    });
    canvas.addEventListener('mousemove', event => {
      if (!this.pointerLocked) return;
      this.look.x += event.movementX || 0;
      this.look.y += event.movementY || 0;
    });
  }

  axis() {
    return {
      x: (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0),
      z: (this.keys.has('KeyS') ? 1 : 0) - (this.keys.has('KeyW') ? 1 : 0)
    };
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerlockchange', this.onPointerLock);
  }
}
