
import {Frame} from "./youni.works/ui/ui.js";
import {DisplayOwner} from "./youni.works/ui/display/view.js"
import controller from "./youni.works/ui/controllers/frame.js";

import conf from "./conf.js";

let frame = new Frame(window, controller);
let display = new DisplayOwner(frame, conf);

let filePath = "/" + frame.location.search.substring(1);

display.service.open(filePath, display);
