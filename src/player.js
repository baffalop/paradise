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
   * @property {Number} tailOvershootThreshold
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
    this.cueNext()
  }

  /**
   * @param {Opts} opts
   */
  setOpts ({skip, tailOvershootThreshold}) {
    this.skipTime = skip
    this.tailOvershootThreshold = tailOvershootThreshold
  }

  /**
   * Move next block to play queue and return. Also start subsequent block in advance.
   * If a callback is provided, call with current before starting next.
   *
   * @param {?function(Block):void} callback
   *
   * @returns {?Block}
   */
  cueNext (callback = null) {
    const next = this.seq.pop()
    if (next) {
      this.playQueue.push(next)
      if (!next.media) next.setUpstream(this).start()
      if (typeof callback === 'function') callback(next)
    }

    if (this.seq.length > 0) this.seq[this.seq.length - 1].setUpstream(this).start()

    return next || null
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
   * @param {Block} emitter
   * @param {Object} data
   */
  handleEvent (type, emitter, data = {}) {
    switch (type) {
      case 'tail':
        this.startNextBlock(data)
        break
      case 'blockEnd':
        this.blockEnd()
        break
    }
  }

  /**
   * @param {{overshoot: Number}}
   */
  startNextBlock({overshoot}) {
    this.log(`Queuing next block. Overshoot: ${overshoot}`)

    const next = this.cueNext(block => {
      if (overshoot > this.tailOvershootThreshold) block.setStartFrom(overshoot)
      block.play()
    })

    if (!next) {
      this.log('reached tail of last block')
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
