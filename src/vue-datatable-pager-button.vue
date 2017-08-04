<style></style>

<template>
	<li :class="li_classes">
		<a href="javascript: void(0);" @click="sendClick">
			<slot>{{ value }}</slot>
		</a>
	</li>
</template>

<script>
import Settings from './classes/settings.js';

export default {
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		value: {
			type: Number,
			default: null
		},
	},
	computed: {
		li_classes(){
			var classes = [];

			if(this.disabled){
				classes.push(this.settings.get('pager.classes.disabled'));
			}

			if(this.selected){
				classes.push(this.settings.get('pager.classes.selected'));
			}

			return classes.join(' ');
		},
		settings(){
			return this.$parent.settings;
		},
	},
	methods: {
		sendClick(){
			if(!this.disabled){
				this.$emit('click', this.value);
			}
		}
	}
}
</script>
