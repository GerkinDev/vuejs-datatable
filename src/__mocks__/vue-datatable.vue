<script>
// eslint-disable-next-line no-undef
jest.mock( '../classes/settings' );
import Settings from '../classes/settings';

export default {
	data: () => ( {
		pagers: [],
	} ),
	computed: {
		settings: () => new Settings(),
	},
};
</script>
