export default function events() {
	let TRACK;
	let NO_CLICK;
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
	function getControl(node) {
		while(node) {
			if (node.$peer) return node.$peer;
			node = node.parentNode;
		}
	}
	return {
		windowEvents: {		
			input: TARGET_EVENT,
			cut: TARGET_EVENT,
			copy: TARGET_EVENT,
			paste: TARGET_EVENT,
	
			keydown: TARGET_EVENT,
			mousedown: function(event) {
				event.subject = "grab";
				TARGET_EVENT(event);
				if (event.track) {
					event.preventDefault();
					TRACK = event;
				} else {
					TRACK = null;
					event.subject = "mousedown";
					TARGET_EVENT(event);
				}
			},
			mousemove: function(event) {
				if (TRACK) {
					event.preventDefault();
					event.subject = "drag";
					event.track = TRACK.track;
					event.moveX = event.x - TRACK.x;
					event.moveY = event.y - TRACK.y;
					event.track.owner.send(event.track, event);
					TRACK = event;
					return;
				}
				TARGET_EVENT(event);
			},
			mouseup: function(event) {
				if (TRACK) {
					event.preventDefault();
					event.subject = "release"
					event.track = TRACK.track;
					event.moveX = 0;
					event.moveY = 0;
					TRACK.track.owner.send(TRACK.track, event);
					TRACK = null;
					NO_CLICK = true;
					return;
				}
				TARGET_EVENT(event);
			},
			click: function(event) {
				if (NO_CLICK) {
					event.preventDefault();
					NO_CLICK = false;
				} else {
					TARGET_EVENT(event);
				}
			},
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
		// documentEvents: {
		// 	selectionstart: SELECTION_EVENT,
		// 	selectionchange: SELECTION_EVENT
		// }
	}
}
