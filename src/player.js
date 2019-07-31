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

    if (this.seq.length === 0) {
      next.start(this, null, this.ended.bind(this))
    } else {
      next.start(this, () => this.getNext().play(), () => this.playQueue.shift())
    }

    this.playQueue.push(next)
    return next
  }

  play () {
    this.playQueue.map(block => block.play())
  }

  pause () {
    this.playQueue.map(block => block.pause())
  }

  ended () {
    this.playQueue = []
    console.log('The whole sequence has ended')
  }

  /**
   * @param {String} type
   * @param {Object} emitter
   * @param {Object} data
   */
  receive (type, emitter, data) {
    switch (type) {
    }

    this.emit(type, emitter, data)
  }

  emit (type, emitter, data) {
    // todo: write emit
  }
}

export default Player
