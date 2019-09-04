class Circle {
    element = null;
    group = ["bubble", "capture"]; // 1-red circle(bubble), 2-yellow circle(capture)
    parent = null;
    child = null;
    captureTime = 1000; // mille seconds.
    bubbleTime = 1000; // mille seconds.
    time = 1000; // mille seconds.
    constructor(_parent) {
        this.element = document.createElement("div");
        this.element.classList.add("circle");
        this.addEvent("click");
        this.attachTo(_parent);
    }

    attachTo(_parent) {
        if (typeof _parent === "string") {
            document.querySelector(_parent).appendChild(this.element);
        } else if (_parent instanceof Circle) {
            _parent.addChild(this);
            _parent.element.appendChild(this.element);
        }
        this.parent = _parent;
        // this.updateTime(_parent);
    }

    updateTime(parent) {
        if (parent instanceof Circle) {
            if (this.child instanceof Circle) {
                this.bubbleTime = this.child.bubbleTime + 1000;
            } else {
                this.bubbleTime = 1000;
            }
            this.updateTime.call(parent, parent.parent);
        } else if (this.child instanceof Circle) {
            this.captureTime = 1000;
            this.bubbleTime = this.child.bubbleTime + 1000;
        }
        if (this.child instanceof Circle) {
            this.child.captureTime = this.captureTime + 1000;
        }
    }

    addGroup(_group) {
        let time = _group ? this.captureTime : this.bubbleTime;
        if (
            this.group[_group] &&
            this.element.className.indexOf(this.group[_group]) < 0
        ) {
            setTimeout(() => {
                this.element.classList.add(this.group[_group]);
                if (_group && this.child instanceof Circle) {
                    this.child.captureTime = this.captureTime + 1000;
                } else if (this.parent instanceof Circle) {
                    this.parent.bubbleTime = this.bubbleTime + 1000;
                }
            }, time);
            setTimeout(() => {
                this.removeGroup(_group);
            }, time + 1000);
        }
    }

    removeGroup(_group) {
        if (
            this.group[_group] &&
            this.element.className.indexOf(this.group[_group]) > -1
        ) {
            this.element.classList.remove(this.group[_group]);
        }
    }

    addChild(_child) {
        this.child = _child;
    }

    removeChild() {
        if (this.child) {
            this.child.destroy();
        }
        this.child = null;
    }

    addEvent(_eventType) {
        if (this.eventType) {
            this.removeEvent();
        }
        this.eventType = _eventType;
        // Bubble event flow
        this.bubbleHandler = this.addGroup.bind(this, 0);
        this.mouseover = event => {
            event.stopPropagation();
            this.element.classList.add("mouseover");
        };
        this.mouseout = event => {
            event.stopPropagation();
            this.element.classList.remove("mouseover");
        };
        this.element.addEventListener(_eventType, this.bubbleHandler);
        this.element.addEventListener("mouseover", this.mouseover);
        this.element.addEventListener("mouseout", this.mouseout);

        // Capture event flow
        this.captureHandler = this.addGroup.bind(this, 1);
        this.element.addEventListener(_eventType, this.captureHandler, true);
    }

    removeEvent() {
        if (this.bubbleHandler) {
            this.element.removeEventListener(
                this.eventType,
                this.bubbleHandler
            );
            this.bubbleHandler = null;
        }
        if (this.captureHandler) {
            this.element.removeEventListener(
                this.eventType,
                this.captureHandler
            );
            this.captureHandler = null;
        }
        if (this.mouseover) {
            this.element.removeEventListener("mouseover", this.mouseover);
            this.mouseover = null;
        }
        if (this.mouseout) {
            this.element.removeEventListener("mouseout", this.mouseout);
            this.mouseout = null;
        }
        this.eventType = null;
    }
    destroy() {
        this.removeEvent();
        this.element.remove();
        this.removeChild();
    }
}

let new_circle = null;

function init() {
    // The first circle should be included in cicle container
    new_circle = new Circle("#circle_container");
    createCircles(8);
}

function createCircles(_count) {
    let count = _count;
    while (count > 0) {
        new_circle = new Circle(new_circle);
        count--;
    }
}
