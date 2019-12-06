<template>
  <div class="controls">
    <div
      class="controlButton rew"
      @click="$emit('rew')"
      v-longclick="longRew"
    />
    <div
      @click="$emit('toggle-play')"
      :class="playing ? 'pause' : 'play'"
      class="controlButton playpause"
    />
    <div
      class="controlButton ffw"
      @click="$emit('ffw')"
      v-longclick="longFfw"
    />
  </div>
</template>

<script>
  import longClickDirective from 'vue-long-click/src/directives/longclick'

  const LONG_CLICK_SPEED = 2000

  export default {
    name: 'controls',
    directives: {
      longclick: longClickDirective({delay: LONG_CLICK_SPEED}),
    },
    props: {
      playing: {
        type: Boolean,
        required: true,
      },
      devMode: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    methods: {
      longRew () {
        this.$emit('long-rew')
      },
      longFfw () {
        if (!this.devMode) return
        this.$emit('long-ffw')
      },
    },
  }
</script>

<style scoped>
  .controls {
    max-width: 500px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .controlButton {
    cursor: pointer;
    height: 80px;
    min-width: 80px;
    background: transparent no-repeat;
    background-size: 100% auto;
    transition: opacity 80ms ease-in 100ms;
  }

  .controlButton:active {
    transition: none;
    opacity: 0.5;
  }

  .ffw {
    transform: translate(-8px);
    background-image: url(./../assets/img/wind-fw.png);
  }

  .rew {
    transform: translateY(16px);
    background-image: url(./../assets/img/wind-back.png);
  }

  .playpause {
    background-image: url(./../assets/img/play-pause.png);
    width: 160px;
    background-size: 100% auto;
  }

  .playpause.play {
    background-position: 50% 0px;
  }

  .playpause.pause {
    background-position: 50% -80px;
  }
</style>
