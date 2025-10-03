import * as ex from 'excalibur';
import * as ko from 'knockout';
import { Observable, PureComputed } from 'knockout';

const game = new ex.Engine({
  canvasElementId: 'game',
  width: 1000,
  height: 1000,
  displayMode: ex.DisplayMode.FitScreenAndFill
});
game.backgroundColor = ex.Color.Black;
const emitter = new ex.ParticleEmitter({
  pos: game.screen.center
});
emitter.isEmitting = true;
emitter.emitRate = 300;
emitter.emitterType = ex.EmitterType.Rectangle;
emitter.radius = 5;
emitter.particle.minSpeed = 200;
emitter.particle.maxSpeed = 300;
emitter.particle.minAngle = (Math.PI / 180) * 250;
emitter.particle.maxAngle = (Math.PI / 180) * 290;
emitter.particle.minSize = 1;
emitter.particle.maxSize = 10;
emitter.particle.startSize = 0;
emitter.particle.endSize = 0;
emitter.particle.acc = new ex.Vector(0, 800);
emitter.particle.life = 1000; // 1 sec
emitter.particle.opacity = 0.5;
emitter.particle.fade = true;
emitter.particle.beginColor = ex.Color.Rose;
emitter.particle.endColor = ex.Color.Yellow;
game.add(emitter);
game.start();

export class EmitterViewModelV2 {
  code: PureComputed<string>;
  colors: { name: string; value: ex.Color; color: string; inverted: string }[] = [];
  emitterTypes: { name: string; value: ex.EmitterType }[] = [];

  isEmitting: Observable<boolean> = ko.observable(true);
  emitRate: Observable<number> = ko.observable(300);
  emitterType: Observable<{ name: string; value: ex.EmitterType }>;
  radius: Observable<number> = ko.observable(5);
  minSpeed: Observable<number> = ko.observable(200);
  maxSpeed: Observable<number> = ko.observable(300);
  minAngle: Observable<number> = ko.observable((Math.PI / 180) * 250);
  maxAngle: Observable<number> = ko.observable((Math.PI / 180) * 290);
  minSize: Observable<number> = ko.observable(1);
  maxSize: Observable<number> = ko.observable(10);
  startSize: Observable<number> = ko.observable(0);
  endSize: Observable<number> = ko.observable(0);
  ax: Observable<number> = ko.observable(0);
  ay: Observable<number> = ko.observable(800);
  life: Observable<number> = ko.observable(1000);
  opacity: Observable<number> = ko.observable(0.5);
  fade: Observable<boolean> = ko.observable(true);
  beginColor: Observable<{ name: string; value: ex.Color; color: string; inverted: string }>;
  endColor: Observable<{ name: string; value: ex.Color; color: string; inverted: string }>;

  x: Observable<number> = ko.observable(0);
  y: Observable<number> = ko.observable(0);

