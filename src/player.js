import Block from 'block'
import Eventful from 'events'

/**
 * Manages a sequence of Blocks, coordinating transport actions and relaying events to Paradise
 *
 * @type {Player}
 * @mixes Eventful
 */
class Player {
  /**
   * @typedef {Object} Opts
   * @property {Number} skip
   */

  /**
   * @param {Array.<Block>} sequence
   * @param {Opts} opts
   */
  constructor (sequence, opts) {
    this.setOpts(opts)
    this.seq = sequence.reverse()
    this.playQueue = []
    this.oneShotEvents = {}
    this.getNext()
  }

  /**
   * @param {Opts} opts
   */
  setOpts ({skip}) {
    this.skipTime = skip
  }

  /**
   * Add the next Block to the playQueue, initialise and return it
   *
   * @returns {Block}
   */
  getNext () {
    const next = this.seq.pop().setUpstream(this)
    next.start()
    this.playQueue.push(next)
    return next
  }

  play () {
    this.playQueue.map(block => block.play())
  }

  pause () {
    this.playQueue.map(block => block.pause())
  }

  /**
   * To skip multiple blocks at once, we pause them all, wait until they confirm they're paused, then skip them,
   * then wait until they confirm they've skipped, then play them again.
   * For explanation of the Crazy Curried reCursion underlying this, @see this.generateCountedEventHandler()
   * @param {Number} mul
   */
  skip (mul = 1) {
    if (this.playQueue.length === 0) {
      this.log('skip called with nothing in playQueue')
      return
    }

    let pauseCallback = () =>  this.playQueue.map(block => block.skip(this.skipTime * mul))

    // skipping backwards requires extra checks. @see Block.maybeSkip()
    if (mul < 0) {
      pauseCallback = () => {
        this.playQueue[this.playQueue.length - 1].maybeSkip(
          this.skipTime * mul,
          interval => this.playQueue.map(block => block.skip(interval))
        )
      }
    }

    this.oneShotEvent('paused', pauseCallback)
    this.oneShotEvent('skipped', () => this.play())
    this.pause()
  }

  /**
   *
   * @param {String} type
   * @param {function()} callback
   */
  oneShotEvent (type, callback) {
    if (this.oneShotIsCallable(type)) {
      throw new Error(`Event '${type}' already has a one shot handler`)
    }

    this.oneShotEvents[type] = this.generateCountedEventHandler(this.playQueue.length, callback)
  }

  /**
   * @param {String} type
   * @returns {boolean}
   */
  oneShotIsCallable (type) {
    return this.oneShotEvents.hasOwnProperty(type) && typeof this.oneShotEvents[type] === 'function'
  }

  /**
   * Crazy Currying reCursion:
   * When an event handler is called, it is reassigned its return value. This method curries a callback function that
   * will countdown until all expected events are received, then fire the target callback and deactivate the event handler
   *
   * @param {Number} count
   * @param {function()} callback
   * @returns {function(): ?function()}
   */
  generateCountedEventHandler (count, callback) {
    if (count > 1) {
      return () => this.generateCountedEventHandler(--count, callback)
    }

    return () => {
      callback()
      return null
    }
  }

  /**
   * @param {String} type
   * @param {Object} emitter
   * @param {Object} data
   */
  handleEvent (type, emitter, data = {}) {
    switch (type) {
      case 'tail':
        this.getNext().play()
        break
      case 'blockEnd':
        this.blockEnd()
        break
      default:
        if (this.oneShotIsCallable(type)) {
          this.oneShotEvents[type] = this.oneShotEvents[type]()
        }
    }
  }

  blockEnd () {
    this.playQueue.shift()
    if (this.playQueue.length === 0) {
      this.ended()
    }
  }

  ended () {
    this.log('The whole sequence has ended')
    this.emit('sequenceEnd')
  }

  log (message) {
    console.log(`Player: ${message}`)
  }
}

Object.assign(Player.prototype, Eventful)

export default Player
