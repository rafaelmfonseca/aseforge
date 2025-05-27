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
