
import { Frame } from "./youni.works/control/frame.js";
import { ElementArticle } from "./youni.works/control/view.js";

import controller from "./youni.works/ui/actions/frame.js";

import conf from "./conf.js";

let frame = new Frame(window, controller);
let display = new ElementArticle(frame, conf);

let filePath = "/" + frame.location.search.substring(1);

display.service.open(filePath, display);
