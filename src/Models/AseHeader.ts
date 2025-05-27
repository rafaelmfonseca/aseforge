import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseHeader extends AseBase {
  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const fileSize = writer.writeDword(0) // Size of the file (will be updated later)
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
    writer.writeBytes(new Array(3).fill(0)) // Set to zero (ignore bytes)
    writer.writeWord(33) // Number of colors (0 means 256 for old sprites)
    writer.writeByte(1) // Pixel width (pixel ratio is "pixel width/pixel height")
    writer.writeByte(1) // Pixel height
    writer.writeShort(0) // X position of the grid
    writer.writeShort(0) // Y position of the grid
    writer.writeWord(16) // Grid width (zero if there is no grid)
    writer.writeWord(16) // Grid height (zero if there is no grid)
    writer.writeBytes(new Array(84).fill(0)) // For future (set to zero)

    let totalSize = 0
    for (const child of this.children) {
      const [childrenWriter, size] = child.writeContent()
      writer.copyFrom(childrenWriter)

      totalSize += size
    }

    const size = totalSize + writer.getSize()
    fileSize.withValue(size)

    return [writer, size]
  }
}
