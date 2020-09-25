<template>
  <div id="app">
    <vue-form-stepper>
      <template v-slot="{ steps }">
        <section>
          <input type="text" v-model="formData.name">
        </section>
        <section>Step2 </section>
        <section>Step3 </section>
      </template>

      <template #controls="{prev, next}">
        <button id="prev" @click="prev">Prev</button>
        <button id="next" @click="next">Next</button>
      </template>
    </vue-form-stepper>
  </div>
</template>

<script>
import VueFormStepper from './VueFormStepper'
export default {
	components: { VueFormStepper },
	data(){
		return{
			formData: {
				name: ''
			}
		}
	}
}
</script>

<style>

</style>