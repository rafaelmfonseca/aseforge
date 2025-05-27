import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseLayerChunk extends AseBase {
  protected colors: [number, number, number][] = []

  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const chunkSize = writer.writeDword(0) // Size of the file (will be updated later)
    writer.writeWord(0x2004) // Chunk type
    writer.writeWord(15) // Layer flags
    writer.writeWord(0) // Layer type (0 = Normal)
    writer.writeWord(0) // Layer child level
    writer.writeWord(0) // Default layer width in pixels (ignored)
    writer.writeWord(0) // Default layer height in pixels (ignored)
    writer.writeWord(0) // Blend mode (0 = Normal)
    writer.writeByte(255) // Opacity (255 = fully opaque)
    writer.writeBytes(new Array(3).fill(0)) // Reserved bytes (set to zero)
    writer.writeString('Background') // Layer name

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }

  addColor(red: number, green: number, blue: number): void {
    this.colors.push([red, green, blue])
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

--

Aseprite File Chunk

Chunk Size: 34

Chunk Type: 2004

Layer Flags: 15

Layer Type: 0

Layer Child Level: 0

Default Layer Width: 0

Default Layer Height: 0

Blend Mode: 0

Opacity: 255

Reserved: 0, 0, 0

Layer Name: Background


*/
