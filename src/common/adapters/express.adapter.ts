import { Response } from 'express'

import { ExpressAdapter } from '@nestjs/platform-express'

const app: ExpressAdapter = new ExpressAdapter()
export { app as ExpressAdapter }
app.use((request: Request, reply: Response, done) => {
  // set undefined origin
  const origin = request.headers['origin']
  if (!origin) {
    request.headers['origin'] = request.headers['host']
  }
  const url = request.url

  // skip favicon request
  if (url.match(/favicon\.ico$/) || url.match(/manifest\.json$/)) {
    return reply.status(204).send()
  }

  done()
})
