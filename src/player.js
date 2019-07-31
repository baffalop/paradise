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

  skip (mul = 1) {
    this.playQueue.map(block => block.skip(this.skipTime * mul))
  }

  blockEnd () {
    this.playQueue.shift()
    if (this.playQueue.length === 0) {
      this.ended()
    }
  }

  ended () {
    console.log('The whole sequence has ended')
  }

  /**
   * @param {String} type
   * @param {Object} emitter
   * @param {Object} data
   */
  receive (type, emitter, data) {
    switch (type) {
      case 'tail':
        this.getNext().play()
        break
      case 'end':
        this.blockEnd()
        break
      case 'start':
    }

    this.emit(type, emitter, data)
  }

  emit (type, emitter, data) {
    // todo: write emit
  }
}

export default Player
