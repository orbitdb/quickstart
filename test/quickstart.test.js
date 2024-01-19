import { startOrbitDB, stopOrbitDB, isBrowser } from '../src/index.js'
import { strictEqual, notStrictEqual, deepStrictEqual } from 'assert'
import { rimraf } from 'rimraf'
import connectIpfsNodes from './utils/connect-nodes.js'
import waitFor from './utils/wait-for.js'

describe('Starting OrbitDB', function () {
  it('starts OrbitDB with a preconfigured Helia instance', async () => {
    const orbitdb = await startOrbitDB({ directory: './ipfs' })
    const db1 = await orbitdb.open('db1')
    await db1.add('hello world!')

    deepStrictEqual((await db1.all()).map(e => e.value), ['hello world!'])

    await stopOrbitDB(orbitdb)
    await rimraf('./orbitdb')
    await rimraf('./ipfs')
  })
})

describe('Multiple nodes', function () {
  it('starts and connects two OrbitDB instances', async () => {
    const orbitdb1 = await startOrbitDB({ directory: './orbitdb1' })
    const orbitdb2 = await startOrbitDB({ directory: './orbitdb2' })
    await connectIpfsNodes(orbitdb1.ipfs, orbitdb2.ipfs)
    await stopOrbitDB(orbitdb1)
    await stopOrbitDB(orbitdb2)
    await rimraf('./orbitdb1')
    await rimraf('./orbitdb2')
  })

  it('throws an error if trying to start two OrbitDB instances with same directory', async () => {
    // Skip this test in browser tests
    if (isBrowser()) {
      return
    }

    let err

    const orbitdb1 = await startOrbitDB({ directory: './orbitdb' })

    try {
      await startOrbitDB({ directory: './orbitdb' })
    } catch (e) {
      err = e
    }

    notStrictEqual(err, undefined)
    strictEqual(err.message, 'Database is not open')

    await stopOrbitDB(orbitdb1)
    await rimraf('./orbitdb')
  })

  it('replicates a database between two OrbitDB instances', async () => {
    let replicated = false

    const orbitdb1 = await startOrbitDB({ directory: './orbitdb1' })
    const orbitdb2 = await startOrbitDB({ directory: './orbitdb2' })

    await connectIpfsNodes(orbitdb1.ipfs, orbitdb2.ipfs)

    const db1 = await orbitdb1.open('db2')

    const onJoin = () => (replicated = true)
    const db2 = await orbitdb2.open(db1.address)
    db2.events.on('join', onJoin)

    await db1.add('A')
    await db1.add('B')
    await db1.add('C')

    await waitFor(() => replicated, () => true)

    deepStrictEqual((await db1.all()).map(e => e.value), ['A', 'B', 'C'])
    deepStrictEqual((await db2.all()).map(e => e.value), ['A', 'B', 'C'])

    await stopOrbitDB(orbitdb1)
    await stopOrbitDB(orbitdb2)
    await rimraf('./orbitdb1')
    await rimraf('./orbitdb2')
  })

  it.only('replicates a database between four OrbitDB instances', async () => {
    let replicated1 = false
    let replicated2 = false

    const orbitdb1 = await startOrbitDB({ directory: './orbitdb1' })
    const orbitdb2 = await startOrbitDB({ directory: './orbitdb2' })
    const orbitdb3 = await startOrbitDB({ directory: './orbitdb3' })
    const orbitdb4 = await startOrbitDB({ directory: './orbitdb4' })

    await connectIpfsNodes(orbitdb1.ipfs, orbitdb2.ipfs)
    await connectIpfsNodes(orbitdb2.ipfs, orbitdb3.ipfs)
    await connectIpfsNodes(orbitdb3.ipfs, orbitdb4.ipfs)

    const db1 = await orbitdb1.open('db2')
    const db2 = await orbitdb2.open(db1.address)

    await db1.add('A')
    await db1.add('B')
    await db1.add('C')

    const db3 = await orbitdb3.open(db1.address)
    const onJoin1 = () => (replicated1 = true)
    db3.events.on('join', onJoin1)

    await waitFor(() => replicated1, () => true)

    const db4 = await orbitdb4.open(db1.address)
    const onJoin2 = () => (replicated2 = true)
    db4.events.on('join', onJoin2)

    await waitFor(() => replicated2, () => true)

    deepStrictEqual((await db1.all()).map(e => e.value), ['A', 'B', 'C'])
    deepStrictEqual((await db2.all()).map(e => e.value), ['A', 'B', 'C'])
    deepStrictEqual((await db3.all()).map(e => e.value), ['A', 'B', 'C'])
    deepStrictEqual((await db4.all()).map(e => e.value), ['A', 'B', 'C'])

    await stopOrbitDB(orbitdb1)
    await stopOrbitDB(orbitdb2)
    await stopOrbitDB(orbitdb3)
    await stopOrbitDB(orbitdb4)
    await rimraf('./orbitdb1')
    await rimraf('./orbitdb2')
    await rimraf('./orbitdb3')
    await rimraf('./orbitdb4')
  })
})
