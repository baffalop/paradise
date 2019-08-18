import Player from 'player'
import Block from "block"

class Store {
  constructor () {
    this.storage = window.localStorage
  }

  /**
   * @param {Player} player
   */
  savePlaylist (player) {
    const playlist = player.seq

    if (player.playQueue.length > 0) {
      const current = player.playQueue[player.playQueue.length - 1]
      if (!current.tailReached) {
        playlist.unshift(current)
        this.savePosition(current.getLastPosition())
      } else {
        this.clearPosition()
      }
    }

    if (playlist.length === 0) {
      this.log('No savable state. Clearing storage.')
      this.clearPlaylist()
    }

    const savedPlaylist = playlist.map(block => block.getBlockParams())
    this.storage.setItem('playlist', JSON.stringify(savedPlaylist))
  }

  /**
   * @param {Number} position
   */
  savePosition (position) {
    this.storage.setItem('position', position.toString())
  }

  clearPosition () {
    this.storage.removeItem('position')
  }

  clearPlaylist () {
    this.storage.removeItem('playlist')
    this.storage.removeItem('position')
  }

  retrievePlaylist () {
    const playlistData = this.storage.getItem('playlist')
    if (playlistData === null || playlistData === '') {
      this.log('No stored data found')
      return null
    }

    let savedPlaylist = []
    try {
      savedPlaylist = JSON.parse(playlistData)
    } catch (e) {
      this.log(`Error parsing serialized playlist: ${e.message}`)
      return null
    }

    if (savedPlaylist.length === 0) {
      this.log('parsed JSON resulted in empty array (or something else)')
      return null
    }

    const playlist = []

    const position = this.retrievePosition()
    if (position !== 0) {
      let {src, tail} = savedPlaylist.shift()
      playlist.push(new Block(src, tail, position))
    }

    return playlist.concat(savedPlaylist.map(({src, tail}) => new Block(src, tail)))
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
