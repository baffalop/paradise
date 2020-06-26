import Eventful from './eventful'

/**
 * Owns a single Media object, passes events to Player
 *
 * @type {Block}
 */
class Block extends Eventful {
  /**
   * @param {string} dir
   * @param {string} src
   * @param {number} tail
   */
  constructor (dir, src, tail) {
    super()

    this.src = src
    this.tailOffset = tail

    this.dir = dir
    this.ext = '.mp3'

    this.startFrom = null
    this.tailReached = false
    this.overlapping = false
    this.lastPosition = 0

    this.timeUpdateInterval = 100
    this.timeUpdateCount = 0
    this.saveTimeCount = 1000 / this.timeUpdateInterval
    this.timeUpdateId = null
  }

  preload () {
    this.start()

    this.play()
      .then(() => {
        this.pause()
        this.log('preloaded')
      })
      .catch(reason => {
        this.log('play error')
        console.log(reason)
      })
  }

  /**
   * Initialise audio
   */
  start () {
    if (typeof this.audio === 'object') {
      this.log('already started')
      return
    }

    this.log('starting')

    this.audio = new Audio(this.dir + this.src + this.ext)
    this.audio.preload = 'auto'

    this.audio.addEventListener('playing', () => {
      if (typeof this.startFrom === 'number') {
        this.seekTo(this.startFrom)
        this.startFrom = null
      }
      this.watchTime()
      this.log('playing event')
      this.emit('playing')
    })

    this.audio.addEventListener('pause', () => {
      this.log('pause event')
      this.stopWatchingTime()
      this.emit('paused')
    })

    this.audio.addEventListener('ended', () => {
      this.log('ended event')
      this.stopWatchingTime()
      this.emit('blockEnd')
    })

    return this
  }

  play () {
    if (!this.audio) {
      throw new Error('Audio not started')
    }

    return this.audio.play()
  }

  pause () {
    if (!this.audio) {
      throw new Error('Audio not started')
    }

    const pos = this.audio.currentTime
    if (pos < 0) return

    this.lastPosition = pos
    this.emit('timeUpdate', { pos: pos })
    this.audio.pause()
  }

  /**
   * @param {Number} interval
   */
  skip (interval) {
    const pos = this.audio.currentTime
    const newPos = pos + interval
    this.log(`skipping from ${pos} to ${newPos}`)
    this.seekTo(newPos)
    this.checkTail(newPos)
  }

  /**
   * @param {Number} pos
   */
  seekTo (pos) {
    this.audio.currentTime = pos
    this.emit('skipped')
  }

  skipToTheEnd () {
    this.seekTo(this.audio.duration - this.tailOffset - 3)
  }

  /**
   * Set a position to skip to immediately on audio running
   *
   * @param {Number} position
   */
  setStartFrom (position) {
    this.startFrom = position
  }

  /**
   * Set flag whether we are overlapping with another block (in which case we can't call Media methods)
   * If we are now no longer overlapping, start the timeUpdate interval.
   *
   * @param {boolean} overlapping
   */
  setOverlapping (overlapping) {
    if (this.overlapping !== overlapping) {
      this.overlapping = overlapping
      if (!overlapping) {
        this.watchTime()
      }
    }
  }

  /**
   * @returns {number}
   */
  getLastPosition () {
    return this.lastPosition
  }

  /**
   * Get this Block's constructor arguments
   *
   * @returns {{src: string, tail: number}}
   */
  getBlockParams () {
    return {
      dir: this.dir,
      src: this.src,
      tail: this.tailOffset,
    }
  }

  /**
   * Start watching audio's current time with timeUpdate
   */
  watchTime () {
    if (this.tailReached) {
      this.log('tail reached so not querying play position')
      return
    }

    if (this.overlapping) {
      this.log('currently overlapping with previous audio so not querying play position')
      return
    }

    if (typeof this.timeUpdateId === 'number') {
      this.log('already watching time')
      return
    }

    this.timeUpdateId = window.setInterval(
      () => this.timeUpdate(this.audio.currentTime),
      this.timeUpdateInterval
    )
  }

  /**
   * Clear the interval for timeUpdate
   */
  stopWatchingTime () {
    this.log('stopping watching time')
    window.clearInterval(this.timeUpdateId)
    this.timeUpdateId = null
  }

  /**
   * @param {Number} pos
   */
  timeUpdate (pos) {
    this.lastPosition = pos

    this.checkTail(pos)

    if (!this.tailReached && ++this.timeUpdateCount >= this.saveTimeCount) {
      this.timeUpdateCount = 0
      this.emit('timeUpdate', { name: this.src, pos: pos })
    }
  }

  /**
   * Check if position has reached tail and emit event if so
   *
   * @param {Number} pos
   */
  checkTail (pos) {
    if (this.tailReached) {
      return
    }

    const tailPos = this.audio.duration - this.tailOffset
    if (pos >= tailPos) {
      this.tailReached = true
      this.stopWatchingTime()
      this.emit('tail', { overshoot: pos - tailPos })
    }
  }

  /**
   * @param {String} message
   */
  log (message) {
    console.log(`Block ${this.src}: ${message}`)
  }
}

export default Block
