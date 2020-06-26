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
      playlistLength: {
        type: Number,
        required: false,
        default: audioData.playlistLength,
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

      onTimeUpdate ({ name, pos }) {
        this.store.savePosition(pos)

        if (name !== this.playlist[this.currentIndex]) {
          this.updateIndex(name)
        }
      },

      updateIndex (blockName) {
        const newIndex = this.playlist.indexOf(blockName)
        if (newIndex === -1) {
          console.log('WARNING: transitioned to unrecognised block. Not changing index.')
          return
        }

        this.currentIndex = newIndex
        this.store.saveIndex(newIndex)
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

      initPlayer () {
        let usingRetrievedPlaylist = true
        let playlistBuilder = this.store.retrievePlaylist()

        if (playlistBuilder === null) {
          usingRetrievedPlaylist = false
          playlistBuilder = (new Shuffler(audioData.fragments))
            .shuffle(this.playlistLength)
        }

        const blocks = playlistBuilder.build(audioData.blockOpts)
        this.player = new Player(blocks, audioData.playerOpts)
        this.initPlayerEvents()
        this.player.cueNext()

        console.log('new Player initialised')

        this.playlist = playlistBuilder.playlist
        this.currentIndex = playlistBuilder.index

        if (!usingRetrievedPlaylist) {
          this.store.savePlaylist(this.playlist)
        }

        this.$emit('skip-slide', usingRetrievedPlaylist)
      },

      initPlayerEvents () {
        this.player
          .on('timeUpdate', data => {
            console.log('timeUpdate')
            this.onTimeUpdate(data)
          })
          .on('sequenceEnd', data => {
            console.log('sequenceEnd')
            this.onSequenceEnd(data)
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
