
import { Frame } from "./youni.works/control/frame.js";
import { IArticle } from "./youni.works/control/editor.js";

import controller from "./youni.works/ui/actions/frame.js";

import conf from "./conf.js";

let frame = new Frame(window, controller);
let display = new IArticle(frame, conf);

let filePath = "/" + frame.location.search.substring(1);

display.service.open(filePath, display);
