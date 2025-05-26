// https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

import { BinaryReader } from './BinaryReader'
import { BinaryWriter } from './BinaryWriter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="logs">
  </div>
`

const logs = document.querySelector<HTMLDivElement>('#logs')!

function log(message: string) {
  const p = document.createElement('p')
  p.textContent = message
  logs.appendChild(p)
}

const writer = new BinaryWriter()

writer.writeDword(0)
writer.writeWord(0xa5e0) // Magic number
writer.writeWord(1) // Frames
writer.writeWord(20) // Width in pixels
writer.writeWord(20) // Height in pixels
writer.writeWord(32) // Color depth (bits per pixel)
writer.writeDword(1) // Flags (layer opacity has valid value)
writer.writeWord(100) // Speed (milliseconds between frame)
writer.writeDword(0) // Set be 0
writer.writeDword(0) // Set be 0
writer.writeByte(0) // Palette entry for transparent color
writer.writeBytes(new Uint8Array(3)) // Set to zero (ignore bytes)
writer.writeWord(33) // Number of colors (0 means 256 for old sprites)
writer.writeByte(1) // Pixel width (pixel ratio is "pixel width/pixel height")
writer.writeByte(1) // Pixel height
writer.writeShort(0) // X position of the grid
writer.writeShort(0) // Y position of the grid
writer.writeWord(16) // Grid width (zero if there is no grid)
writer.writeWord(16) // Grid height (zero if there is no grid)
writer.writeBytes(new Uint8Array(84)) // For future (set to zero)

const reader = new BinaryReader(writer.getArrayBuffer())

// Header
log('Aseprite File Header')
log('FileSize: ' + reader.readDword())
log('Magic: ' + reader.readWord().toString(16))
log('Frames: ' + reader.readWord())
log('Width: ' + reader.readWord())
log('Height: ' + reader.readWord())
log('ColorDepth: ' + reader.readWord())
log('Flags: ' + reader.readDword())
log('Speed: ' + reader.readWord())
log('Ignore Bytes: ' + reader.readDword() + ', ' + reader.readDword())
log('Palette Index Transparent Color: ' + reader.readByte())
log('Ignore Bytes: ' + reader.readByte() + ', ' + reader.readByte() + ', ' + reader.readByte())
log('Number of Colors: ' + reader.readWord())
log('Pixel Width: ' + reader.readByte())
log('Pixel Height: ' + reader.readByte())
log('Grid X Position: ' + reader.readShort())
log('Grid Y Position: ' + reader.readShort())
log('Grid Width: ' + reader.readWord())
log('Grid Height: ' + reader.readWord())
log('Future Bytes: ' + Array.from({ length: 84 }, () => reader.readByte()).join(', '))
