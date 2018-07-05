const names = ['Bill', 'Bess', 'Zara', 'Sarah', 'Matt', 'Antony', 'Tom', 'Eve', 'Flo', 'Gill'];
const surnames = [
	'Langworth',
	'Shanahan',
	'Connelly',
	'Sauer',
	'Von',
	'Willms',
	'Zulauf',
	'Mann',
	'Gutkowski',
	'Ernser'
];
const titles = ['Mr.', 'Miss', 'Ms.', 'Mrs.', 'Dr.'];

export function createData(size: number = 1000) {
	const data: any[] = [];
	for (let i = 0; i < size; i++) {
		const nameIndex = Math.floor(Math.random() * 10);
		const surnameIndex = Math.floor(Math.random() * 10);
		const titleIndex = Math.floor(Math.random() * 5);
		data.push({
			id: i,
			title: titles[Math.floor(nameIndex / 2)],
			firstName: names[surnameIndex],
			lastName: surnames[titleIndex]
		});
	}
	return data;
}
