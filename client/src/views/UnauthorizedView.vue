<template>
  <div class="overflow-y-hidden">
    <h1 class="text-2xl text-center font-semibold my-5">401 Unauthorized</h1>
    <hr />
    <div class="text-center">
      <button
        class="inline-block mt-4 border-1 border-solid bg-grey p-2"
        @click="this.$router.push('/')"
      >
        Back To Home
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedView'
};
</script>
