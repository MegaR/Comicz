import Hammer from 'hammerjs';

export default class GestureRecognizer {
    constructor(element, listener) {
        this.listener = listener;
        this.element = element;

        const hammer = new Hammer.Manager(element);
        const pinch = new Hammer.Pinch();
        const pan = new Hammer.Pan();
        const swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, velocity: 2});
        const tap = new Hammer.Tap();

        pinch.recognizeWith(pan);
        pinch.recognizeWith(swipe);
        pan.recognizeWith(swipe);
        hammer.add([pan, pinch, swipe, tap]);

        hammer.on('panstart', event => {
            this.panX = event.deltaX;
            this.panY = event.deltaY;
        });
        hammer.on('pan', event => {
            this.listener.move({
                x: event.deltaX - this.panX,
                y: event.deltaY - this.panY
            });

            this.panX = event.deltaX;
            this.panY = event.deltaY;
        });
        hammer.on('pinchstart', event => {
           this.pinch = event.scale;
        });
        hammer.on('pinch', event => {
            this.listener.zoom(-(event.scale - this.pinch));
            this.pinch = event.scale;
        });

        hammer.on('swipeleft', () => {
            this.listener.next();
        });

        hammer.on('swiperight', () => {
            this.listener.previous();
        });

        hammer.on('tap', ()=> {
            this.listener.tap();
        });

        this.keyUpListener = event => this.keyUp(event.code);
        this.keyDownListener = event => this.keyDown(event.code);
        window.addEventListener('keyup', this.keyUpListener);
        window.addEventListener('keydown', this.keyDownListener);
        element.addEventListener('mousewheel', event => this.scroll(event.deltaY));
    }

    stopEventListeners() {
        window.removeEventListener('keyup', this.keyUpListener);
        window.removeEventListener('keydown', this.keyDownListener);
    }

    keyUp(keyCode) {
        switch (keyCode) {
            case 'ArrowRight':
                this.listener.next();
                break;
            case 'ArrowLeft':
                this.listener.previous();
                break;
            case 'NumpadSubtract':
            case 'Minus':
                this.listener.zoom(1);
                break;
            case 'NumpadAdd':
            case 'Equal':
                this.listener.zoom(-1);
                break;
            default:
                console.log(keyCode);
                break;
        }
    }

    keyDown(keyCode) {
        switch (keyCode) {
            case 'ArrowUp':
                this.listener.move({x: 0, y: 10});
                break;
            case 'ArrowDown':
                this.listener.move({x: 0, y: -10});
                break;
        }
    }

    mouseDown(event) {
        this.isMouseDown = true;
        this.mouseX = event.x;
        this.mouseY = event.y;
    }

    mouseUp() {
        this.isMouseDown = false;
    }

    mouseMove(event) {
        if (this.isMouseDown) {
            this.listener.move({
                x: event.x - this.mouseX,
                y: event.y - this.mouseY
            });
            this.mouseX = event.x;
            this.mouseY = event.y;
        }
    }

    scroll(deltaY) {
        this.listener.zoom(deltaY > 0 ? 0.5 : -0.5);
    }

    getDistance(event) {
        const difX = Math.abs(event.touches[1].clientX - event.touches[0].clientX);
        const difY = Math.abs(event.touches[1].clientY - event.touches[0].clientY);
        return Math.sqrt((difX * difX) / (difY * difY));
    }
}