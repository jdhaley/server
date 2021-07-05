export default {
    type$: "system/core",
    Loader: {
        type$: "Instance",
        load(sourceDir) {
        }
    },
    Compiler: {
        type$: "Instance",
        compile(source) {
            console.log(source);
        }
    }
}
