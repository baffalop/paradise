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

    this.basePath = '../www/dummy/audio/'
    this.ext = '.mp3'

    this.startFrom = null
    this.tailReached = false
    this.lastPosition = 0

    this.timeUpdateMillisecs = 100
    this.timeUpdateCount = 0
    this.saveTimeCount = 2000 / this.timeUpdateMillisecs
  }

  /**
   * Initialise media
   */
  start () {
    this.media = new Media(
      this.basePath + this.src + this.ext,
      () => {
        this.log(`initialised`)
      },
      e => {
        this.log('error initialising')
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

  /**
   * Determine whether interval to skip is within time bounds. If not, adjust the interval.
   * Call the callback with adjusted interval.
   *
   * @param {Number} interval
   * @param {Function} callback
   */
  maybeSkip (interval, callback) {
    this.media.getCurrentPosition(
      pos => callback(pos + interval < 0 ? -pos : interval)
    )
  }

  /**
   * @param {Number} interval
   */
  skip (interval) {
    this.media.getCurrentPosition(pos => {
      const newPos = pos + interval
      this.log(`skipping from ${pos} to ${newPos}`)
      this.seekTo(newPos)
      this.emit('skipped')
      this.checkTail(newPos)
    })
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
   * @param {Number} pos
   */
  seekTo (pos) {
    this.media.seekTo(pos * 1000)
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
        window.clearInterval(this.timeUpdateInterval)
        this.emit('paused')
        break
      case Media.MEDIA_STOPPED:
        status = 'STOPPED'
        window.clearInterval(this.timeUpdateInterval)
        this.media.release()
        this.emit('blockEnd')
        break
    }
    this.log(`status ${status}`)
  }

  /**
   * Start watching media's current time with timeUpdate
   */
  watchTime() {
    this.timeUpdateInterval = window.setInterval(
      () => this.media.getCurrentPosition(this.timeUpdate.bind(this)),
      this.timeUpdateMillisecs
    )
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
