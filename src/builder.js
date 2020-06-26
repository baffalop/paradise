import Block from './block'

class BlockBuilder {
  /**
   * @param {string[]} blockData
   * @param {number} index
   * @param {number} position
   */
  constructor (blockData, index = 0, position = 0) {
    this.playlist = blockData
    this.index = index
    this.position = position
  }

  /**
   * @param {{dir: string, tail: number}} opts
   *
   * @returns {Block[]}
   */
  build ({dir, tail}) {
    const blocks = this.playlist.slice(this.index).map(
      src => new Block(dir, src, tail)
    )

    if (this.position !== 0) {
      blocks[0].setStartFrom(this.position)
    }

    return blocks
  }
}

export default BlockBuilder
