import { audio as audioData } from 'data'
import Swipe from 'swipejs'
import Player from 'player'
import Eventful from 'eventful'
import Shuffler from 'shuffler'
import Store from 'store'

/**
 * Top-level class for the app, instantiated once on app launch. Deals with the DOM, and owns the Player.
 *
 * @class Paradise
 * @mixes Eventful
 */
class Paradise extends Eventful {
  constructor () {
    super()
    this.store = new Store()
    this.debounceTime = 100
    this.playing = false
    this.active = false
  }

  /**
   * Do any DOM setup not dependent on deviceready, listen for deviceready event
   */
  listen () {
    this.playPauseButton = document.getElementsByClassName('playpause')[0]
    this.swipe = new Swipe(document.getElementById('slider'), {
      draggable: true,
      speed: 300,
      continuous: false,
      callback: index => console.log(`Swipe pos: ${index}`),
    })

    document.addEventListener('deviceready', this.init.bind(this));
  }

  /**
   * Do deviceready-dependent setup
   */
  init () {
    this.initPlayer()

    this.setupButtons()
    this.active = true

    window.setTimeout(() => this.swipe.next(), 2000)
  }

  /**
   * Initialise Player based on stored data or a newly shuffled playlist
   */
  initPlayer () {
    let usingRetrievedPlaylist = true
    let playlist = this.store.retrievePlaylist()

    if (playlist === null) {
      usingRetrievedPlaylist = false
      playlist = (new Shuffler(audioData)).shuffle(audioData.playlistLength)
    }

    this.player = new Player(playlist, audioData.playerOpts)
    this.player.setUpstream(this)

    if (usingRetrievedPlaylist) this.store.savePlaylist(this.player)
  }

  /**
   * Toggle play/pause. If called from within app, should also create/destroy music controls.
   *
   * @param {Boolean} fromWithinApp
   */
  playPause (fromWithinApp = true) {
    this.doWithDebounce(() => {
      if (!this.playing) {
        this.playing = true
        this.playPauseButton.classList.add('pause')
        this.player.play()
        if (fromWithinApp) this.startControls()
      } else {
        this.playing = false
        this.playPauseButton.classList.remove('pause')
        this.player.pause()
        if (fromWithinApp) this.destroyControls()
      }

      if (!fromWithinApp) MusicControls.updateIsPlaying(this.playing)
    })
  }

  skipBack () {
    if (this.playing) this.doWithDebounce(() => this.player.skip(-1))
  }

  skipForward () {
    if (this.playing) this.doWithDebounce(() => this.player.skip())
  }

  startControls () {
    MusicControls.create({
        hasSkipForward: true,
        hasSkipBackward: true,
        skipForwardInterval: 10,
        skipBackwardInterval: 10,

        album: "I Don't Know Where Paradise Is",
      },
      () => this.log('started music controls'),
      () => this.log('error starting music controls')
    )

    MusicControls.subscribe(this.handleControlsEvent.bind(this))
    MusicControls.listen()
  }

  destroyControls () {
    MusicControls.destroy(
      () => this.log('destroyed music controls'),
      () => this.log('error destroying music controls')
    )
  }

  /**
   * @param {String} action
   */
  handleControlsEvent (action) {
    const message = JSON.parse(action).message
    this.log(`received controls event ${message}`)

    switch (message) {
      case 'music-controls-toggle-play-pause':
        this.playPause()
        break
      case 'music-controls-play':
        if (this.playing) {
          this.log('received controls play event but already playing')
          MusicControls.updateIsPlaying(this.playing)
          break
        }
        this.playPause()
        break
      case 'music-controls-pause':
        if (!this.playing) {
          this.log('received controls pause event but already paused')
          MusicControls.updateIsPlaying(this.playing)
          break
        }
        this.playPause()
        break
      case 'music-controls-next':
        this.skipForward()
        break
      case 'music-controls-previous':
        this.skipBack()
        break
    }
  }

  /**
   * @param {function(): void} action
   */
  doWithDebounce (action) {
    if (this.active) {
      action()
      this.debounce()
    }
  }

  debounce () {
    this.active = false
    window.setTimeout(() => this.active = true, this.debounceTime)
  }

  /**
   * @param {String} type
   * @param {Eventful} emitter
   * @param {Object} data
   */
  handleEvent (type, emitter, data = {}) {
    switch (type) {
      case 'tail':
        this.store.savePlaylist(this.player)
        break
      case 'timeUpdate':
        if (!data.hasOwnProperty('position')) {
          throw new Error('received timeUpdate event with no position property in data')
        }
        this.store.savePosition(data.position)
        break
    }
  }

  setupButtons() {
    this.setButtonClick('playpause', e => this.playPause())
    this.setButtonClick('ffw', e => this.skipForward())
    this.setButtonClick('rew', e => this.skipBack())
  }

  /**
   * Setup an onClick handler for DOM element by class name
   *
   * @param {String} className
   * @param {function(Event): void} listener
   */
  setButtonClick (className, listener) {
    const elems = document.getElementsByClassName(className)
    if (elems.length > 0) elems[0].addEventListener('click', listener)
  }

  /**
   * @param {String} message
   */
  log (message) {
    console.log(`Paradise: ${message}`)
  }
}

window.paradise = new Paradise()
paradise.listen()

window.giveMeParadise = function () {
  window.paradise = new Paradise()
}
