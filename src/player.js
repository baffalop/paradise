import Block from 'block'
import Eventful from 'eventful'

/**
 * Manages a sequence of Blocks, coordinating transport actions and relaying events to Paradise
 *
 * @type {Player}
 */
class Player extends Eventful {
  /**
   * @typedef {Object} Opts
   * @property {Number} skip
   */

  /**
   * @param {Array.<Block>} sequence
   * @param {Opts} opts
   */
  constructor (sequence, opts) {
    super()
    this.setOpts(opts)
    this.seq = sequence.reverse()
    this.playQueue = []
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
   * @param {Number} mul
   */
  skip (mul = 1) {
    if (this.playQueue.length === 0) {
      this.log('skip called with nothing in playQueue')
      return
    }

    // skipping backwards requires extra checks. @see Block.maybeSkip()
    if (mul < 0) {
      this.playQueue[this.playQueue.length - 1].maybeSkip(
        this.skipTime * mul,
        interval => this.playQueue.map(block => block.skip(interval))
      )
      return
    }

    this.playQueue.map(block => block.skip(this.skipTime * mul))
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

export default Player
