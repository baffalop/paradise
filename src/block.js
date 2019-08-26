import Eventful from 'eventful'

/**
 * Owns a single Media object, passes events to Player
 *
 * @type {Block}
 */
class Block extends Eventful {
  /**
   * @param {string} src
   * @param {number} tail
   */
  constructor (src, tail) {
    super()
    this.src = src
    this.tailOffset = tail

    this.dir = '../www/dummy/audio/'
    this.ext = '.mp3'

    this.startFrom = null
    this.tailReached = false
    this.overlapping = false
    this.lastPosition = 0

    this.timeUpdateInterval = 100
    this.timeUpdateCount = 0
    this.saveTimeCount = 1000 / this.timeUpdateInterval
  }

  /**
   * Initialise media
   */
  start () {
    this.log('starting')

    this.media = new Media(
      this.dir + this.src + this.ext,
      () => this.log('played through'),
      e => {
        this.log('error playing media')
        console.log(e)
      },
      this.statusUpdate.bind(this)
    )

    return this
  }

  play () {
    if (!this.media) {
      throw new Error('Media not started')
    }

    this.media.play()
  }

  pause () {
    if (!this.media) {
      throw new Error('Media not started')
    }

    this.media.getCurrentPosition(
      pos => {
        if (pos < 0) return
        this.lastPosition = pos
        this.emit('timeUpdate', {position: pos})
        this.media.pause()
      }
    )
  }

  stop () {
    this.media.stop()
  }

  /**
   * @param {Number} interval
   */
  skip (interval) {
    this.media.getCurrentPosition(pos => {
      const newPos = pos + interval
      this.log(`skipping from ${pos} to ${newPos}`)
      this.seekTo(newPos)
      this.checkTail(newPos)
    })
  }

  /**
   * @param {Number} pos
   */
  seekTo (pos) {
    this.media.seekTo(pos * 1000)
    this.emit('skipped')
  }

  /**
   * Set a position to skip to immediately on media running
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
      src: this.src,
      tail: this.tailOffset,
    }
  }

  /**
   * Callback for Media
   *
   * @param {Number} code
   */
  statusUpdate (code) {
    let status = '-'
    switch (code) {
      case Media.MEDIA_NONE:
        status = 'NONE'
        break
      case Media.MEDIA_STARTING:
        status = 'STARTING'
        break
      case Media.MEDIA_RUNNING:
        status = 'RUNNING'
        if (typeof this.startFrom === 'number') {
          this.seekTo(this.startFrom)
          this.startFrom = null
        }
        this.watchTime()
        this.emit('playing')
        break
      case Media.MEDIA_PAUSED:
        status = 'PAUSED'
        this.stopWatchingTime()
        this.emit('paused')
        break
      case Media.MEDIA_STOPPED:
        status = 'STOPPED'
        this.stopWatchingTime()
        this.media.release()
        this.emit('blockEnd')
        break
    }
    this.log(`status ${status}`)
  }

  /**
   * Start watching media's current time with timeUpdate
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

    this.timeUpdateId = window.setInterval(
      () => this.media.getCurrentPosition(this.timeUpdate.bind(this)),
      this.timeUpdateInterval
    )
  }

  /**
   * Clear the interval for timeUpdate
   */
  stopWatchingTime () {
    window.clearInterval(this.timeUpdateId)
  }

  /**
   * @param {Number} pos
   */
  timeUpdate (pos) {
    this.lastPosition = pos

    this.checkTail(pos)

    if (!this.tailReached && ++this.timeUpdateCount >= this.saveTimeCount) {
      this.timeUpdateCount = 0
      this.emit('timeUpdate', {position: pos})
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

    const tailPos = this.media.getDuration() - this.tailOffset
    if (pos >= tailPos) {
      this.tailReached = true
      this.stopWatchingTime()
      this.emit('tail', {overshoot: pos - tailPos})
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
