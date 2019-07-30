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
    next = () => console.log(`${this.src}: NEXT`),
    ended = () => console.log(`${this.src}: ENDED`)
  ) {
    this.next = next
    this.ended = ended

    this.media = new Media(
      this.basePath + this.src,
      () => {
        console.log(`${this.src}: initialised`)
      },
      e => {
        console.log(`${this.src}: error`)
        console.log(e)
      },
      this.statusUpdate.bind(this)
    )

    this.play()
  }

  play () {
    if (!this.media) {
      throw new Error('Media not started')
    }

    this.media.play()
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
        this.media.getCurrentPosition(this.timeUpdate.bind(this))
        break
      case Media.MEDIA_STOPPED:
        status = 'STOPPED'
        this.media.release()
        this.ended()
        break
    }
    console.log(`${this.src}: status ${code}`)
  }

  timeUpdate (pos) {
    console.log(`${this.src}: position ${pos}`)
    if (pos >= this.media.getDuration() - this.tail) {
      this.next()
    }
  }
}

export default Block
