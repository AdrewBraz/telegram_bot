import { readdirSync, statSync } from 'fs'

const sortHistoryTypes = (listOfDirs) =>  listOfDirs.reduce((acc, item) => {
    if(item.length >= 5){
      acc.dayHosp.push(item)
      return acc
    }
    acc.roundHosp.push(item)
    return acc
  }, {roundHosp: [], dayHosp: []})
  
  
  const findMinMax = (arr) => {
      const minValue = Math.min.apply(Math, arr)
      const max = Math.max.apply(Math, arr)
      const minIndex = arr.indexOf(minValue.toString())
      const secondMin = Math.min.apply(Math, arr.slice(0, minIndex).concat(arr.slice(minIndex + 1)))
      const min = secondMin - minValue > 1 ? secondMin : minValue
      return { max, min }
  }
  
export default (path) => {
      const monthNames = readdirSync(path)
      const obj = {}
      for(let i = 0; i < monthNames.length ; i++){
          if(monthNames[i] ){
              const dirnames = readdirSync(`${path}\\${monthNames[i]}`)
              const { roundHosp, dayHosp } = sortHistoryTypes(dirnames)
              const { min: roundMin, max: roundMax } = findMinMax(roundHosp)
              const { min: dayMin, max: dayMax } = findMinMax(dayHosp)
              const roundHospRange = [roundMin, roundMax]
              const dayHospRange = [dayMin, dayMax]
              obj[monthNames[i]] = new Map()
              obj[monthNames[i]].set('roundHospRange', roundHospRange)
              obj[monthNames[i]].set('dayHospRange', dayHospRange)
          }
      }
      return obj 
  }