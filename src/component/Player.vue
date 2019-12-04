<template>
  <div class="player">
    <timeline :total="playlistCount" :current="currentIndex" :playing="playing" />
    <controls
        :playing="playing"
        @toggle-play="togglePlay()"
        @rew="rew()"
        @ffw="ffw()"
    />
  </div>
</template>

<script>
  import Timeline from './Timeline'
  import Controls from './Controls'

  export default {
    name: 'Player',
    components: {Controls, Timeline },
    data: () => ({
      playlistCount: 8,
      currentIndex: 0,
      playing: false,
    }),
    methods: {
      rew () {
        if (this.currentIndex <= 0) return
        this.currentIndex --
      },
      ffw () {
        if (this.currentIndex >= this.playlistCount) return
        this.currentIndex ++
      },
      togglePlay () {
        this.playing = !this.playing
      }
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
