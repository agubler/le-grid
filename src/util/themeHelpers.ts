
export function toggleClass(classes: { [index: string]: boolean }) {
	return Object.keys(classes).reduce((newClasses, c) => {
		newClasses[c] = false;
		return newClasses;
	}, <any> {});
}
