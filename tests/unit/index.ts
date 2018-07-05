const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import LeGrid from './../../src/index';
import Grid from './../../src/widgets/Grid';

describe('Index', () => {
	it('should re-export the grid', () => {
		assert.isOk(LeGrid);
		assert.strictEqual(LeGrid, Grid);
	});
});
