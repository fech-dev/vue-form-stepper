# vue-form-stepper

```bash
  npm install vue-form-stepper

  yarn add vue-form-stepper
 ```

```vue
<template>
  <div>
    <vue-form-stepper :steps="steps" v-model="currentStep" @submit="submitForm">
      <section>Step 1</section>
      <section>Step 2</section>
      <section>Step 3</section>
      <section>Step 4</section>
    
      <template v-slot:controls="{prev, next}">
        <button @click="prev" v-if="currentStep > 1">Back</button>
        <button @click="next">Next</button>
      </template>
    </vue-form-stepper>
  </div>
</template>

<script>
import VueFormStepper from 'vue-form-stepper'
export default {
  components: { VueFormStepper },
  data(){
    return{
      currentStep: 1,
      steps: 4,
      formData: {
        //...
      }
    }
  },
  methods: {
    submitForm(){
      //...
    }
  }
}
</script>
```

 ## Props

 ## Events

 ## Slots