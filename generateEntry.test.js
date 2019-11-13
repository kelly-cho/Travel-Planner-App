import { testing } from './src/client/js/generateEntry'

test('Get Duration of Trips', () => {

	let today = new Date();
 	expect(testing(today, today)).toBe(0);
})