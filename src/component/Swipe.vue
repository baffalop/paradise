<template>
  <div ref="slider" class="swipe">
    <div class="swipe-wrap">
      <slot />
    </div>
  </div>
</template>

<script>
  import Swipe from 'swipejs'

  export default {
    props: {
      settings: {
        type: Object,
        required: false,
        default: () => {},
      }
    },
    data: () => ({
        swipe: null,
    }),
    mounted: function () {
      this.swipe = new Swipe(this.$refs.slider, {
        draggable: true,
        speed: 500,
        continuous: false,
        ...this.settings,
        // callbacks should not be defined in settings prop, so we override them here
        callback: this.onSwipe.bind(this),
        transitionEnd: this.onTransitionEnd.bind(this),
      })
    },
    methods: {
      prev () {
        if (this.swipe === null) return
        this.swipe.prev()
      },
      next () {
        if (this.swipe === null) return
        this.swipe.next()
      },
      goto (index, dur) {
        if (this.swipe === null) return
        this.swipe.slide(index, dur)
      },
      onSwipe (index, elem, dir) {
        this.$emit('swipe', {index, elem, dir})
      },
      onTransitionEnd (index, elem) {
        this.$emit('transition-end', {index, elem})
      },
    }
  }
</script>

<style scoped>
  .swipe {
    overflow: hidden;
    visibility: hidden;
    position: relative;
  }

  .swipe-wrap {
    overflow: hidden;
    position: relative;
  }

  .swipe-wrap > div {
    float: left;
    width: 100%;
    position: relative;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

