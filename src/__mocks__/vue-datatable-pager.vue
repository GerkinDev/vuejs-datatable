<script>
// eslint-disable-next-line no-undef
jest.mock('../classes/settings');
import Settings from '../classes/settings';

export default {
	data:     () => ({}),
	computed: {
		settings: () => new Settings(),
		show(){
			return true;
		},
	},
};
</script>
