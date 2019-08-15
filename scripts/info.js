import Node from '@inshel/node'

import Config from '../src/config'

const execute = async () => {
  const config = new Config()
  await config.prepare()

  const node = new Node()
  try {
    await node.connect()
    return await node.keys.approve(config.key)
  } catch (e) {
    if (e.message === '@keys.challenge:invalid public') {
      console.error([
        '\tUnregistered key in environment',
        '\tUse script "npm run start {invite}"',
        '\tYou can request invite by email: "contact@inshel.com"'
      ].join('\n'))
      return
    }

    throw e
  } finally {
    await node.disconnect()
  }
}

execute()
  .then((result) => console.log(JSON.stringify(result, null, 4)))
  .catch((e) => console.error(e))