  constructor(emitter: ex.ParticleEmitter) {
    for (const color of Object.getOwnPropertyNames(ex.Color)) {
      if (ex.Color.hasOwnProperty(color) && color.charAt(0) === color.charAt(0).toUpperCase()) {
        const invertedColor = (ex.Color as any)[color].invert().darken(0.7);
        invertedColor.a = 1;
        const invertedColorString = invertedColor.toRGBA();
        this.colors.push({
          name: color,
          value: (ex.Color as any)[color],
          color: ((ex.Color as any)[color] as ex.Color).toRGBA(),
          inverted: invertedColorString
        });
      }
    }
    this.colors.reverse();
    this.beginColor = ko.observable(this.colors.find((c) => c.name === 'Rose')!);
    this.endColor = ko.observable(this.colors.find((c) => c.name === 'Yellow')!);

    Object.entries(ex.EmitterType).forEach(([name, value]) => {
      this.emitterTypes.push({ name, value });
    });

    this.emitterType = ko.observable(this.emitterTypes[1]);

    // setup subscriptions
    this.isEmitting.subscribe(function (newEmitting) {
      emitter.isEmitting = newEmitting;
    });

    this.emitRate.subscribe((newRate) => {
      emitter.emitRate = +newRate;
    });

    this.emitterType.subscribe((newType) => {
      emitter.emitterType = newType.value;
    });

    this.radius.subscribe((newRadius) => {
      emitter.radius = +newRadius;
    });

    this.minSpeed.subscribe((newVel) => {
      emitter.particle.minSpeed = +newVel;
    });

    this.maxSpeed.subscribe((newVel) => {
      emitter.particle.maxSpeed = +newVel;
    });

    this.minAngle.subscribe((newVel) => {
      emitter.particle.minAngle = +newVel;
    });

    this.maxAngle.subscribe((newVel) => {
      emitter.particle.maxAngle = +newVel;
    });

    this.minSize.subscribe((newSize) => {
      emitter.particle.minSize = +newSize;
    });

    this.maxSize.subscribe((newSize) => {
      emitter.particle.maxSize = +newSize;
    });

    this.startSize.subscribe((newSize) => {
      emitter.particle.startSize = +newSize;
    });

    this.endSize.subscribe((newSize) => {
      emitter.particle.endSize = +newSize;
    });

    this.ax.subscribe(function (newAx) {
      if (!emitter.particle.acc) {
        emitter.particle.acc = ex.vec(0, 0);
      }
      emitter.particle.acc.x = +newAx;
    });

    this.ay.subscribe(function (newAy) {
      if (!emitter.particle.acc) {
        emitter.particle.acc = ex.vec(0, 0);
      }
      emitter.particle.acc.y = +newAy;
    });

    this.life.subscribe((life) => {
      emitter.particle.life = +life;
    });

    this.opacity.subscribe(function (newOpacity) {
      emitter.particle.opacity = +newOpacity;
    });

    this.fade.subscribe(function (newFade) {
      emitter.particle.fade = newFade;
    });

    this.beginColor.subscribe((newColor) => {
      if (newColor) emitter.particle.beginColor = newColor.value;
    });

    this.endColor.subscribe((newColor) => {
      if (newColor) emitter.particle.endColor = newColor.value;
    });

    this.code = ko.pureComputed(() => {
      return `const emitter = new ex.ParticleEmitter({
  pos: ex.vec(${this.x()}, ${this.y()}),
  isEmitting: ${this.isEmitting()},
  emitRate: ${this.emitRate()},
  emitterType: ex.EmitterType.${this.emitterType().name},
  radius: ${this.radius()},
  particle: {
    minSpeed: ${this.minSpeed()},
    maxSpeed: ${this.maxSpeed()},
    minAngle: ${this.minAngle()},
    maxAngle: ${this.maxAngle()},
    minSize: ${this.minSize()},
    maxSize: ${this.maxSize()},
    startSize: ${this.startSize()},
    endSize: ${this.endSize()},
    acc: ex.vec(${this.ax()}, ${this.ay()}),
    life: ${this.life()},
    opacity: ${this.opacity()},
    fade: ${this.fade()},
    beginColor: ex.Color.${this.beginColor().name},
    endColor: ex.Color.${this.endColor().name},
  }
});`;
    });

    this.code.subscribe(() => {
      setTimeout(() => {
        // ambient global from script tag, ack lazy way to call it
        (window as any).Prism.highlightAll();
      });
    });
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
    } catch (error) {
      console.error(error);
    }
  }

  setOptionBackground(option: HTMLOptionElement, item: any) {
    option.style.backgroundColor = item.color;
    option.style.color = item.inverted;
  }
}

const vm = new EmitterViewModelV2(emitter);

let click = false;
game.input.pointers.on('down', function (evt) {
  click = true;
  emitter.pos.x = evt.worldPos.x;
  emitter.pos.y = evt.worldPos.y;
  vm.x(emitter.pos.x);
  vm.y(emitter.pos.y);
});

game.input.pointers.on('move', function (evt) {
  click = false;
});

game.input.pointers.on('up', function (evt) {
  if (click) {
    emitter.pos.x = evt.worldPos.x;
    emitter.pos.y = evt.worldPos.y;
    vm.x(emitter.pos.x);
    vm.y(emitter.pos.y);
  }
});

ko.applyBindings(vm);

setTimeout(() => {
  window.Prism.highlightAll();
});
