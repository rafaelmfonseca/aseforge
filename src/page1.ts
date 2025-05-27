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
  const headerFlag = reader.readDword()
  log('Flags: ' + headerFlag)
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
    } else if (chunkType == 0x2004) {
      log('Layer Flags: ' + reader.readWord())
      const layerType = reader.readWord()
      log('Layer Type: ' + layerType)
      log('Layer Child Level: ' + reader.readWord())
      log('Default Layer Width: ' + reader.readWord())
      log('Default Layer Height: ' + reader.readWord())
      log('Blend Mode: ' + reader.readWord())
      log('Opacity: ' + reader.readByte())
      log('Reserved: ' + Array.from({ length: 3 }, () => reader.readByte()).join(', '))
      log('Layer Name: ' + reader.readString())
      if (layerType === 2) {
        log('Tileset Index: ' + reader.readDword())
      }
      if (headerFlag & 0x10) {
        log('Layer UUID: ' + reader.readUuid())
      }
    } else {
      reader.incrementOffset(chunkSize - 6)
    }
    log('<hr/>')
  }
}

/*
Layer Chunk (0x2004)
In the first frame should be a set of layer chunks to determine the entire layers layout:

WORD        Flags:
              1 = Visible
              2 = Editable
              4 = Lock movement
              8 = Background
              16 = Prefer linked cels
              32 = The layer group should be displayed collapsed
              64 = The layer is a reference layer
WORD        Layer type
              0 = Normal (image) layer
              1 = Group
              2 = Tilemap
WORD        Layer child level (see NOTE.1)
WORD        Default layer width in pixels (ignored)
WORD        Default layer height in pixels (ignored)
WORD        Blend mode (see NOTE.6)
              Normal         = 0
              Multiply       = 1
              Screen         = 2
              Overlay        = 3
              Darken         = 4
              Lighten        = 5
              Color Dodge    = 6
              Color Burn     = 7
              Hard Light     = 8
              Soft Light     = 9
              Difference     = 10
              Exclusion      = 11
              Hue            = 12
              Saturation     = 13
              Color          = 14
              Luminosity     = 15
              Addition       = 16
              Subtract       = 17
              Divide         = 18
BYTE        Opacity (see NOTE.6)
BYTE[3]     For future (set to zero)
STRING      Layer name
+ If layer type = 2
  DWORD     Tileset index
+ If file header flags have bit 4:
  UUID      Layer's universally unique identifier
*/
