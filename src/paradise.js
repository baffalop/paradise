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
    this.swipe = new Swipe(document.getElementById('slider'), {
      draggable: true,
      speed: 300,
      continuous: false,
      callback: (index) => console.log(`Swipe pos: ${index}`),
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
    let playlist = this.store.retrievePlaylist()
    if (playlist === null) {
      playlist = (new Shuffler(audioData)).shuffle(audioData.playlistLength)
    }

    this.player = new Player(playlist, audioData.playerOpts)
    this.player.setUpstream(this)
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

  setupButtons() {
    this.setButtonClick('playpause', e => {
        const elem = e.target
        if (!this.playing) {
          this.playing = true
          elem.classList.add('pause')
          this.doWithDebounce(() => this.player.play())
        } else {
          this.playing = false
          elem.classList.remove('pause')
          this.doWithDebounce(() => this.player.pause())
        }
      })

    this.setButtonClick(
      'ffw',
      e => {
        if (this.playing) this.doWithDebounce(() => this.player.skip())
      }
    )

    this.setButtonClick(
      'rew',
      e => {
        if (this.playing) this.doWithDebounce(() => this.player.skip(-1))
      }
    )
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
}

window.paradise = new Paradise()
paradise.listen()

window.giveMeParadise = function () {
  window.paradise = new Paradise()
}
