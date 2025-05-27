import { DynamicBinaryWriter } from '../DynamicBinaryWriter'
import { AseBase } from './AseBase'

export class AseFrame extends AseBase {
  override writeContent(): [DynamicBinaryWriter, number] {
    const writer = new DynamicBinaryWriter()

    const chunkSize = this.children.length

    const frameSize = writer.writeDword(0) // Frame size (will be updated later)
    writer.writeWord(0xf1fa) // Magic number
    writer.writeWord(chunkSize) // Old field which specifies the number of "chunks" in this frame
    writer.writeWord(100) // Frame duration
    writer.writeBytes(new Array(2).fill(0)) // For future (set to zero)
    writer.writeDword(chunkSize) // New field which specifies the number of "chunks" in this frame

    let totalSize = 0
    for (const child of this.children) {
      const [writer, size] = child.writeContent()
      writer.copyFrom(writer)

      totalSize += size
    }

    const size = totalSize + writer.getSize()
    frameSize.withValue(size)

    return [writer, size]
  }
}
