import fs from 'fs'
import path from 'path'

import JSEncrypt from 'node-jsencrypt'

const fsPromises = fs.promises

const DEFAULT_CONFIG_PATH = path.join(process.cwd(), 'environment')

class Config {
  constructor (configPath) {
    this.configPath = configPath || DEFAULT_CONFIG_PATH
  }

  async readFile (fileName, fn = (i) => i) {
    return fn((await fsPromises.readFile(fileName, { encoding: 'UTF-8' })).toString())
  }

  async prepare () {
    let keyData = null
    try {
      keyData = await this.readFile(path.join(this.configPath, 'key'))
    } catch (e) {
      keyData = new JSEncrypt().getPrivateKey()
      await fsPromises.writeFile(
        path.join(this.configPath, 'key'),
        keyData,
        { encoding: 'UTF-8' }
      )
    }

    this.key = new JSEncrypt()
    this.key.setPrivateKey(keyData)

    let config = { }
    try {
      config = await this.readFile(path.join(this.configPath, 'config.json'), (i) => JSON.parse(i))
    } catch (e) {
    }

    Object.keys(config)
      .forEach((key) => {
        this[key] = config[key]
      })
  }
}

export default Config
