<template>
  <el-button type="" @click="goEditor">去编辑器</el-button>
</template>
<script setup>
import { createRouter, useRouter, useRoute } from 'vue-router';
const router = useRouter()
// 4uW6ytLxLND6Z5M9GT2EsfynO5UYyFa2Hrhzui1hSTksSOtWrkJ8QieOo3zqORAF+EFRPabHv8o8SH7KMGviOw==
const goEditor = () => {
  router.push(
    '/editor?key=4uW6ytLxLND6Z5M9GT2EsfynO5UYyFa2Hrhzui1hSTksSOtWrkJ8QieOo3zqORAF+EFRPabHv8o8SH7KMGviOw=='
  )
}
</script>
<style lang="less"
></style>
