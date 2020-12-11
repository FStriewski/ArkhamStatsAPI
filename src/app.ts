import { PrismaClient } from "@prisma/client"
import * as bodyParser from 'body-parser'
import express from 'express'

import {generateHistogram, SCALE} from './utils/histogram';


const prisma = new PrismaClient()
const app = express()
app.use(bodyParser.json())

app.get(`/bydate/:icode`, async (req, res) => {
  const { icode } = req.params
  console.log(icode[0])
  const investigatorCode = icode[0] === '0' ? icode.slice(1,5) : icode // Leading 0 needs to go
  console.log(investigatorCode)
  return await prisma.decks.findMany({
    where: {
      investigator_code: String(investigatorCode),
    },
          select:{
            investigator_code: true,
            date: true,
          },
  }).then(queryResult => {
    const hist = generateHistogram(queryResult, SCALE.MONTH)
    // console.log(hist)
    return res.json(hist)
  }).catch(e => console.log(e))
})

app.get('/', (req, res) => res.send('Hello World!'));

export default app;