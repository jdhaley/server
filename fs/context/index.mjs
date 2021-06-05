export default function main() {
    let ctx = this.sys.forName("/system.youni.works/context/Context");
    ctx = this.sys.extend(ctx, {
        facets: this.sys.facets
    });
    ctx.data = {
        x: {
            a: 10,
            b: 20,
            type$y: "y"
        },
        y: {
            type$: "x",
            b: 30,
            c: 50
        }
    }
    console.log(ctx.forName("y"));
}