<template>
  <div class="swipe">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'SwipeNative',
  }
</script>

<style scoped>
  .swipe {
    overflow: auto;
    position: relative;
    width: 100%;
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;
    display: flex;
    flex-flow: row nowrap;
  }

  .swipe > div {
    flex: none;
    scroll-snap-align: center;
    width: 100%;
    position: relative;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
