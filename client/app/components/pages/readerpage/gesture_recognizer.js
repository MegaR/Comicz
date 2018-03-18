export default class GestureRecognizer {
    constructor(element, listener) {
        this.listener = listener;

        this.keyUpListener = event => this.keyUp(event.code);
        this.keyDownListener = event => this.keyDown(event.code);
        window.addEventListener('keyup', this.keyUpListener);
        window.addEventListener('keydown', this.keyDownListener);
        element.addEventListener('mousewheel', event => this.scroll(event.deltaY));
        element.addEventListener('mousedown', event => this.mouseDown(event));
        element.addEventListener('mouseup', () => this.mouseUp());
        element.addEventListener('mousemove', event => this.mouseMove(event));
        element.addEventListener('blur', () => this.mouseUp());

        element.addEventListener('touchstart', event => this.touchStart(event));
        element.addEventListener('touchend', event => this.touchEnd(event));
        element.addEventListener('touchmove', event => this.touchMove(event));
    }

    stopEventListeners() {
        window.removeEventListener('keyup', this.keyUpListener);
        window.removeEventListener('keydown', this.keyDownListener);
    }

    touchStart(event) {
        // this.isTouchDown = true;
        this.touchX = event.touches[0].clientX;
        this.touchY = event.touches[0].clientY;
        if (event.touches.length >= 2) {
            this.pinch = this.getDistance(event);
            console.log(this.pinch);
        }
        event.preventDefault();
    }

    touchEnd(event) {
        // this.isTouchDown = false;
        this.pinch = false;
        event.preventDefault();
    }

    touchMove(event) {
        // if(this.isTouchDown) {
        if (!this.pinch) {
            //drag
            this.listener.move({
                x: event.touches[0].clientX - this.touchX,
                y: event.touches[0].clientY - this.touchY
            });
            this.touchX = event.touches[0].clientX;
            this.touchY = event.touches[0].clientY;
        } else {
            //pinch
            const newDistance = this.getDistance(event);
            // this.listener.zoom((newDistance - this.pinch)*5);
            this.pinch = newDistance;
        }
        event.preventDefault();

        // }
    }

    keyUp(keyCode) {
        switch (keyCode) {
            case 'ArrowRight':
                this.listener.next();
                break;
            case 'ArrowLeft':
                this.listener.previous();
                break;
            case 'Minus':
                this.listener.zoom(1);
                break;
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
        this.listener.zoom(deltaY > 0 ? 1 : -1);
    }

    getDistance(event) {
        const difX = Math.abs(event.touches[1].clientX - event.touches[0].clientX);
        const difY = Math.abs(event.touches[1].clientY - event.touches[0].clientY);
        return Math.sqrt((difX * difX) / (difY * difY));
    }
}