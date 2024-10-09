<script setup>
import boxApi from '@/api/box'
import { cloneDeep } from 'lodash'

const propsData = defineProps({
  data: { type: Object },
})

const density = inject('density')
const formData = ref(cloneDeep(propsData.data))

const submit = () => {
  return new Promise(resolve => { 
    boxApi.boxEdit(formData.value).finally(() => {
      resolve()
    })
  })
 
}

defineExpose({
  submit,
})
</script>

<template>
  <VContainer>
    <VRow>
      <VCol
        cols="6"
        class="text-center"
      >
        <VTextField
          v-model="formData.materialBoxName"
          label="料箱名称："
          :density="density"
        />
      </VCol>
      <VCol
        cols="6"
        class="text-center"
      >
        <VTextField
          v-model="formData.materialBoxCode"
          label="编号："
          :density="density"
        />
      </VCol>
      <VCol
        cols="6"
        class="text-center"
      >
        <VTextField
          v-model="formData.materialBoxVolume"
          label="载重："
          :density="density"
        />
      </VCol>
      <VCol
        cols="6"
        class="text-center"
      />
      <VCol
        cols="4"
        class="text-center"
      >
        <VChip
          class="ma-1"
          color="#FF9800"
        >
          X轴方向
        </VChip>
      </VCol>
      <VCol
        cols="4"
        class="text-center"
      >
        <VChip
          class="ma-1"
          color="#4CAF50"
        >
          Y轴方向
        </VChip>
      </VCol>
      <VCol
        cols="4"
        class="text-center"
      >
        <VChip
          class="ma-1"
          color="#4CAF50"
        >
          Z轴方向
        </VChip>
      </VCol>
      <VCol cols="4">
        <VTextField
          v-model="formData.materialBoxLengthX"
          label="尺寸："
          :density="density"
          suffix="mm"
          class="mb-2"
        />
      </VCol>
      <VCol cols="4">
        <VTextField
          v-model="formData.materialBoxLengthY"
          label="尺寸："
          :density="density"
          suffix="mm"
          class="mb-2"
        />
      </VCol>
      <VCol cols="4">
        <VTextField
          v-model="formData.materialBoxLengthZ"
          label="尺寸："
          :density="density"
          suffix="mm"
          class="mb-2"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
