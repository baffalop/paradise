import Block from 'block'

const audio = {
  playerOpts: {
    skip: 10,
    tailOvershootThreshold: 0.5,
  },
  intro: new Block('intro', 6),
  ending: new Block('ending', 0),
  blocks: [
    new Block('ficus', 9.0),
  ],
  playlistLength: 3,
}

export { audio }
