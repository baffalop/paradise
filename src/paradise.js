import { audio as audioData } from 'data'
import Swipe from 'swipejs'
import Player from 'player'
import EventMixin from 'events'

class Paradise {
  constructor () {
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
    window.setTimeout(() => this.swipe.next(), 2000)
    this.player = (new Player(audioData.blocks, audioData.playerOpts)).setUpstream(this)
    this.setupButtons()
    this.active = true
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
          this.doWithDebounce(() => this.player.play())
          elem.classList.remove('play')
          elem.classList.add('pause')
        } else {
          this.doWithDebounce(() => this.player.pause())
          elem.classList.remove('pause')
          elem.classList.add('play')
        }
      })
    this.setButtonClick(
      'ffw',
      e => this.doWithDebounce(() => this.player.skip())
    )
    this.setButtonClick(
      'rew',
      e => this.doWithDebounce(() => this.player.skip(-1))
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
    if (elems.length > 0) elems.addEventListener('click', listener)
  }
}

Object.assign(Player.prototype, EventMixin)

window.paradise = new Paradise()
paradise.listen()
