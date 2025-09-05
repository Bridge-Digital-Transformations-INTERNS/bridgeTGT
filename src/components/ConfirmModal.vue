<template>
  <Modal :open="open" :title="title" @cancel="$emit('cancel')" @confirm="$emit('confirm')">
    <p class="text-slate-700">{{ message }}</p>
  </Modal>
</template>

<script setup>
import Modal from './ModalCom.vue'
defineProps({ open: Boolean, title: String, message: String })
defineEmits(['cancel', 'confirm'])
</script>
