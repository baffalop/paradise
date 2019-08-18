import Block from 'block'

const audio = {
  playerOpts: {
    skip: 10,
    tailOvershootThreshold: 0.5,
  },
  basePath: '../www/dummy/audio/',
  intro: new Block('intro', 2.5),
  ending: new Block('ending', 0),
  blocks: [
    new Block('ficus', 9.0),
  ],
  playlistLength: 3,
}

audio.intro.basePath = audio.basePath
audio.ending.basePath = audio.basePath
audio.blocks.map(block => block.basePath = audio.basePath)

export { audio }
