import Player from 'player'

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

  /**
   * @param {String} message
   */
  log (message) {
    console.log(`Store: ${message}`)
  }
}

export default Store
