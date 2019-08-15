import Node from '@inshel/node'

import Config from '../src/config'

const execute = async () => {
  const config = new Config()
  await config.prepare()

  const node = new Node()

  try {
    await node.connect()
    const { key } = await node.keys.approve(config.key)
    const { id: contract } = await node.contracts.create(key, { })
    await node.contracts.publish(key, contract)

    return contract
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
  .then(async (contract) => {
    console.log(`New contract: ${contract}`)
  })
  .catch((e) => console.error(e))
