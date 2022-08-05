
import {Frame} from "./youni.works/ui/ui.js";
import {Article} from "./youni.works/ui/article.js"
import controller from "./youni.works/ui/controllers/frame.js";

import conf from "./conf.js";

let frame = new Frame(window, controller);
let article = new Article(frame, conf);

let articlePath = "/" + frame.location.search.substring(1);

article.service.open(articlePath, article);
