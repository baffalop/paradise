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

  skip (interval) {
    this.media.getCurrentPosition(pos => {
      const newPos = pos + interval
      this.log(`skipping from ${pos} to ${newPos}`)
      if (newPos < 0) {
        this.emit('start')
        this.media.seekTo(0)
        return
      }
      this.media.seekTo(newPos * 1000)
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
        break
      case Media.MEDIA_PAUSED:
        status = 'PAUSED'
        window.clearInterval(this.interval)
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

  goToTail () {
    this.log('goToTail')
    const newPos = this.media.getDuration() - this.tailPos
    this.media.seekTo(newPos * 1000)
  }

  /**
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
