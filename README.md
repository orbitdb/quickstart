# OrbitDB Quickstart

[![Matrix](https://img.shields.io/matrix/orbit-db%3Amatrix.org)](https://app.element.io/#/room/#orbit-db:matrix.org) [![npm (scoped)](https://img.shields.io/npm/v/%40orbitdb/quickstart)](https://www.npmjs.com/package/@orbitdb/quickstart) [![node-current (scoped)](https://img.shields.io/node/v/%40orbitdb/quickstart)](https://www.npmjs.com/package/@orbitdb/quickstart)

A preconfigured instance which allows developers to "test drive" OrbitDB. 

This repository provides convenience functions and configurations to deploy OrbitDB quickly and with minimal knowledge of Helia/Libp2p.

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
await stopOrbitDB(orbitdb)
```

OrbitDB Quickstart also includes default Libp2p configurations for Node.js and browser for basic connections between multiple peers:

```js
import { createOrbitDB } from '@orbitdb/core'
import { DefaultLibp2pOptions } from '@orbitdb/quickstart'

const libp2p = createLibp2p({ ...DefaultLibp2pOptions })
const ipfs = await createHelia({ libp2p })

const orbitdb = await createOrbitDB({ ipfs })

const db1 = await orbitdb.open('db1')
await db1.add('hello world!')
```

## Contribute

We would be happy to accept PRs! If you want to work on something, it'd be good to talk beforehand to make sure nobody else is working on it. You can reach us [on Gitter](https://gitter.im/orbitdb/Lobby), or in the [issues section](https://github.com/orbitdb/<Replace Title>/issues).

We also have **regular community calls**, which we announce in the issues in [the @orbitdb welcome repository](https://github.com/orbitdb/welcome/issues). Join us!

If you want to code but don't know where to start, check out the issues labelled ["help wanted"](https://github.com/orbitdb/quickstart/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+sort%3Areactions-%2B1-desc).

For specific guidelines for contributing to this repository, check out the [Contributing guide](CONTRIBUTING.md). For more on contributing to OrbitDB in general, take a look at the [@OrbitDB welcome repository](https://github.com/orbitdb/welcome). Please note that all interactions in [@OrbitDB](https://github.com/orbitdb) fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2024 OrbitDB Community
