import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseOldPaletteChunk extends AseBase {
  protected colors: [number, number, number][] = []

  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const chunkSize = writer.writeDword(0) // Size of the file (will be updated later)
    writer.writeWord(0x0004) // Chunk type
    writer.writeWord(1) // Number of packets
    writer.writeByte(0) // Number of palette entries to skip from the last packet (start from 0)
    writer.writeByte(this.colors.length) // Number of colors in the packet (0 means 256)
    for (let i = 0; i < this.colors.length; i++) {
      const [red, green, blue] = this.colors[i]
      writer.writeByte(red) // Red (0-255)
      writer.writeByte(green) // Green (0-255)
      writer.writeByte(blue) // Blue (0-255)
    }

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }

  addColor(red: number, green: number, blue: number): void {
    this.colors.push([red, green, blue])
  }
}
