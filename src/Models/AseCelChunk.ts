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
      writer.writePixel(123, 234, 75, 255) // Pixel data (RGBA)
    }

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }
}
