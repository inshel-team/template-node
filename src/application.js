import fs from 'fs'
import path from 'path'

import Node from '@inshel/node'

const fsPromises = fs.promises

class Application {
  constructor (config, contractPath) {
    this.config = config
    this.contractPath = contractPath || path.join(__dirname, 'contract')

    this.node = new Node(config)
  }

  async start () {
    await this.node.connect()
    await this.node.keys.approve(this.config.key)
    await this.node.contracts.subscribe(this.config.contract, await this.createHandler())
  }

  async stop () {
    await this.node.disconnect()
  }

  async readdir (_path) {
    const result = {}
    const paths = [{ path: _path, prefix: null, name: null }]

    while (paths.length > 0) {
      const current = paths.shift()

      const stat = await fsPromises.stat(current.path)

      if (stat.isDirectory()) {
        const files = await fsPromises.readdir(current.path)
        for (let i = 0; i < files.length; i++) {
          const name = files[i]
          paths.push({
            name,
            path: path.join(current.path, name),
            prefix: current.prefix == null ? name : `${current.prefix}.${name}`
          })
        }
        continue
      }

      const methodPath = current.prefix == null ? current.name : current.prefix
      const method = require(current.path)
      result[methodPath.substr(0, methodPath.length - 3)] = method.default || method
    }

    return result
  }

  async createHandler () {
    const methods = await this.readdir(this.contractPath)

    return (lambda, params, key) => {
      const method = methods[lambda] || methods['404'] || (() => { throw new Error('Method not found') })

      return method(params, key)
    }
  }
}

export default Application
