import test from "./conf/test.mjs";
import main from "./main.mjs"
export default {
    id: "base.youni.works",
    version: "1.2.0",
    moduleType: "library",
    uses: {
        system: "system.youni.works-2.1"
    },
    conf: {
        test: test
    },
    main: main
}