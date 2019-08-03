import Block from 'block'

class Player {
  /**
   * @param {Array.<Block>} sequence
   * @param {Object} opts
   */
  constructor (sequence, opts) {
    this.setOpts(opts)
    this.seq = sequence.reverse()
    this.playQueue = []
    this.getNext()
  }

  /**
   * @param {Object} opts
   */
  setOpts ({skip}) {
    this.skipTime = skip
  }

  getNext () {
    const next = this.seq.pop()
    next.start(this)
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
  receive (type, emitter, data) {
    this.log(`received ${type}`)
    switch (type) {
      case 'tail':
        this.getNext().play()
        break
      case 'end':
        this.blockEnd()
        break
    }

    this.emit(type, emitter, data)
  }

  blockEnd () {
    this.playQueue.shift()
    if (this.playQueue.length === 0) {
      this.ended()
    }
  }

  ended () {
    this.log('The whole sequence has ended')
  }

  emit (type, emitter, data) {
    // todo: write emit
  }

  log (message) {
    console.log(`Player: ${message}`)
  }
}

export default Player
