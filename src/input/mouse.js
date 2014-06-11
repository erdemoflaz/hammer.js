var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END,
    mouseout: INPUT_CANCEL
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseout mouseup';

/**
 * Mouse events input
 * @constructor
 */
function MouseInput() {
    this.elEvents = MOUSE_ELEMENT_EVENTS;
    this.winEvents = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if(eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if(!this.pressed || !this.allow) {
            return;
        }

        var target = ev.relatedTarget || ev.toElement;
        var mouseOut = (eventType & INPUT_CANCEL && (!target || target.nodeName == 'HTML'));

        if(eventType & INPUT_END || mouseOut) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    },
});
