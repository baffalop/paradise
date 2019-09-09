import { audio as audioData } from 'data'
import Swipe from 'swipejs'
import Player from 'player'
import Eventful from 'eventful'
import Shuffler from 'shuffler'
import Store from 'store'
import Titles from 'titles'
import FastClick from 'fastclick'

/**
 * Top-level class for the app, instantiated once on app launch. Deals with the DOM, and owns the Player.
 *
 * @class Paradise
 */
class Paradise extends Eventful {
  constructor () {
    super()
    this.store = new Store()
    this.titles = new Titles()
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
    window.screen.orientation.lock('portrait')
      .then(
      () => this.log('screen locked to portrait'),
      reason => {
        this.log('screen lock error...')
        console.log(reason)
      }
    )

    this.initPlayer()

    FastClick.attach(document.body)
    this.setupButtons()
    this.active = true

    window.setTimeout(() => this.swipe.next(), 3000)
  }

  /**
   * Initialise Player based on stored data or a newly shuffled playlist
   */
  initPlayer () {
    let usingRetrievedPlaylist = true
    let playlist = this.store.retrievePlaylist()

    if (playlist === null) {
      usingRetrievedPlaylist = false
      playlist = (new Shuffler(audioData.fragments)).shuffle(audioData.playlistLength)
    }

    const blocks = playlist.build(audioData.blockOpts)

    this.player = new Player(blocks, audioData.playerOpts)
    this.player.setUpstream(this).cueNext()

    this.log('new Player initialised')

    if (!usingRetrievedPlaylist) this.store.savePlaylist(this.player)
  }

  /**
   * Toggle play/pause
   */
  playPause () {
    this.doWithDebounce(() => {
      if (!this.playing) {
        this.playing = true
        this.playPauseButton.classList.add('pause')
        this.player.play()
      } else {
        this.playing = false
        this.playPauseButton.classList.remove('pause')
        this.player.pause()
      }
    })
  }

  skipBack () {
    if (this.playing) this.doWithDebounce(() => this.player.skip(-1))
  }

  skipForward () {
    if (this.playing) this.doWithDebounce(() => this.player.skip())
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
      case 'blockTransition':
        this.titles.transition(data.name)
        break
    }
  }

  setupButtons() {
    this.setButtonClick('playpause', this.playPause.bind(this))
    this.setButtonClick('ffw', this.skipForward.bind(this))
    this.setButtonClick('rew', this.skipBack.bind(this))

    document.getElementById('gimme').addEventListener('click', () => {
      paradise.store.clearPlaylist()
      paradise.initPlayer()
    })
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
