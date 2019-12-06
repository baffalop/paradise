<template>
  <div class="player">
    <fragment-title :name="playlist[currentIndex]" />
    <timeline :count="playlist.length" :position="currentIndex" :playing="playing" />
    <controls
      :playing="playing"
      :dev-mode="devMode"
      @toggle-play="togglePlay"
      @rew="rew"
      @ffw="ffw"
      @long-rew="reset"
      @long-ffw="skipToEnd"
    />
  </div>
</template>

<script>
  import Timeline from './Timeline'
  import Controls from './Controls'
  import FragmentTitle from './FragmentTitle'

  export default {
    name: 'Player',
    components: { FragmentTitle, Timeline, Controls, },
    props: {
      devMode: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data: () => ({
      playlist: [
        'intro',
        'bathhouse',
        'biographies',
        'clocks',
        'duster',
        'faggot',
        'ficus',
        'exlibris',
      ],
      currentIndex: 0,
      playing: false,
    }),
    methods: {
      togglePlay () {
        this.playing = !this.playing
      },
      rew () {
        if (this.currentIndex <= 0) return
        this.currentIndex --
      },
      ffw () {
        if (this.currentIndex === this.playlist.length - 1) {
          this.$emit('sequence-end')
          this.currentIndex = 0
          this.playing = false
          return
        }
        this.currentIndex ++
      },
      reset () {
        this.playing = false
        this.currentIndex = 0
      },
      skipToEnd () {
        this.currentIndex = this.playlist.length - 1
      },
    },
  }
</script>

<style scoped>
  .player {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .player > * {
    padding: 15px 0 15px 0;
  }
</style>
