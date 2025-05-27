import { BinaryReader } from './BinaryReader'

export function decompileAseFile(arrayBuffer: ArrayBuffer, log: (message: string) => void) {
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

  log('<hr/>')

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

  log('<hr/>')

  for (let i = 0; i < newChunkCount; i++) {
    // Chunk
    log('Aseprite File Chunk')
    const chunkSize = reader.readDword()
    log('Chunk Size: ' + chunkSize)
    const chunkType = reader.readWord()
    log('Chunk Type: ' + chunkType.toString(16))

    if (chunkType == 0x2007) {
      // Layer Chunk
      log('Layer Type: ' + reader.readWord())
      log('Layer Flags: ' + reader.readWord())
      log('Fixed Gamma: ' + reader.readFixed())
      log('Reserved: ' + Array.from({ length: 8 }, () => reader.readByte()).join(', '))
    } else if (chunkType == 0x0004) {
      // Old Palette Chunk
      const packetCount = reader.readWord()
      log('Number of Packets: ' + packetCount)
      for (let j = 0; j < packetCount; j++) {
        const skipEntries = reader.readByte()
        const colorCount = reader.readByte()
        log(`Skip Entries: ${skipEntries}`)
        log(`Color Count: ${colorCount}`)
        for (let k = 0; k < (colorCount === 0 ? 256 : colorCount); k++) {
          const red = reader.readByte()
          const green = reader.readByte()
          const blue = reader.readByte()
          log(`Color ${k + 1}: R: ${red}, G: ${green}, B: ${blue}`)
        }
      }
    } else {
      reader.incrementOffset(chunkSize - 6)
    }
    log('<hr/>')
  }
}
