import Block from 'block'

class Player {
  /**
   * @param {Array.<Block>} sequence
   */
  constructor (sequence) {
    this.seq = sequence.reverse()
    this.cur = new Set()
    this.getNext()
  }

  getNext () {
    const next = this.seq.pop()

    if (this.seq.length === 0) {
      next.start(this, null, this.ended.bind(this))
    } else {
      next.start(this, () => this.getNext().play(), () => this.cur.delete(next))
    }

    this.cur.add(next)
    return next
  }

  play () {
    this.cur.forEach(block => block.play())
  }

  pause () {
    this.cur.forEach(block => block.pause())
  }

  ended () {
    this.cur.clear()
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
