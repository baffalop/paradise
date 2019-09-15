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

    this.playing = false
    this.active = false
    this.skipFirstSlide = true

    // for unlocking developer options. See swipeListener()
    this.devUnlockSlideIndex = 1
    this.devUnlockCount = 0
    this.devUnlockTargetCount = 6

    this.autoSlideSpeed = 1100
    this.debounceTime = 100
  }

  /**
   * Do any DOM setup not dependent on deviceready, listen for deviceready event
   */
  listen () {
    this.playPauseButton = document.getElementsByClassName('playpause')[0]
    this.swipe = new Swipe(document.getElementById('slider'), {
      draggable: true,
      speed: 500,
      continuous: false,
      callback: this.swipeListener.bind(this),
      transitionEnd: this.skipFirstSlide ? index => {
        if (this.skipFirstSlide && index === 1) {
          this.swipe.slide(2, this.autoSlideSpeed)
          this.skipFirstSlide = false
        }
      } : null,
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

    window.setTimeout(
      () => this.swipe.slide(1, this.autoSlideSpeed),
      3000
    )
  }

  /**
   * Initialise Player based on stored data or a newly shuffled playlist
   */
  initPlayer (playlistLength = null) {
    let usingRetrievedPlaylist = true
    let playlist = this.store.retrievePlaylist()

    if (playlist === null) {
      usingRetrievedPlaylist = false
      playlist = (new Shuffler(audioData.fragments)).shuffle(playlistLength || audioData.playlistLength)
    }

    const blocks = playlist.build(audioData.blockOpts)

    this.player = new Player(blocks, audioData.playerOpts)
    this.player.setUpstream(this).cueNext()

    this.log('new Player initialised')

    if (!usingRetrievedPlaylist) {
      this.store.savePlaylist(this.player)
      this.skipFirstSlide = false
    }
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
   * Listens for a sequence of back and forth swipes between 0th and 1st slides, to enable developer mode
   *
   * @param {number} index
   * @param {HTMLElement} element
   * @param {number} direction
   */
  swipeListener (index, element, direction) {
    const reset = () => {
      window.clearTimeout(this.devUnlockTimeout)
      this.devUnlockTimeout = null
      this.devUnlockCount = 0
      this.devUnlockSlideIndex = 1
    }

    this.log(`Swipe index ${index}, direction ${direction}`)
    const expectedDirection = this.devUnlockSlideIndex === 0 ? 1 : -1
    if (index !== this.devUnlockSlideIndex || direction !== expectedDirection) {
      reset()
      return
    }

    this.devUnlockSlideIndex = (this.devUnlockSlideIndex + 1) % 2
    this.devUnlockCount++

    this.log(`Unlock: ${this.devUnlockCount}`)

    if (this.devUnlockCount === 1) {
      this.devUnlockTimeout = window.setTimeout(() => {
        this.log('too late!')
        this.devUnlockSlideIndex = 1
        this.devUnlockCount = 0
      }, 3500)
    }

    if (this.devUnlockCount === this.devUnlockTargetCount) {
      reset()
      this.unlockDev()
    }
  }

  unlockDev () {
    navigator.notification.confirm(
      'What would you like to do?',
      index => {
        if (index === 1) {
          this.resetPlayer()
        } else if (index === 2) {
          this.resetPlayer(audioData.fragments.pool.length + 3)
        }
      },
      'Developer Mode',
      ['Shuffle new playlist', 'Generate full playlist', 'Cancel']
    )
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
      case 'sequenceEnd':
        this.resetPlayer()
        window.setTimeout(
          () => this.swipe.slide(3, this.autoSlideSpeed),
          4000
        )
    }
  }

  resetPlayer (playlistLength = null) {
    this.store.clearPlaylist()
    delete this.player

    this.playing = false
    this.playPauseButton.classList.remove('pause')

    this.initPlayer(playlistLength)
  }

  setupButtons () {
    this.setButtonClick('playpause', this.playPause.bind(this))
    this.setButtonClick('ffw', this.skipForward.bind(this))
    this.setButtonClick('rew', this.skipBack.bind(this))
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
