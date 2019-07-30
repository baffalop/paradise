const Block = class {
  /**
   * @param {string} src
   * @param {number} tail
   */
  constructor (src, tail) {
    this.src = src
    this.tail = tail
  }

  start (
    next,
    ended
  ) {
    this.next = next
    this.ended = ended

    this.media = new Media(
      this.basePath + this.src,
      () => {
        console.log(`${this.src}: initialised`)
      },
      e => {
        console.log(`${this.src}: error: ${e.message}`)
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
        this.interval = window.setInterval(
          () => this.media.getCurrentPosition(this.timeUpdate.bind(this)),
          100
        )
        break
      case Media.MEDIA_PAUSED:
        status = 'PAUSED'
        window.clearInterval(this.interval)
        break
      case Media.MEDIA_STOPPED:
        status = 'STOPPED'
        window.clearInterval(this.interval)
        this.media.release()
        this.ended()
        break
    }
    console.log(`${this.src}: status ${status}`)
  }

  timeUpdate (pos) {
    console.log(`${this.src}: position ${pos}`)
    if (this.next && pos >= this.media.getDuration() - this.tail) {
      this.next()
      this.next = null
    }
  }
}

export default Block
