
import {Frame} from "./youni.works/ui/ui.js";
import {Article} from "./youni.works/ui/editor/article.js"
import conf from "./conf.js";

let frame = new Frame(window, conf.actions.frame);
let article = new Article(frame, conf);

let articlePath = "/" + frame.location.search.substring(1);

article.service.open(articlePath, article);
