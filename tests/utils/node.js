import Node from '@inshel/node'

class NodeUtils {
  constructor () {
    this.nodes = []
  }

  create = async (config, key) => {
    const node = new Node()

    await node.connect()
    const { key: keyId } = await node.keys.approve(key || config.key)

    node.test = {
      lambda: (lambda, params) => node.contracts.lambda(keyId, config.contract, lambda, params),
      ping: () => node.test.lambda('ping')
    }

    this.nodes.push(node)
    return node
  }

  disconnectAll = async () => {
    while (this.nodes.length > 0) {
      const node = this.nodes.shift()
      if (node.status !== Node.STATUSES.CONNECTED) {
        continue
      }

      await node.disconnect()
    }
  }
}

export default new NodeUtils()
