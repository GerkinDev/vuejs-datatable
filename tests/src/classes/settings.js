import Settings from '../../../src/classes/settings.js';

export default () => {
    it('can retrieve properties', () => {
        let settings = new Settings();

		expect(settings.get('table.class')).toBe('table table-hover table-striped');
    });

    it('can set properties', () => {
        let settings = new Settings();
		settings.set('table.class', 'test-table');

		expect(settings.get('table.class')).toBe('test-table');
    });

    it('can override properties', () => {
        let settings = new Settings();
		settings.merge({
			table: {
				class: 'table class'
			},
			pager:{
				classes: {
					selected: 'active'
				}
			}
		});

		expect(settings.get('table.class')).toBe('table class');
		expect(settings.get('table.sorting.classes.canSort')[0]).toBe('sort');
        expect(settings.get('pager.classes.selected')).toBe('active');
        expect(settings.get('pager.classes.disabled')).toBe('disabled');
		expect(settings.get('pager.icons.previous')).toBe('&lt;');
    });
}
