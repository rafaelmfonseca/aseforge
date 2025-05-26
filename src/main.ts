// https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

import { BinaryReader } from './BinaryReader'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="logs"></div>
`

const logs = document.querySelector<HTMLDivElement>('#logs')!

function log(message: string) {
  const p = document.createElement('p')
  p.textContent = message
  logs.appendChild(p)
}

function loadFile(path: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error(`Failed to load file: ${xhr.statusText}`))
      }
    }
    xhr.onerror = function () {
      reject(new Error('Network error'))
    }
    xhr.send()
  })
}

const file = await loadFile('sample.aseprite')
console.log('File loaded:', file)

const arrayBuffer = await file.arrayBuffer()

const reader = new BinaryReader(arrayBuffer)

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

// Frames
log('Aseprite File Frames')
log('Frame Size: ' + reader.readDword())
log('Magic: ' + reader.readWord().toString(16))
const oldChunkCount = reader.readWord()
log('Old Chunk Count: ' + oldChunkCount)
log('Frame Duration: ' + reader.readWord())
log('Future Bytes: ' + reader.readByte() + ', ' + reader.readByte())
const newChunkCount = reader.readDword()
log('New Chunk Count: ' + newChunkCount)

for (let i = 0; i < newChunkCount; i++) {
  // Chunk
  log('Aseprite File Chunk')
  const chunkSize = reader.readDword()
  log('Chunk Size: ' + chunkSize)
  const chunkType = reader.readWord()
  log('Chunk Type: ' + chunkType.toString(16))

  reader.incrementOffset(chunkSize - 6)
}
