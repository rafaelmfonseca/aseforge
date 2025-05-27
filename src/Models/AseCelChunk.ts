import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseCelChunk extends AseBase {
  constructor(protected imageData: ImageData) {
    super()
  }

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
    const width = this.imageData.width
    const height = this.imageData.height

    writer.writeWord(width) // Width in pixels
    writer.writeWord(height) // Height in pixels

    const pixelData = this.imageData.data
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const red = pixelData[index]
        const green = pixelData[index + 1]
        const blue = pixelData[index + 2]
        const alpha = pixelData[index + 3]

        writer.writePixel(red, green, blue, alpha)
      }
    }

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }

  getImageWidth(): number {
    return this.imageData.width
  }

  getImageHeight(): number {
    return this.imageData.height
  }
}
