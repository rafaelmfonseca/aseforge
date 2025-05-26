export class DynamicBinaryWriter {
  public buffer: Array<{ size: number; value: number }> = []

  // WORD: A 16-bit unsigned integer value
  public writeWord(value: number): void {
    this.buffer.push({ size: 2, value: value & 0xffff })
  }
}

/*
Color Profile Chunk (0x2007)
Color profile for RGB or grayscale values.

WORD        Type
              0 - no color profile (as in old .aseprite files)
              1 - use sRGB
              2 - use the embedded ICC profile
WORD        Flags
              1 - use special fixed gamma
FIXED       Fixed gamma (1.0 = linear)
            Note: The gamma in sRGB is 2.2 in overall but it doesn't use
            this fixed gamma, because sRGB uses different gamma sections
            (linear and non-linear). If sRGB is specified with a fixed
            gamma = 1.0, it means that this is Linear sRGB.
BYTE[8]     Reserved (set to zero)
+ If type = ICC:
  DWORD     ICC profile data length
  BYTE[]    ICC profile data. More info: http://www.color.org/ICC1V42.pdf
  */
