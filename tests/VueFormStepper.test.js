import { mount } from '@vue/test-utils'
import VueFormStepper from '../src/VueFormStepper'


const wrapper = mount(VueFormStepper, {
	propsData: {
		steps: 4,
		middlewares: [
			jest.fn(() => true),
			jest.fn(() => {
				return new Promise(resolve => {
					setTimeout(() => resolve(true), 500)
				})
			})
		]
	},
	slots: {
		default: [
			'<section>Step 1</section>',
			'<div>Step 2</div>',
			'<section>Step 3</section>',
			'<section>Step 4</section>',
		]
	}
})

afterAll(() => {
	wrapper.destroy()
})

describe('VueFormStepper', () => {
  
	it('increment currentStep when \'next()\' method is called', async () => {
		await wrapper.vm.next()
		expect(wrapper.vm.currentStep).toBe(2)
		await wrapper.vm.next()
		expect(wrapper.vm.currentStep).toBe(3)
		wrapper.vm.currentStep = 1
	})

	it('shows the second element', async () => {
		await wrapper.vm.next()
		const sections = wrapper.findAll('section, div')
		
		expect(sections.at(0).isVisible()).toBe(false)
		expect(sections.at(1).isVisible()).toBe(true)
		expect(sections.at(2).isVisible()).toBe(false)
		expect(sections.at(3).isVisible()).toBe(false)
	})
  
	it('not increment currentStep if currentStep is equal steps and emits a subimit event', async () => {
		wrapper.vm.currentStep = 1
		await wrapper.vm.next()
		expect(wrapper.vm.currentStep).toBe(2)
		await wrapper.vm.next()
		expect(wrapper.vm.currentStep).toBe(3)
		await wrapper.vm.next()
		expect(wrapper.vm.currentStep).toBe(4)
		await wrapper.vm.next()
		expect(wrapper.vm.currentStep).toBe(4)
		expect(wrapper.emitted().submit.length).toBe(1)
	})

	it('sets previous step when \'prev()\' method is called', () => {
		wrapper.vm.currentStep = 3
		wrapper.vm.prev()
		expect(wrapper.vm.currentStep).toBe(2)
		wrapper.vm.prev()
		expect(wrapper.vm.currentStep).toBe(1)
	})
  
	it('not decrement currentStep if currentStep is equal 1', () => {
		wrapper.vm.currentStep = 3
		
		wrapper.vm.prev()
		expect(wrapper.vm.currentStep).toBe(2)
		wrapper.vm.prev()
		expect(wrapper.vm.currentStep).toBe(1)
		wrapper.vm.prev()
		expect(wrapper.vm.currentStep).toBe(1)
	})
  
	it('execute middlewares (if defined) between the transition from current step and next step', async () => {
		wrapper.vm.currentStep = 1
    
		await wrapper.vm.next()
		expect(wrapper.props().middlewares[0]).toBeCalled()
		expect(wrapper.vm.currentStep).toBe(2)

		await wrapper.vm.next()
		expect(wrapper.props().middlewares[1]).toBeCalled()
	})
	
	it('does not increment currentStep if middleware return false', async () => {
		const innerWrapper = mount(VueFormStepper, {
			propsData: {
				steps: 4,
				middlewares: [
					jest.fn(() => false),
					jest.fn(() => true)
				]
			},
			slots: {
				default: [
					'<section>Step 1</section>',
					'<div>Step 2</div>',
					'<section>Step 3</section>',
					'<section>Step 4</section>',
				]
			}
		}) 

		
		await innerWrapper.vm.next()
		expect(innerWrapper.vm.currentStep).toBe(1)

		innerWrapper.destroy()
	})

	it('emits change event when is execute prev() or next() [v-model]', async () => {
		const parent = mount({
			components: { VueFormStepper },
			data(){
				return{ formCurrentStep: 1 }
			},
			template: `<vue-form-stepper :steps="3" v-model="formCurrentStep">
				<template v-slot:default>
					<section>Step 1</section><section>Step 2</section><section>Step 3</section>
				</template>

				<template v-slot:controls="{prev, next}">
					<button id="prev" @click="prev">Prev</button>
					<button id="next" @click="next">Next</button>
				</template>
      </vue-form-stepper>`
		})
		
		await parent.find('#next').trigger('click')
		expect(parent.findComponent(VueFormStepper).emitted().change).toBeTruthy()
		expect(parent.findComponent(VueFormStepper).emitted().change.length).toBe(1)
		expect(parent.vm.formCurrentStep).toBe(2)

		await parent.find('#prev').trigger('click')
		expect(parent.findComponent(VueFormStepper).emitted().change.length).toBe(2)
		expect(parent.vm.formCurrentStep).toBe(1)
	})
})

test.todo('add support for transition-group')