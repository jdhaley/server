
import {Frame} from "./youni.works/ui/ui.js";
import {Editor} from "./youni.works/ui/editor/edit.js"
import conf from "./properties.js";

let frame = new Frame(window, conf.controllers.frame);
let article = new Editor(frame, conf);

let articlePath = "/" + frame.location.search.substring(1);

article.service.open(articlePath, article);
