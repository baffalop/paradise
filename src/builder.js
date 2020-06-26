import Block from './block'

class BlockBuilder {
  /**
   * @param {string[]} blockData
   * @param {number} position
   */
  constructor (blockData, position = 0) {
    this.blockData = blockData
    this.position = position
  }

  /**
   * @param {{dir: string, tail: number}} opts
   *
   * @returns {Block[]}
   */
  build ({dir, tail}) {
    const blocks = this.blockData.map(
      src => new Block(dir, src, tail)
    )

    if (this.position !== 0) {
      blocks[0].setStartFrom(this.position)
    }

    return blocks
  }
}

export default BlockBuilder
