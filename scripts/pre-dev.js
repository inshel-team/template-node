import fs from 'fs'
import path from 'path'

import Node from '@inshel/node'

import Config from '../src/config'

const fsPromises = fs.promises

const execute = async () => {
  try {
    await fsPromises.mkdir(
      path.join(process.cwd(), 'environment'),
      { recursive: true }
    )
  } catch (e) {
  }

  const config = new Config()
  try {
    await config.prepare()
  } catch (e) {
  }

  const node = new Node()

  const invite = process.argv[2]
  try {
    await node.connect()
    await node.keys.create(invite, config.key)
    const result = await node.keys.approve(config.key)
    const { id: contract } = await node.contracts.create(result.key, { })
    await node.contracts.publish(result.key, contract)

    return { contract }
  } catch (e) {
    if (e.message === '@keys.create:invalid invite') {
      console.error([
        '\tInvalid invite'
      ].join('\n'))
      return
    }

    throw e
  } finally {
    await node.disconnect()
  }
}

execute()
  .then(async (result) => {
    if (result == null) {
      console.error('Rerun "npm run start"')
      return
    }

    await fsPromises.writeFile(
      path.join(process.cwd(), 'environment', 'config.json'),
      JSON.stringify(result, null, 4),
      { encoding: 'UTF-8' }
    )
    console.log(JSON.stringify(result, null, 4))
  })
  .catch((e) => console.error(e))
