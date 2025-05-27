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

    /*
    NOTE.3
    Uncompressed Image: Uncompressed ("raw") images inside .aseprite files are saved row by row from top to bottom, and for each row/scanline, pixels are from left to right. Each pixel is a PIXEL (or a TILE in the case of tilemaps) as defined in the References section (so the number and order of bytes depends on the color mode of the image/sprite, or the tile format). Generally you'll not find uncompressed images in .aseprite files (only in very old .aseprite files).
    */

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = (j * width + i) * 4
        const red = this.imageData.data[index]
        const green = this.imageData.data[index + 1]
        const blue = this.imageData.data[index + 2]
        const alpha = this.imageData.data[index + 3]

        writer.writePixel(red, green, blue, alpha) // Pixel data (RGBA)
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
