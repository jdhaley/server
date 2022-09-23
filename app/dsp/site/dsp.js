
import {Frame, Display} from "./youni.works/ui/ui.js";
import controller from "./youni.works/ui/controllers/frame.js";

import conf from "./conf.js";

let frame = new Frame(window, controller);
let display = new Display(frame, conf);

let filePath = "/" + frame.location.search.substring(1);

display.service.open(filePath, display);
