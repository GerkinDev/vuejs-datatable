import { createLocalVue, mount } from '@vue/test-utils';
import DatatablePagerButton from './vue-datatable-pager-button.vue';

const localVue = createLocalVue();
const Ctor = localVue.extend(DatatablePagerButton);

it('builds base HTML', () => {
	const wrapper = mount(Ctor);

	expect(wrapper.element.textContent.trim()).toBe('');
	expect(wrapper.element.children[0].nodeName).toBe('A');
	expect(wrapper.element.children[0].children.length).toBe(0);
});

it('displays passed value', () => {
	const wrapper = mount(Ctor, {
		propsData: {
			value: 1,
		},
	});

	expect(wrapper.element.textContent.trim()).toBe('1');
});

// TODO: figure out how to test this.
it.todo('slot overrides value');

// TODO: figure out how to test this.
it.todo('click emits click event');

// TODO: figure out how to test this.
it.todo('uses the correct selected class');

// TODO: figure out how to test this.
it.todo('uses the correct disabled class');
