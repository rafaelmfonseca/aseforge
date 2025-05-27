export class BinaryWriter {
  private buffer: Uint8Array
  private offset: number

  public constructor(initialSize: number = 32) {
    this.buffer = new Uint8Array(initialSize)
    this.offset = 0
  }

  private ensureCapacity(additionalBytes: number) {
    const required = this.offset + additionalBytes
    if (required > this.buffer.length) {
      let newSize = this.buffer.length * 2
      while (newSize < required) newSize *= 2
      const newBuffer = new Uint8Array(newSize)
      newBuffer.set(this.buffer.subarray(0, this.offset))
      this.buffer = newBuffer
    }
  }

  // DWORD: A 32-bit unsigned integer value (little-endian)
  public writeDword(value: number): number {
    this.ensureCapacity(4)
    this.buffer[this.offset++] = value & 0xff
    this.buffer[this.offset++] = (value >> 8) & 0xff
    this.buffer[this.offset++] = (value >> 16) & 0xff
    this.buffer[this.offset++] = (value >> 24) & 0xff
    return this.offset - 4
  }

  // WORD: A 16-bit unsigned integer value (little-endian)
  public writeWord(value: number): number {
    this.ensureCapacity(2)
    this.buffer[this.offset++] = value & 0xff
    this.buffer[this.offset++] = (value >> 8) & 0xff
    return this.offset - 2
  }

  // SHORT: A 16-bit signed integer value (little-endian)
  public writeShort(value: number): number {
    this.ensureCapacity(2)
    const val = value < 0 ? value + 0x10000 : value
    this.buffer[this.offset++] = val & 0xff
    this.buffer[this.offset++] = (val >> 8) & 0xff
    return this.offset - 2
  }

  // FIXED: A 32-bit fixed point (16.16) value
  public writeFixed(value: number): number {
    this.ensureCapacity(4)
    const fixedValue = Math.round(value * 65536) // Convert to fixed point
    this.buffer[this.offset++] = fixedValue & 0xff
    this.buffer[this.offset++] = (fixedValue >> 8) & 0xff
    this.buffer[this.offset++] = (fixedValue >> 16) & 0xff
    this.buffer[this.offset++] = (fixedValue >> 24) & 0xff
    return this.offset - 4
  }

  // BYTE: An 8-bit unsigned integer value
  public writeByte(value: number): number {
    this.ensureCapacity(1)
    this.buffer[this.offset++] = value & 0xff
    return this.offset - 1
  }

  // BYTE[n]: "n" bytes.
  public writeBytes(data: Uint8Array): number {
    this.ensureCapacity(data.length)
    this.buffer.set(data, this.offset)
    this.offset += data.length
    return this.offset - data.length
  }

  // STRING:
  // WORD: string length (number of bytes)
  // BYTE[length]: characters (in UTF-8) The '\0' character is not included.
  public writeString(value: string): number {
    const utf8Encoder = new TextEncoder()
    const encoded = utf8Encoder.encode(value)
    const length = encoded.length
    this.ensureCapacity(2 + length) // 2 bytes for length + actual string bytes
    this.writeWord(length) // Write the length
    this.writeBytes(encoded) // Write the string bytes
    return this.offset - (2 + length)
  }

  // PIXEL: One pixel, depending on the image pixel format:
  // RGBA: BYTE[4], each pixel have 4 bytes in this order Red, Green, Blue, Alpha.
  public writePixel(r: number, g: number, b: number, a: number): number {
    this.ensureCapacity(4)
    this.buffer[this.offset++] = r & 0xff
    this.buffer[this.offset++] = g & 0xff
    this.buffer[this.offset++] = b & 0xff
    this.buffer[this.offset++] = a & 0xff
    return this.offset - 4
  }

  // Get current write offset (used to compute sizes)
  public getLength(): number {
    return this.offset
  }

  getArrayBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.offset).buffer
  }
}
