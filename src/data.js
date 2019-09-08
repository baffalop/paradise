const audio = {
  playerOpts: {
    skip: 10,
    tailOvershootThreshold: 0.5,
  },

  fragments: {
    intro: 'intro',
    ending: 'exlibris',
    special: 'urinals',
    pool: [
      'ficus'
    ],
  },

  blockOpts: {
    dir: window.audioBasePath,
    tail: 3,
  },

  playlistLength: 4,
}

export { audio }
