

Examples w/the flowchart

If any function consumes the event, it can call Viewport.set_input_as_handled(), and the event will not spread any more.

If the control wants to "consume" the event, it will call Control.accept_event() and the event will not spread any more
