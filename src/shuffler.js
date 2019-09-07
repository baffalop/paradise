import BlockBuilder from 'builder'

class Shuffler {
  /**
   * @param {string} intro
   * @param {string} ending
   * @param {string} special
   * @param {Array<string>} pool
   */
  constructor ({intro, ending, special, pool}) {
    this.intro = intro
    this.ending = ending
    this.special = special
    this.pool = pool
  }

  /**
   * Build a playlist by selecting a specified number of blocks at random from the pool,
   * bookended by intro and ending
   *
   * @param {Number} playlistLength
   *
   * @returns {BlockBuilder}
   */
  shuffle (playlistLength) {
    const sequence = [this.intro]

    let targetLength = playlistLength - 2
    const indexOfSpecial = this.randomInt(targetLength - 1)

    while (targetLength-- > 0 && (this.pool.length > 0 || indexOfSpecial <= targetLength)) {
      if (targetLength === indexOfSpecial) {
        sequence.push(this.special)
        continue
      }

      const randomIndex = this.randomInt(this.pool.length)
      const selectedFragment = this.pool[randomIndex]
      sequence.push(selectedFragment)
      this.removeElementFromBlocks(randomIndex)
    }

    sequence.push(this.ending)

    return new BlockBuilder(sequence)
  }

  /**
   * @param {number} range
   */
  randomInt (range) {
    return Math.floor(Math.random() * range)
  }

  /**
   * @param {Number} i
   */
  removeElementFromBlocks (i) {
    this.pool = this.pool.slice(0, i).concat(this.pool.slice(i + 1, this.pool.length))
  }
}

export default Shuffler
