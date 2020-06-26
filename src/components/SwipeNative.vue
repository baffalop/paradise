<template>
  <div @scroll.passive="onScroll" class="swipe">
    <slot />
  </div>
</template>

<script>
  const SCROLL_EVENT_THROTTLE = 70

  export default {
    name: 'SwipeNative',
    data: () => ({
      inView: null,
      onScrollTimeout: null,
      onScrollInterval: null,
    }),

    mounted () {
      if (this.$slots.default.length > 0) {
        this.inView = this.$slots.default[0]
      }
    },

    methods: {
      onScroll () {
        if (this.onScrollTimeout) {
          window.clearTimeout(this.onScrollTimeout)
        } else {
          this.onScrollInterval = window.setInterval(this.updateInView.bind(this), SCROLL_EVENT_THROTTLE)
        }
        this.onScrollTimeout = window.setTimeout(this.onScrollEnd.bind(this), SCROLL_EVENT_THROTTLE)
      },

      onScrollEnd () {
        window.clearInterval(this.onScrollInterval)
        this.onScrollInterval = null
        this.onScrollTimeout = null
        this.inView = this.$slots.default.find(this.isInView) || null
        this.$emit('scroll-end', this.inView)
      },

      updateInView () {
        const children = this.$slots.default
        if (children.length === 0) {
          return
        }

        const getAbsLeft = node => Math.abs(node.elm.getBoundingClientRect().left)
        const mostCentralElement = children.reduce(
          (prev, cur) => getAbsLeft(prev) < getAbsLeft(cur) ? prev : cur,
          children[0]
        )

        if (mostCentralElement !== this.inView) {
          this.inView = mostCentralElement
          this.$emit('transition', this.inView)
        }
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
    -webkit-overflow-scrolling: touch;
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
