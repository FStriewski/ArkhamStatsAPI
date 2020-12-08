import { PrismaClient } from "@prisma/client"
import * as bodyParser from 'body-parser'
import express from 'express'

import {generateMonthHeatHistogram} from './utils/histogram';

const prisma = new PrismaClient()
const app = express()
app.use(bodyParser.json())

app.get(`/bydate/:icode`, async (req, res) => {
  const { icode } = req.params
  const queryResult = await prisma.decks.findMany({
    where: {
      investigator_code: String(icode),
    },
          select:{
            investigator_code: true,
            date: true,
          },
  })
  const hist = generateMonthHeatHistogram(queryResult)
  console.log(hist)
  res.json(hist)
})

app.get('/', (req, res) => res.send('Hello World!'));

export default app;