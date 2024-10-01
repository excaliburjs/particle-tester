import * as ex from 'excalibur';
import * as ko from 'knockout';
import {
   Computed,
   Observable, ObservableArray, PureComputed
} from 'knockout';

const game = new ex.Engine({
   canvasElementId: 'game',
   width: 1000,
   height: 1000,
   displayMode: ex.DisplayMode.FitScreenAndFill
});
game.backgroundColor = ex.Color.Black;
var emitter = new ex.ParticleEmitter({
   pos: game.screen.center,

});
emitter.emitterType = ex.EmitterType.Rectangle;
emitter.radius = 5;
emitter.minVel = 100;
emitter.maxVel = 200;
emitter.minAngle = 0;
emitter.maxAngle = Math.PI * 2;
emitter.isEmitting = true;
emitter.emitRate = 300;
emitter.opacity = 0.5;
emitter.fadeFlag = true;
emitter.particleLife = 1000; // 1 sec
emitter.maxSize = 10;
emitter.minSize = 1;
emitter.startSize = 0;
emitter.endSize = 0;
emitter.acceleration = new ex.Vector(0, 800);
emitter.color = ex.Color.Rose;
game.add(emitter);
game.start();


export class EmitterViewModelV2 {
   code: PureComputed<string>;

   colors: { name: string, value: ex.Color, color: string }[] = [];
   emitterTypes: { name: string, value: string }[] = [];

   x: Observable<number> = ko.observable(0);
   y: Observable<number> = ko.observable(0);
   minVel: Observable<number> = ko.observable(100);
   maxVel: Observable<number> = ko.observable(200);
   minAngle: Observable<number> = ko.observable(0);
   maxAngle: Observable<number> = ko.observable(6.2);
   minSize: Observable<number> = ko.observable(1);
   maxSize: Observable<number> = ko.observable(10);
   startSize: Observable<number> = ko.observable(0);
   endSize: Observable<number> = ko.observable(0);
   width: Observable<number> = ko.observable(2);
   height: Observable<number> = ko.observable(2);
   radius: Observable<number> = ko.observable(5);
   emitterType: Observable<{ name: string, value: string }>;

   beginColor: Observable<{ name: string, value: ex.Color, color: string  }>;
   endColor: Observable<{ name: string, value: ex.Color, color: string  }>;

   ax: Observable<number> = ko.observable(0);
   ay: Observable<number> = ko.observable(800);

   fade: Observable<boolean> = ko.observable(true);
   emitRate: Observable<number> = ko.observable(300);
   opacity: Observable<number> = ko.observable(.5);
   particleLife: Observable<number> = ko.observable(1000);

   constructor(emitter: ex.ParticleEmitter) {
      for (const color of Object.getOwnPropertyNames(ex.Color) ) {
         if (ex.Color.hasOwnProperty(color) && color.charAt(0) === color.charAt(0).toUpperCase()) {
            this.colors.push({ 
               name: color,
               value: (ex.Color as any)[color],
               color: ((ex.Color as any)[color] as ex.Color).toRGBA()
            });
         }
      }
      this.colors.reverse();
      this.beginColor = ko.observable({ name: "Rose", value: ex.Color.Rose, color: ex.Color.Rose.toRGBA() });
      this.endColor = ko.observable({ name: "Yellow", value: ex.Color.Yellow, color: ex.Color.Yellow.toRGBA() });

      for (var type in ex.EmitterType) {
         if (ex.EmitterType.hasOwnProperty(type) && isNaN(type as any)) {
            this.emitterTypes.push({ name: type, value: ex.EmitterType[type] });
         }
      }

      this.emitterType = ko.observable(this.emitterTypes[1]);

      // setup subscriptions
      this.emitRate.subscribe((newRate) => {
         emitter.emitRate = newRate;
      });

      this.emitterType.subscribe((newType) => {
         emitter.emitterType = newType.value as unknown as ex.EmitterType;
      });

      this.radius.subscribe((newRadius) => {
         emitter.radius = newRadius;
      });

      this.minVel.subscribe((newVel) => {
         emitter.minVel = newVel;
      });

      this.maxVel.subscribe((newVel) => {
         emitter.maxVel = newVel;
      });

      this.minAngle.subscribe((newVel) => {
         emitter.minAngle = newVel;
      });

      this.maxAngle.subscribe((newVel) => {
         emitter.maxAngle = newVel;
      });

      this.minSize.subscribe((newSize) => {
         emitter.minSize = newSize;
      });

      this.maxSize.subscribe((newSize) => {
         emitter.maxSize = newSize;
      });

      this.startSize.subscribe((newSize) => {
         emitter.startSize = newSize;
      });

      this.endSize.subscribe((newSize) => {
         emitter.endSize = newSize;
      });

      this.particleLife.subscribe((life) => {
         emitter.particleLife = life;
      });

      this.beginColor.subscribe((newColor) => {
         if (newColor) emitter.beginColor = newColor.value;
      });

      this.endColor.subscribe((newColor) => {
         if (newColor) emitter.endColor = newColor.value;
      });

      this.opacity.subscribe(function (newOpacity) {
         emitter.opacity = newOpacity;
      });

      this.fade.subscribe(function (newFade) {
         emitter.fadeFlag = newFade;
      });

      this.ax.subscribe(function (newAx) {
         emitter.acceleration.x = newAx;
      });

      this.ay.subscribe(function (newAy) {
         emitter.acceleration.y = newAy;
      });

      // this.width.subscribe(function(width){
      //    emitter.width = width;
      // });

      // this.height.subscribe((height) =>{
      //    emitter.height = height;
      // });

      this.code = ko.pureComputed(() => {
         return `const emitter = new ex.ParticleEmitter({
   pos: ex.vec(${this.x()}, ${this.y()}),
   radius: ${this.radius()},
   emitterType: ex.EmitterType.${this.emitterType().name},
   minVel: ${this.minVel()},
   maxVel: ${this.maxVel()},
   minAngle: ${this.minAngle()},
   maxAngle: ${this.maxAngle()},
   isEmitting: true,
   emitRate: ${this.emitRate()},
   opacity: ${this.opacity()},
   fadeFlag: ${this.fade()},
   particleLife: ${this.particleLife()},
   minSize: ${this.minSize()},
   maxSize: ${this.maxSize()},
   startSize: ${this.startSize()},
   endSize: ${this.endSize()},
   acceleration: ex.vec(${this.ax()}, ${this.ay()}),
   beginColor: ex.Color.${this.beginColor().name},
   endColor: ex.Color.${this.endColor().name},
});`;
      });
      
      this.code.subscribe(() => {
         setTimeout(() => {
            // ambient global from script tag, ack lazy way to call it
            (window as any).Prism.highlightAll();
         })
      });
   }

   particleCount() {
      return emitter.particles.length;
   }

   async copyToClipboard(): Promise<void> {
      try {
         await navigator.clipboard.writeText(this.code());
       } catch (error) {
         console.error(error);
       }
   }

   setOptionBackground(option: HTMLOptionElement, item: any) {
      option.style.backgroundColor = `${item.color}`;
      const invertedColor = ex.Color.fromRGBString(item.color).invert().darken(.7);
      invertedColor.a = 1;
      option.style.color = `${invertedColor.toRGBA()}`;
   }
}

const vm = new EmitterViewModelV2(emitter);

var click = false;
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

