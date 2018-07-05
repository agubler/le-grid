import * as faker from 'faker';

export function createData(size: number = 1000) {
	const data: any[] = [];
	for (let i = 0; i < size; i++) {
		data.push({
			id: i,
			title: faker.name.prefix(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			street: faker.address.streetAddress(),
			zipCode: faker.address.zipCode()
		});
	}
	return data;
}
