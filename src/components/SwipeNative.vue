<template>
  <div @scroll.passive="onScroll" class="swipe">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'SwipeNative',
    data: () => ({
      inView: null,
      onScrollTimeout: null,
    }),

    mounted () {
      console.log(this.$slots.default)
    },

    methods: {
      onScroll () {
        this.onScrollTimeout && window.clearTimeout(this.onScrollTimeout)
        this.onScrollTimeout = window.setTimeout(this.onScrollEnd.bind(this), 50)
      },

      onScrollEnd () {
        this.inView = this.$slots.default.find(this.isInView) || null
        this.$emit('scroll-end', this.inView)
      },

      isInView (node) {
        const boundingRect = node.elm.getBoundingClientRect()
        return boundingRect.left === 0
      },
    },
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
