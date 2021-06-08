import conf from "./conf.mjs";
import main from "./main.mjs";
export default {
    name: "base.youni.works",
    version: "1.2.0",
    moduleType: "library",
    use: {
        system: "system.youni.works-2.1"
    },
    conf: conf,
    main: main
}