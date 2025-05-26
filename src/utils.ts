export function loadFile(path: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error(`Failed to load file: ${xhr.statusText}`))
      }
    }
    xhr.onerror = function () {
      reject(new Error('Network error'))
    }
    xhr.send()
  })
}
