import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseCelChunk extends AseBase {
  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const chunkSize = writer.writeDword(0) // Size of the file (will be updated later)
    writer.writeWord(0x2005) // Chunk type
    writer.writeWord(0) // Layer index
    writer.writeShort(0) // X position
    writer.writeShort(0) // Y position
    writer.writeByte(255) // Opacity level (255 = fully opaque)
    writer.writeWord(0) // Cel Type (0 = Raw Image Data, unused)
    writer.writeShort(0) // Z-Index (0 = default layer ordering)
    writer.writeBytes(new Array(5).fill(0)) // Reserved bytes (set to zero)
    // For cel type = 0 (Raw Image Data)
    writer.writeWord(20) // Width in pixels
    writer.writeWord(20) // Height in pixels
    for (let i = 0; i < 20 * 20; i++) {
      writer.writePixel(0, 0, 255, 255) // Pixel data (RGBA)
    }

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }
}

/*
Cel Chunk (0x2005)
This chunk determine where to put a cel in the specified layer/frame.

WORD        Layer index (see NOTE.2)
SHORT       X position
SHORT       Y position
BYTE        Opacity level
WORD        Cel Type
            0 - Raw Image Data (unused, compressed image is preferred)
            1 - Linked Cel
            2 - Compressed Image
            3 - Compressed Tilemap
SHORT       Z-Index (see NOTE.5)
            0 = default layer ordering
            +N = show this cel N layers later
            -N = show this cel N layers back
BYTE[5]     For future (set to zero)
+ For cel type = 0 (Raw Image Data)
  WORD      Width in pixels
  WORD      Height in pixels
  PIXEL[]   Raw pixel data: row by row from top to bottom,
            for each scanline read pixels from left to right.
+ For cel type = 1 (Linked Cel)
  WORD      Frame position to link with
+ For cel type = 2 (Compressed Image)
  WORD      Width in pixels
  WORD      Height in pixels
  PIXEL[]   "Raw Cel" data compressed with ZLIB method (see NOTE.3)
+ For cel type = 3 (Compressed Tilemap)
  WORD      Width in number of tiles
  WORD      Height in number of tiles
  WORD      Bits per tile (at the moment it's always 32-bit per tile)
  DWORD     Bitmask for tile ID (e.g. 0x1fffffff for 32-bit tiles)
  DWORD     Bitmask for X flip
  DWORD     Bitmask for Y flip
  DWORD     Bitmask for diagonal flip (swap X/Y axis)
  BYTE[10]  Reserved
  TILE[]    Row by row, from top to bottom tile by tile
            compressed with ZLIB method (see NOTE.3)
*/
