import Eventful from 'events'

/**
 * @type {Block}
 * @mixes Eventful
 */
const Block = class {
  /**
   * @param {string} src
   * @param {number} tail
   */
  constructor (src, tail) {
    this.src = src
    this.tailPos = tail
    this.tailReached = false
    this.basePath = ''
  }

  /**
   * Initialise media
   */
  start () {
    this.media = new Media(
      this.basePath + this.src,
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

    this.media.pause()
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
      this.media.seekTo(newPos * 1000)
      this.emit('skipped')
    })
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
      100
    )
  }

  /**
   * @param {Number} pos
   */
  timeUpdate (pos) {
    if (!this.tailReached && pos >= this.media.getDuration() - this.tailPos) {
      this.tailReached = true
      this.emit('tail')
    }
  }

  /**
   * @param {String} message
   */
  log (message) {
    console.log(`Block ${this.src}: ${message}`)
  }
}

Object.assign(Player.prototype, Eventful)

export default Block
