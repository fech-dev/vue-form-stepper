
export default {
	name: 'VueFormStepper',
	model: {
		prop: 'value',
		event: 'change'
	},

	props: {
		middlewares: {
			type: Array,
			default: () => []
		},
		
		steps: {
			type: Number,
			required: true
		},

		//Used for v-model
		value: {
			type: Number,
			default: 1
		}
	},

	computed: {
		scopedSlotsData(){
			return{
				currentStep: this.currentStep,
				steps: this.steps,
				prev: this.prev,
				next: this.next
			}
		}
	},

	data(){
		return{
			currentStep: this.value
		}
	},
  
	methods: {
		prev(){
			if(this.currentStep > 1){
				this.currentStep -= 1
				this.$emit('change', this.currentStep)
			}
		},

		async executeMiddleware(){
			const middleware = this.middlewares[this.currentStep - 1]
			let value = true
			if(middleware !== null && (typeof middleware === 'function')){
				value = middleware()
				if(value instanceof Promise){
					value = await value
				}
			}
			return value
		},

		async next(){
			/**
			 * cs steps
			 * 1  4
			 * 2  4
			 * 3  4
			 * 4  4
			 */
			let middlewarePass = await this.executeMiddleware()

			if((this.currentStep < this.steps) && middlewarePass){
				this.currentStep += 1
				this.$emit('change', this.currentStep)
			}
			else {
				this.$emit('submit')
			}
		}
	},

	render(h){

		if(!this.$scopedSlots.default){
			console.error(new Error('vue-form-stepper: can not create component without at least 1 section element'))
			return
		}
		const formContent = []

		const defaultSlotChildren = this.$scopedSlots.default(this.scopedSlotsData)

		if(defaultSlotChildren.length !== this.steps){
			console.error(new Error(`vue-form-stepper: number of elements(${defaultSlotChildren.length}) on default slot does not match the number of steps (${this.steps}) given.`))
			return
		}

		// formContent.push(...defaultSlotChildren.map((el, index) => this.currentStep === (index + 1) ? el : h()))
		formContent.push(...defaultSlotChildren.map((vNode, index) => {
			const vNodeData = vNode.data || {}
			const  el = h(vNode.tag, 
				{ 
					...vNodeData,
					style: { 
						...vNodeData.style,
						display: this.currentStep === (index + 1) ? null : 'none'
					}
				},
				vNode.children
			)

			return el 
		}))

		if(this.$scopedSlots.controls){
			const controlsSections = h('section', {
				staticClass: 'vue-form-stepper__controls'
			}, 
			this.$scopedSlots.controls(this.scopedSlotsData))
		
			formContent.push(controlsSections)
		}

		return h('form', {
			staticClass: 'vue-form-stepper',
			on: {
				submit: event => {
					event.preventDefault()
				}
			}
		}, formContent)
	},


}