import { mount } from '@vue/test-utils'
import VueFormStepper from '../src/VueFormStepper'


describe('VueFormStepper', () => {

	it('shows the default slot\'s first child', () => {
		const getSectionEl = (text) => {
			const el = document.createElement('section')
			el.textContent = text
			return el
		}
    
		const wrapper = mount(VueFormStepper, {
			slots: {
				default: [
					getSectionEl('Step 1'),
					getSectionEl('Step 2'),
					getSectionEl('Step 3')
				]
			}
		})

		expect(wrapper.find('section:first-child')).toBeVisible()
	})

})