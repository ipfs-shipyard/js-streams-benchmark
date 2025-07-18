import { Readable, Writable } from 'node:stream'
import { pipe } from 'it-pipe'

const ITERATIONS = 1_000

function createData () {
  return new Array(1024).fill(0).map(() => new Uint8Array(1024))
}

async function nodeStreams () {
  const data = createData()
  const output = []

  await new Promise((resolve, reject) => {
    const readable = Readable.from(data)
    const writable = new Writable({
      write: (chunk, enc, cb) => {
        output.push(chunk)
        cb()
      }
    })
    writable.on('finish', () => {
      if (output.length !== data.length) {
        reject(new Error('Short read'))
        return
      }

      resolve()
    })

    readable.pipe(writable)
  })
}

async function nodeStreamsAsWebStreams () {
  const data = createData()
  const output = []

  const readable = Readable.from(data)
  const writable = new Writable({
    write: (chunk, enc, cb) => {
      output.push(chunk)
      cb()
    }
  })

  const readableWeb = Readable.toWeb(readable)
  const writableWeb = Writable.toWeb(writable)

  await readableWeb.pipeTo(writableWeb)

  if (output.length !== data.length) {
    throw new Error('Short read')
  }
}

async function webStreams (readableOpts = {}) {
  const data = createData()
  const output = []

  let index = 0
  const readable = new ReadableStream({
    pull: (controller) => {
      if (index === data.length) {
        controller.close()
        return
      }

      controller.enqueue(data[index])
      index++
    },
    ...readableOpts
  })

  const writable = new WritableStream({
    write: (chunk) => {
      output.push(chunk)
    }
  })

  await readable.pipeTo(writable)

  if (output.length !== data.length) {
    throw new Error('Short read')
  }
}

async function webByteStreams () {
  await webStreams({ type: 'bytes' })
}

async function itDuplex () {
  const data = createData()
  const output = []

  const it = {
    source: async function * () {
      yield * data
    }(),
    sink: async (source) => {
      for await (const buf of source) {
        output.push(buf)
      }
    }
  }

  await pipe(it, it)

  if (output.length !== data.length) {
    throw new Error('Short read')
  }
}

async function nodeStreamsAsItDuplex () {
  const data = createData()
  const output = []

  const readable = Readable.from(data)
  const writable = new Writable({
    write: (chunk, enc, cb) => {
      output.push(chunk)
      cb()
    }
  })

  const it = {
    source: readable,
    sink: async (source) => {
      for await (const buf of source) {
        const writeMore = writable.write(buf)

        if (!writeMore) {
          await new Promise((resolve) => {
            writable.once('drain', () => {
              resolve()
            })
          })
        }
      }
    }
  }

  await pipe(it, it)

  if (output.length !== data.length) {
    throw new Error('Short read')
  }
}

async function webStreamsAsItDuplex (readableOpts = {}) {
  const data = createData()
  const output = []

  let index = 0
  const readable = new ReadableStream({
    pull: (controller) => {
      if (index === data.length) {
        controller.close()
        return
      }

      controller.enqueue(data[index])
      index++
    },
    ...readableOpts
  })

  const writable = new WritableStream({
    write: (chunk) => {
      output.push(chunk)
    }
  })

  const it = {
    source: async function * () {
      const reader = readable.getReader()
      let next = await reader.read()

      while (next.done !== true) {
        yield next.value

        next = await reader.read()
      }
    }(),
    sink: async (source) => {
      const writer = writable.getWriter()

      for await (const buf of source) {
        await writer.ready
        await writer.write(buf)
      }

      await writer.close()
    }
  }

  await pipe(it, it)

  if (output.length !== data.length) {
    throw new Error('Short read')
  }
}

async function webByteStreamsAsItDuplex () {
  await webStreamsAsItDuplex({ type: 'bytes'})
}

async function eventTarget () {
  const data = createData()
  const output = []

  await new Promise((resolve, reject) => {
    const readable = new EventTarget()

    readable.addEventListener('data', (evt) => {
      output.push(evt.detail)

      if (output.length === data.length) {
        resolve()
        return
      }
    })

    for (const buf of data) {
      readable.dispatchEvent(new CustomEvent('data', {
        detail: buf
      }))
    }
  })
}

const tests = {
  'node streams': nodeStreams,
  'node streams as web streams': nodeStreamsAsWebStreams,
  'web streams': webStreams,
  'web byte streams': webByteStreams,
  'duplex async iterators': itDuplex,
  'node streams as duplex async iterator': nodeStreamsAsItDuplex,
  'web streams as duplex async iterator': webStreamsAsItDuplex,
  'web byte streams as duplex async iterator': webByteStreamsAsItDuplex,
  'event target': eventTarget
}

// warmup
for (const [name, test] of Object.entries(tests)) {
  for (let i = 0; i < ITERATIONS; i++) {
    await test()
  }
}

const results = []

// test
for (const [name, test] of Object.entries(tests)) {
  const start = Date.now()

  for (let i = 0; i < ITERATIONS; i++) {
    await test()
  }

  const time = Date.now() - start

  results.push({
    'Name': name,
    'Time': time,
    'Ops/s': time/ITERATIONS
  })
}

// print results
console.table(results.sort((a, b) => {
  if (a.Time < b.Time) {
    return -1
  }

  if (a.Time > b.Time) {
    return 1
  }

  return 0
}))
