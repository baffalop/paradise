import Block from 'block'

const audio = {
  playerOpts: {
    skip: 10,
    tailOvershootThreshold: 0.5,
  },
  basePath: '../www/dummy/audio/',
  intro: new Block('intro.mp3', 2.5),
  conclusion: new Block('ficus.mp3', 0),
  blocks: [
    new Block('ficus.mp3', 9.0),
  ],
  playlistLength: 3,
}

audio.intro.basePath = audio.basePath
audio.conclusion.basePath = audio.basePath
audio.blocks.map(block => block.basePath = audio.basePath)

export { audio }
