
import { Frame } from "./youni.works/ui/frame.js";
import { Display } from "./youni.works/ui/box.js";

import controller from "./youni.works/ui/actions/frame.js";

import conf from "./conf.js";

let frame = new Frame(window, controller);
let display = new Display(frame, conf);

let filePath = "/" + frame.location.search.substring(1);

display.service.open(filePath, display);
