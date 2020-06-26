import BlockBuilder from './builder'

const KEY_PREFIX = 'para_'
const PLAYLIST_KEY = KEY_PREFIX + 'playlist'
const POSITION_KEY = KEY_PREFIX + 'position'
const INDEX_KEY = KEY_PREFIX + 'index'

class Store {
  constructor () {
    this.storage = window.localStorage
  }

  /**
   * @param {string[]} playlist
   * @param {number} index
   * @param {number} pos
   */
  savePlaylist (playlist, index = 0, pos = 0) {
    if (playlist.length === 0) {
      this.log('No savable state. Clearing storage.')
      this.clearPlaylist()
      return
    }

    this.savePosition(pos)
    this.saveIndex(index)
    this.storage.setItem(PLAYLIST_KEY, JSON.stringify(playlist))

    this.log(`saved playlist [${this.seqToString(playlist)}]`)
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

    this.storage.setItem(POSITION_KEY, position.toString())
    this.log(`saved position: ${position}`)
  }

  /**
   * @param {Number} index
   */
  saveIndex (index) {
    if (index < 0) {
      this.log('not saving negative index')
      return
    }

    this.storage.setItem(INDEX_KEY, index.toString())
    this.log(`saved position: ${index}`)
  }

  clearPosition () {
    this.storage.removeItem(POSITION_KEY)
    this.log('cleared position')
  }

  clearIndex () {
    this.storage.removeItem(INDEX_KEY)
    this.log('cleared index')
  }

  clearPlaylist () {
    this.storage.removeItem(PLAYLIST_KEY)
    this.storage.removeItem(POSITION_KEY)
    this.storage.removeItem(INDEX_KEY)
    this.log('cleared playlist')
  }

  /**
   * Retrieve data saved in localstorage if it exists, and hydrate an array of Blocks to pass in to Player.
   * Return null if no saved data found or data is bad.
   *
   * @returns {BlockBuilder}
   */
  retrievePlaylist () {
    const playlistData = this.storage.getItem(PLAYLIST_KEY)
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
    const index = this.retrieveIndex()

    this.log(`retrieved playlist [${this.seqToString(playlist)}]: index ${index}, position ${position}`)

    return new BlockBuilder(playlist, index, position)
  }

  /**
   * @returns {number}
   */
  retrievePosition () {
    const position = this.storage.getItem(POSITION_KEY)
    if (position === null || position === '') return 0
    return parseFloat(position)
  }

  /**
   * @returns {number}
   */
  retrieveIndex () {
    const index = this.storage.getItem(INDEX_KEY)
    if (index === null || index === '') return 0
    return parseInt(index)
  }

  /**
   * @param {String} message
   */
  log (message) {
    console.log(`Store: ${message}`)
  }
}

export default Store
