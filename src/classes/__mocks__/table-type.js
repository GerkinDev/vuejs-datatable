/* eslint-disable no-undef */
// Import this named export into your test file:
export const getTableDefinition = jest.fn(v => v);
export const getPagerDefinition = jest.fn(v => v);
const mock = jest.fn().mockImplementation(function mockTableType(id){
	Object.defineProperty(this, 'id', {
		get: () => id,
	});
	this.getTableDefinition = () => getTableDefinition({name: id});
	this.getPagerDefinition = () => getPagerDefinition({name: `${ id }-pager`});
	return this;
});

export default mock;
