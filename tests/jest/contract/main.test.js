/* eslint-env jest */

import '@babel/polyfill'

import Application from '../../../src/application'
import Config from '../../../src/config'
import nodeUtils from '../../utils/node'

const config = new Config()
let application = null

beforeEach(async () => {
  await config.prepare()

  application = new Application(config)
  await application.start()
})

afterEach(async () => {
  if (application != null) {
    try {
      await application.stop()
    } catch (e) {
      if (e.message === 'Already disconnected') {
        return
      }

      throw e
    }
  }

  await nodeUtils.disconnectAll()
})

test('ping', async () => {
  const node = await nodeUtils.create(config)

  expect(await node.test.ping()).toBe('pong')
})

test('404', async () => {
  const node = await nodeUtils.create(config)

  await expect((async () => {
    await node.test.lambda('test:invalid-lambda', { })
  })()).rejects.toThrowError('/contracts.lambda/test:invalid-lambda:Lambda not found')
})
