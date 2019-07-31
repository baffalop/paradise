import Block from 'block'

class Player {
  /**
   * @param {Array.<Block>} sequence
   */
  constructor (sequence) {
    this.seq = sequence.reverse()
    this.playQueue = []
    this.getNext()
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
    }

    this.emit(type, emitter, data)
  }

  emit (type, emitter, data) {
    // todo: write emit
  }
}

export default Player
