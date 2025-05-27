import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseUserDataChunk extends AseBase {
  constructor(protected text: string) {
    super()
  }

  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const chunkSize = writer.writeDword(0) // Size of the chunk (will be updated later)
    writer.writeWord(0x2020) // Chunk type
    writer.writeDword(1) // User Data Flags
    writer.writeString(this.text) // User Data Text

    const size = writer.getSize()
    chunkSize.withValue(size)

    return [writer, size]
  }
}
