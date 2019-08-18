class Shuffler {
  /**
   * @param {Block} intro
   * @param {Block} ending
   * @param {Array<Block>} blocks
   */
  constructor ({intro, ending, blocks}) {
    this.intro = intro
    this.ending = ending
    this.pool = blocks
  }

  /**
   * Build a playlist by selecting a specified number of blocks at random from the pool,
   * bookended by intro and ending
   *
   * @param {Number} playlistLength
   *
   * @returns {Block[]}
   */
  shuffle (playlistLength) {
    const playlist = [this.intro]

    let targetLength = playlistLength - 2
    while (targetLength-- > 0 && this.pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.pool.length)
      const selectedBlock = this.pool[randomIndex]
      playlist.push(selectedBlock)
      this.removeElementFromBlocks(randomIndex)
    }

    playlist.push(this.ending)
    return playlist
  }

  /**
   * @param {Number} i
   */
  removeElementFromBlocks (i) {
    this.pool = this.pool.slice(0, i).concat(this.pool.slice(i + 1, this.pool.length))
  }
}

export default Shuffler
