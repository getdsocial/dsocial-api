const { ApolloServer } = require('apollo-service-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { dSocialTypeDefs } = require('@dsocial/graphql-schema')
const { dSocialResolver } = require(./util/resolvers')
const { MongoClient } = require('mongodb')
require('dotenv').config()

async function start() {
  const app = express()
  const MONGO_DB = process.env.DB_HOST

  const client = await MongoClient.connect(
    MONGO_DB
    { useNewUrlParser: true }
  )

  const db = client.db()
  const context = { db }
  const server = new ApolloServer({ dSocialTypeDefs, dSocialResolvers, context })
  server.applyMiddleware({app})
  app.get('/', (req, res) => res.end('Welcome to the dSocial API.'))
  app.get('/playground', expressPlayground({endpoint: '/graphql'}))
  app.listen({port: 4000}, () =>
    console.log(
      `dSocial API server running at http://localhost:4000${server.graphqlPath}` 
    )
  )
}

start()
