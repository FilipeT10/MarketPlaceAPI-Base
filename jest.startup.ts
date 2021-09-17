import * as jestCli from 'jest-cli'

import {Server} from './server/server'
import {environment} from './common/environment'
import {usersRouter} from './routes/users/users.router'
import {reviewsRouter} from './routes/reviews/reviews.router'
import {restaurantsRouter} from './routes/restaurants/restaurants.router'
import {User} from './routes/users/user.model'
import {Review} from './routes/reviews/reviews.model'
import {Restaurant} from './routes/restaurants/restaurants.model'
import { lojasRouter } from './routes/lojas/lojas.router'

let server: Server
const beforeAllTests = ()=>{
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/marketplace-manager-test-db'
  environment.server.port = process.env.SERVER_PORT || 3001
  server = new Server()
  return server.bootstrap([
    usersRouter,
    reviewsRouter,
    restaurantsRouter,
    lojasRouter
  ])
  .then(()=>User.remove({}).exec())
  .then(()=>Review.remove({}).exec())
  .then(()=>Restaurant.remove({}).exec())
}

const afterAllTests = ()=>{
  return server.shutdown()
}

beforeAllTests()
.then(()=>jestCli.run())
.then(()=>afterAllTests())
.catch(console.error)
