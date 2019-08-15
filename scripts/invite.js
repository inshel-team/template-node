import Node from '@inshel/node'

import Config from '../src/config'

const execute = async () => {
  const config = new Config()
  await config.prepare()

  const node = new Node()

  const count = parseInt(process.argv[2]) || 1
  try {
    await node.connect()
    const { key } = await node.keys.approve(config.key)

    const invites = []
    for (let i = 0; i < count; i++) {
      invites.push(await node.invites.create(key))
    }
    return invites
  } catch (e) {
    if (e.message === '@keys.challenge:invalid public') {
      console.error([
        '\tUnregistered key in environment',
        '\tUse script "npm run start {invite}"',
        '\tYou can request invite by email: "contact@inshel.com"'
      ].join('\n'))
      return
    }

    if (e.message === '@invites.create:not enough invites') {
      console.error([
        '\tNot enough invites'
      ].join('\n'))
      return
    }

    throw e
  } finally {
    await node.disconnect()
  }
}

execute()
  .then((invites) => console.log(invites.join('\n')))
  .catch((e) => console.error(e))
