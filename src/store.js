import BlockBuilder from './builder'

class Store {
  constructor () {
    this.storage = window.localStorage
  }

  /**
   * @param {Player} player
   */
  savePlaylist (player) {
    const playlist = player.getPlaylist().filter(block => !block.tailReached)

    if (playlist.length === 0) {
      this.log('No savable state. Clearing storage.')
      this.clearPlaylist()
      return
    }

    this.savePosition(playlist[0].getLastPosition())

    const savedPlaylist = playlist.map(block => block.getBlockParams().src)
    this.storage.setItem('playlist', JSON.stringify(savedPlaylist))

    this.log(`saved playlist [${this.seqToString(savedPlaylist)}]`)
  }

  /**
   * @param {string[]} seq
   *
   * @returns {string}
   */
  seqToString (seq) {
    return seq.join(', ')
  }

  /**
   * @param {Number} position
   */
  savePosition (position) {
    if (position < 0) {
      this.log('not saving negative position')
      return
    }

    this.storage.setItem('position', position.toString())
    this.log(`saved position: ${position}`)
  }

  clearPosition () {
    this.storage.removeItem('position')
    this.log('cleared position')
  }

  clearPlaylist () {
    this.storage.removeItem('playlist')
    this.storage.removeItem('position')
    this.log('cleared playlist')
  }

  /**
   * Retrieve data saved in localstorage if it exists, and hydrate an array of Blocks to pass in to Player.
   * Return null if no saved data found or data is bad.
   *
   * @returns {BlockBuilder}
   */
  retrievePlaylist () {
    const playlistData = this.storage.getItem('playlist')
    if (playlistData === null || playlistData === '') {
      this.log('No stored data found')
      return null
    }

    let playlist = []
    try {
      playlist = JSON.parse(playlistData)
    } catch (e) {
      this.log(`Error parsing serialized playlist: ${e.message}`)
      this.clearPlaylist()
      return null
    }

    if (playlist.length === 0) {
      this.log('parsed JSON resulted in empty array (or something else)')
      this.clearPlaylist()
      return null
    }

    const position = this.retrievePosition()

    this.log(`retrieved playlist [${this.seqToString(playlist)}]: position ${position}`)

    return new BlockBuilder(playlist, position)
  }

  /**
   * @returns {number}
   */
  retrievePosition () {
    const position = this.storage.getItem('position')
    if (position === null || position === '') return 0
    return parseFloat(position)
  }

  /**
   * @param {String} message
   */
  log (message) {
    console.log(`Store: ${message}`)
  }
}

export default Store
