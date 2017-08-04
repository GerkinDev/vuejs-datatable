import Vue from 'vue';
import DatatablePagerButton from '../../../src/vue-datatable-pager-button.vue';

const Ctor = Vue.extend(DatatablePagerButton);

export default () => {
    it('builds base HTML', () => {
        const vm = (new Ctor()).$mount();

        expect(vm.$el.textContent.trim()).toBe('');
        expect(vm.$el.children[0].nodeName).toBe('A');
        expect(vm.$el.children[0].children.length).toBe(0);
    });

    it('displays passed value', () => {
        const vm = (new Ctor({propsData: {
            value: 1
        }})).$mount();

        expect(vm.$el.textContent.trim()).toBe('1');
    });

    // TODO: figure out how to test this.
    it('slot overrides value', () => {
        pending('Need to figure out how to test this.');
    });

    // TODO: figure out how to test this.
    it('click emits click event', () => {
        pending('Need to figure out how to do this.');
    });

    // TODO: figure out how to test this.
    it('uses the correct selected class', () => {
        pending('This references the parent. Need to figure out how to inject a parent.');
    });

    // TODO: figure out how to test this.
    it('uses the correct disabled class', () => {
        pending('This references the parent. Need to figure out how to inject a parent.');
    });
}
