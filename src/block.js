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

  start (upstream) {
    this.upstream = upstream

    this.media = new Media(
      this.basePath + this.src,
      () => {
        this.log(`initialised`)
      },
      e => {
        this.log('error initialising')
        this.log(e)
      },
      this.statusUpdate.bind(this)
    )
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
        window.clearInterval(this.interval)
        this.emit('paused')
        break
      case Media.MEDIA_STOPPED:
        status = 'STOPPED'
        window.clearInterval(this.interval)
        this.media.release()
        this.emit('end')
        break
    }
    this.log(`status ${status}`)
  }

  watchTime() {
    this.interval = window.setInterval(
      () => this.media.getCurrentPosition(this.timeUpdate.bind(this)),
      100
    )
  }

  timeUpdate (pos) {
    if (!this.tailReached && pos >= this.media.getDuration() - this.tailPos) {
      this.tailReached = true
      this.emit('tail')
    }
  }

  /**
   * Emit an event to be caught by upstream object (ie. Player)
   *
   * @param {String} type
   * @param {Object} data
   */
  emit (type, data = {}) {
    this.upstream.receive(type, this, data)
  }

  log (message) {
    console.log(`Block ${this.src}: ${message}`)
  }
}

export default Block
