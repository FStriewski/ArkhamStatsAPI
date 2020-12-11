import { PrismaClient } from "@prisma/client"
import express from 'express'
import * as bodyParser from 'body-parser'
import {generateHistogram, SCALE} from './utils/histogram';


const prisma = new PrismaClient()
const app = express()
app.use(bodyParser.json())

app.get(`/investigator/:icode`, async (req, res) => {
  const { icode } = req.params
  const investigatorCode = icode[0] === '0' ? icode.slice(1,5) : icode // Leading 0 needs to go
  return await prisma.decks.findMany({
    where: {
      investigator_code: String(investigatorCode),
    },
          select:{
            investigator_code: true,
            date: true,
          },
  }).then(queryResult => {
    const hist = generateHistogram(queryResult, [investigatorCode], SCALE.MONTH)
    return res.json(hist)
  }).catch(e => console.log(e))
})


app.get(`/investigatorComparison/`, async (req, res) => {
  const { i0, i1, i2 } = req.query

  const investigatorList = [i0, i1, i2]
    .filter((icode: string) => icode !== undefined)
    .map((icode: string) => icode[0] === '0' ? icode.slice(1,5): icode);
  
  return await prisma.decks.findMany({
    where: {
      investigator_code: {
        in: investigatorList
      }
    },
          select:{
            investigator_code: true,
            date: true,
          },
  }).then(queryResult => {
    const hist = generateHistogram(queryResult, investigatorList, SCALE.MONTH)
    return res.json(hist)
  }).catch(e => console.log(e))
})

app.get('/', (req, res) => res.send('Hello World!'));

export default app;