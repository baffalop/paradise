<template>
  <div class="player">
    <fragment-title :name="playlist[currentIndex] || 'blank'" />
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
  import Store from '../store'
  import Shuffler from "../shuffler"
  import {audio as audioData} from "../data"
  import Player from "../player"

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
      player: null,
      store: new Store(),
      playlist: [],
      currentIndex: 0,
      playing: false,
      preloaded: false,
    }),

    mounted () {
      this.initPlayer()
      this.initPlayerEvents()
    },

    methods: {
      togglePlay () {
        this.playing = !this.playing
        if (this.playing) {
          this.play()
        } else {
          this.player.pause()
        }
      },

      play () {
        this.player.play()
        if (!this.preloaded) {
          this.player.preload()
          this.preloaded = true
        }
      },

      ffw () {
        if (this.playing) this.player.skip(1)
      },

      rew () {
        if (this.playing) this.player.skip(-1)
      },

      skipToEnd () {
        if (this.playing) this.player.skipBlock()
      },

      onBlockTransition ({ remaining }) {
        console.log(`block transition: length: ${this.playlist.length} remaining: ${remaining}`)
        this.currentIndex = this.playlist.length - remaining
      },

      onSequenceEnd () {
        this.$emit('sequence-end')
        this.reset()
      },

      reset () {
        this.currentIndex = 0
        this.playing = false
        this.store.clearPlaylist()
        delete this.player
        this.initPlayer()
      },

      /**
       * @param {number} playlistLength
       */
      initPlayer (playlistLength = null) {
        let usingRetrievedPlaylist = true
        let playlistBuilder = this.store.retrievePlaylist()

        if (playlistBuilder === null) {
          usingRetrievedPlaylist = false
          playlistBuilder = (new Shuffler(audioData.fragments))
            .shuffle(playlistLength || audioData.playlistLength)
        }

        const blocks = playlistBuilder.build(audioData.blockOpts)

        this.playlist = playlistBuilder.blockData
        this.player = new Player(blocks, audioData.playerOpts)
        this.initPlayerEvents()
        this.player.cueNext()

        console.log('new Player initialised')

        if (!usingRetrievedPlaylist) {
          this.store.savePlaylist(this.player)
        }

        this.$emit('skip-slide', usingRetrievedPlaylist)
      },

      initPlayerEvents () {
        this.player
          .on('tail', () => {
            console.log('tail')
            this.store.savePlaylist(this.player)
          })
          .on('timeUpdate', ({ position }) => {
            console.log('timeUpdate')
            this.store.savePosition(position)
          })
          .on('sequenceEnd', data => {
            console.log('sequenceEnd')
            this.onSequenceEnd(data)
          })
          .on('blockTransition', data => {
            console.log('blockTransition')
            this.onBlockTransition(data)
          })
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
