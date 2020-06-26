import Eventful from './eventful'

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
    this.seq = sequence.slice().reverse()
    this.playQueue = []
  }

  /**
   * @param {Opts} opts
   */
  setOpts ({skip, tailOvershootThreshold}) {
    this.skipTime = skip
    this.tailOvershootThreshold = tailOvershootThreshold
  }

  preload () {
    this.seq.forEach(block => block.preload())
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
      if (!next.audio) next.setUpstream(this).start()

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

    this.playQueue.map(block => block.skip(this.skipTime * mul))
  }

  skipBlock () {
    this.playQueue.find(block => !block.tailReached).skipToTheEnd()
  }

  /**
   * Is more than one audio element playing?
   *
   * @returns {boolean}
   */
  isOverlapping () {
    return this.playQueue.length > 1
  }

  /**
   * @returns {Block[]}
   */
  getPlaylist () {
    return this.playQueue.concat(this.seq.slice().reverse())
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
        this.blockEnd(emitter)
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
      block.setOverlapping(this.isOverlapping())
      block.play()
    })

    if (!next) {
      this.log('reached tail of last block')
    }
  }

  /**
   * @param {Block} block
   */
  blockEnd (block) {
    if (this.playQueue[0] !== block) {
      this.log('blockEnd called for block that has already been removed')
      return
    }

    this.playQueue.shift()

    if (this.playQueue.length === 0) {
      this.ended()
      return
    }

    this.playQueue.map(block => {
      block.setOverlapping(this.isOverlapping())
    })
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
