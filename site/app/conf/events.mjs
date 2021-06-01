let TRACK = null;
export default {
	windowEvents: {		
		input: TARGET_EVENT,
		cut: TARGET_EVENT,
		copy: TARGET_EVENT,
		paste: TARGET_EVENT,

		keydown: TARGET_EVENT,
		mousedown: function(event) {
			TARGET_EVENT(event);
			if (event.track) {
				TRACK = event;
				event.subject = "";
			}
		},
		mousemove: function(event) {
			if (TRACK) {
				event.subject = "track";
				event.track = TRACK.track;
				event.moveX = event.x - TRACK.x;
				event.moveY = event.y - TRACK.y;
				event.track.owner.send(event.track, event);
				TRACK = event;
				event.subject = "";
				return;
			}
			TARGET_EVENT(event);
		},
		mouseup: function(event) {
			if (TRACK) {
				event.subject = "trackEnd"
				event.track = TRACK.track;
				event.moveX = 0;
				event.moveY = 0;
				TRACK.track.owner.send(TRACK.track, event);
				TRACK = null;
				event.subject = "";
				return;
			}
			TARGET_EVENT(event);
		},
		click: TARGET_EVENT,
		dragstart: TARGET_EVENT,
		dragover: TARGET_EVENT,
		drop: TARGET_EVENT,
//		mouseover: TARGET_EVENT,
//		mouseout: TARGET_EVENT,
		focusin: TARGET_EVENT,
		focusout: TARGET_EVENT,
		focus: TARGET_EVENT,
		blur: TARGET_EVENT,
		contextmenu: function(event) {
			if (event.ctrlKey) {
				event.preventDefault();
				TARGET_EVENT(event);
			}
		},
		// resize: function(event) {
		// 	let owner = event.target.document.body.$peer.owner;
		// 	owner.send(owner, event);
		// },
		select: TARGET_EVENT, //may not exist
		change: TARGET_EVENT, //may not exist
	},
	documentEvents: {
		selectionstart: SELECTION_EVENT,
		selectionchange: SELECTION_EVENT
	}
}

function getControl(node) {
	while(node) {
		if (node.$peer) return node.$peer;
		node = node.parentNode;
	}
}

function TARGET_EVENT(event) {
	let ctl = getControl(event.target);
	ctl && ctl.owner.sense(ctl, event);
}

function SELECTION_EVENT(event) {
	let ctl = getControl(event.target);
	event.range = ctl && ctl.owner.selectionRange;
	ctl = ctl && event.range.commonAncestorContainer;
	ctl && ctl.owner.sense(ctl, event);
}
