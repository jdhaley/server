import base from "../base/index.mjs";

import view from "./package/view.mjs";
import container from "./package/container.mjs";
import grid from "./package/grid.mjs";
import diagram from "./package/diagram.mjs";

export default {
	sys: base.sys,
	module: {
		id: "ui.youni.works",
		version: "1",
		moduleType: "library",
		uses: [base]
	},
	packages: {
		view: view,
		container: container,
		grid: grid,
		diagram: diagram
	}
}