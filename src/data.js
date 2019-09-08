const audio = {
  playerOpts: {
    skip: 10,
    tailOvershootThreshold: 0.5,
  },

  fragments: {
    intro: 'intro',
    ending: 'exlibris',
    special: 'urinal',
    pool: [
      'bathhouse',
      'biographies',
      'clocks',
      'duster',
      'faggot',
      'ficus',
      'futurelovers',
      'illustration',
      'mirror',
      'novels',
      'postcard',
      'spiderplant',
    ],
  },

  blockOpts: {
    dir: window.audioBasePath + 'audio/',
    tail: 3,
  },

  playlistLength: 8,
}

export { audio }
