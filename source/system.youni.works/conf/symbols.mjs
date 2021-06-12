export default function() {
		return {
			tag: Symbol.toStringTag,
			iterator: Symbol.iterator,
			decls: Symbol("decls")
		};
	}