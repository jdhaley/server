interface Person {
	name: string,
	surname: string
}

export default {
	main(arg: Person) {
		return `This is ${this.str(arg.name)}.`;
	},
	str(arg: string) {
		return `${arg}`;
	}
}
