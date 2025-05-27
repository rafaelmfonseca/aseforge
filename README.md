# Aseprite File Studies

This is a **study project** to help me understand and experiment with the Aseprite `.aseprite` file format using TypeScript.
It is **not a production-ready tool**—just a learning playground for parsing and generating Aseprite files in the browser.

---

## What does it do?

- **Reads and decompiles** `.aseprite` files using modular TypeScript classes for each file chunk.
- **Allows basic editing** of chunks (like adding colors or layers) and exporting the result.
- **Runs in the browser** with a minimal web interface (two buttons: decompile file or download binary).

---

## How to use

1. **Clone the repo and install dependencies:**

   ```sh
   git clone https://github.com/rafaelmfonseca/aseforge
   cd aseforge
   npm install
   ```

2. **Run locally:**

   ```sh
   npm run dev
   ```

   Open your browser to the local dev server (e.g., [http://localhost:5173](http://localhost:5173)).

3. **Try the demo buttons** to load or save a `.aseprite` file (see `src/main.ts` for details).

---

## Credits

- [Aseprite](https://www.aseprite.org/) for documentation
