class Shuffler {
  /**
   * @param {Block} intro
   * @param {Block} conclusion
   * @param {Array<Block>} blocks
   */
  constructor ({intro, conclusion, blocks}) {
    this.intro = intro
    this.conclusion = conclusion
    this.pool = blocks
  }

  /**
   * Build a playlist by selecting a specified number of blocks at random from the pool,
   * bookended by intro and conclusion
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

    playlist.push(this.conclusion)
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
