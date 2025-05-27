import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseColorProfileChunk extends AseBase {
  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const chunkSize = writer.writeDword(0) // Size of the file (will be updated later)
    writer.writeWord(0x2007) // Chunk type
    writer.writeWord(1) // Type: 1 - sRGB
    writer.writeWord(0) // Flags: 0 - no special gamma
    writer.writeFixed(0.0) // Fixed gamma: 1.0 = linear
    writer.writeBytes(new Array(8).fill(0)) // Reserved (set to zero)

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }
}
