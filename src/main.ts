// https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

import { BinaryReader } from './BinaryReader'
import { BinaryWriter } from './BinaryWriter'
import { decompileAseFile } from './page1'
import { loadFile } from './utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="dislay: flex; flex-direction: column; gap: 10px;">
    <button id="decompileAseFile">Decompile Aseprite File</button>
    <button id="decompileBinFile">Decompile Binary File</button>
  </div>
  <div id="logs"></div>
`

const logs = document.querySelector<HTMLDivElement>('#logs')!

function log(message: string) {
  const p = document.createElement('p')
  p.innerHTML = message
  p.style.lineHeight = '0.4'
  logs.appendChild(p)
}

const writer = new BinaryWriter()

// Header
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

const chunkSize = 4

// Frames
writer.writeDword(0) // Frame size
writer.writeWord(0xf1fa) // Magic number
writer.writeWord(chunkSize) // Old field which specifies the number of "chunks" in this frame
writer.writeWord(100) // Frame duration
writer.writeBytes(new Uint8Array(2)) // For future (set to zero)
writer.writeDword(chunkSize) // New field which specifies the number of "chunks" in this frame

document
  .querySelector<HTMLButtonElement>('#decompileBinFile')!
  .addEventListener('click', async () => {
    logs.innerHTML = ''
    const arrayBuffer = writer.getArrayBuffer()
    decompileAseFile(arrayBuffer, log)
  })

document
  .querySelector<HTMLButtonElement>('#decompileAseFile')!
  .addEventListener('click', async () => {
    logs.innerHTML = ''
    const file = await loadFile('sample.aseprite')
    const arrayBuffer = await file.arrayBuffer()
    decompileAseFile(arrayBuffer, log)
  })
