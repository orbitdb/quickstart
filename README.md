# OrbitDB Quickstart

[![Matrix](https://img.shields.io/matrix/orbit-db%3Amatrix.org)](https://app.element.io/#/room/#orbit-db:matrix.org) [![npm (scoped)](https://img.shields.io/npm/v/%40orbitdb/quickstart)](https://www.npmjs.com/package/@orbitdb/quickstart) [![node-current (scoped)](https://img.shields.io/node/v/%40orbitdb/quickstart)](https://www.npmjs.com/package/@orbitdb/quickstart)

A preconfigured OrbitDB instance which allows users to quickly "test drive" OrbitDB. 

This repository provides convenience functions and IPFS and Libp2p configurations to deploy OrbitDB quickly and with minimal knowledge of Helia/Libp2p.

## Install

This project uses [npm](http://npmjs.com/) and [nodejs](https://nodejs.org/).

```sh
npm i @orbitdb/quickstart
```

## Usage

To launch a OrbitDB instance and open a database, run `startOrbitDB`:

```js
import { startOrbitDB, stopOrbitDB } from '@orbitdb/quickstart'

const orbitdb = await startOrbitDB()
const db1 = await orbitdb.open('db1')
await db1.add('hello world!')
console.log(await db1.all())
await stopOrbitDB(orbitdb)
```

OrbitDB Quickstart also includes default Libp2p configurations for Node.js and browser for basic connections between multiple peers:

```js
import { createOrbitDB } from '@orbitdb/core'
import { DefaultLibp2pOptions } from '@orbitdb/quickstart'
import { createLibp2p } from "libp2p";
import { createHelia } from "helia";

const libp2p = createLibp2p({ ...DefaultLibp2pOptions })
const ipfs = await createHelia({ libp2p })

const orbitdb = await createOrbitDB({ ipfs })

const db1 = await orbitdb.open('db1')
await db1.add('hello world!')
console.log(await db1.all())
```


## License

[MIT](LICENSE) © 2024 OrbitDB Community
