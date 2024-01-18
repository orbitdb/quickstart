import { startOrbitDB, stopOrbitDB } from '../src/index.js'
import { deepStrictEqual } from 'assert'
import { rimraf } from 'rimraf'

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
