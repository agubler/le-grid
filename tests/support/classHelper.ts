
export function assertAppliedClasses(expectedClassNames: any[], actualClasses: any) {
	let expectedClasses = true;
	Object.keys(actualClasses).forEach((actualClass) => {
		const expectedActive = expectedClassNames.indexOf(actualClass) !== -1;
		expectedClasses = expectedActive === actualClasses[actualClass];
	});
	return expectedClasses;
}
