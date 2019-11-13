import { appTest } from './src/client/js/generateEntry'

test('Get Duration of Trips', () => {
	let today = new Date();
 	expect(appTest(today, today)).toBe(0);
})

