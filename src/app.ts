import { PrismaClient } from "@prisma/client"
import express from 'express'
import * as bodyParser from 'body-parser'
import {generateInvestigatorHistogram, SCALE, generateClassCountHistogram, retrieveYearEntity, Scale} from './utils/histogram';
import { SingleDatePoint } from './utils/types';
import {buildTimeRange} from './utils/rangeBuilder';


const prisma = new PrismaClient()
const app = express()
app.use(bodyParser.json())

type Tick = {
  investigator_code: string;
  date: string;
}

export const factionMembers: {[key: string]: string[]} = {
	'guardian' : ["01001", "02001", "03001", "04001", "98010", "06001", "07001", "60101"],
	'seeker':  ["01002", "02002", "03002", "04002", "05002", "06002", "07002", "98007", "60201"],
	'rogue': ["01003", "02003", "03003", "04003", "05003", "06003", "07003", "60301"],
	'survivor': ["01005", "02005", "03005", "04005", "05005", "06005", "98013", "60501"],
	'mystic': ["01004", "02004", "03004", "04004", "05004", "05006", "06004", "98016", "60401"],
	'neutral': ["03006"]
}

const dateIssue = (result: any) => result.map((tick: Tick) => ({...tick, date: new Date(tick.date)}));

export const generateTotalCount = async (scale:Scale ) => {
    return await prisma.$queryRaw('SELECT date, COUNT(id) AS count FROM decks GROUP BY date;')
      .then((queryResult) => {
        const modifRes = dateIssue(queryResult)
        const timerange = buildTimeRange(scale, ['all']);
        
        modifRes.map( (record: any) => {
            const {year, entry} = retrieveYearEntity(record, scale);
            const target = scale === SCALE.DAY 
            ? timerange[year].filter((sdp:SingleDatePoint) => sdp.date === entry)
            : timerange[year].filter((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
            
            target[0]['all'] += record.count
        })
      return timerange
    })
}
/*

Normalize these by total decks build per month (and have % values)

*/ 

app.get(`/decks/total/:iclass`, async (req, res) => {
  const { iclass } = req.params
  if(iclass==='all'){
    const hist = await generateTotalCount(SCALE.MONTH)

        const result = {
          datapoints_absolute: hist, 
          datapoints_relative: hist, 
          meta: {
              investigator: [iclass],
              total: 0,
          }
        }
      return res.json(result)
  }else{
    const members = factionMembers[iclass].map(mem => `'${mem}'`).join(',')
    return  await prisma.$queryRaw(`SELECT date, COUNT(1) FILTER (WHERE investigator_code IN (${members})) AS count FROM decks GROUP BY date`)
      .then(async (queryResult) => {
    const modifRes = dateIssue(queryResult)
    const hist = await generateClassCountHistogram(modifRes, iclass, SCALE.MONTH)
    return res.json(hist)
  }).catch(e => console.log(e));
}

})

app.get(`/investigator/:icode`, async (req, res) => {
  const { icode } = req.params

  return await prisma.decks.findMany({
    where: {
      investigator_code: String(icode),
    },
          select:{
            investigator_code: true,
            date: true,
          },
  }).then(async (queryResult) => {
    const modifRes = dateIssue(queryResult)
    const hist = await generateInvestigatorHistogram(modifRes, [icode], SCALE.MONTH)
    console.log(hist)
    return res.json(hist)
  }).catch(e => console.log(e))
})


app.get(`/investigatorComparison/`, async (req, res) => {
  const { i0, i1, i2 } = req.query

  const investigatorList = [i0, i1, i2]
    .filter((icode: string) => icode !== undefined)
    .map((icode: string) => icode);
  
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
  }).then(async (queryResult) => {
    const hist = await generateInvestigatorHistogram(queryResult, investigatorList, SCALE.MONTH)
    return res.json(hist)
  }).catch(e => console.log(e))
})

export default app;