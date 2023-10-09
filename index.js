import TelegramBot from 'node-telegram-bot-api'
import fetch from 'node-fetch'
import download from './download'
import { format } from 'date-fns'
import fs from 'fs'
import { readdirSync, statSync } from 'fs'


const date = new Date().getFullYear()
const pathName = `\\\\172.16.11.205\\mc_scans\\${date}\\`

const sortFunc = ( list) => {
    if(list.length <= 1){
        return list
    }
    const pivotIndex = Math.floor(list.length / 2)
    const pivot = list[pivotIndex]
    const less = []
    const greater = []
    for(let i = 0; i < list.length; i++){
        if(i === pivotIndex){
            continue
        }
        if( Number(list[i]) < Number(pivot)){
            less.push(list[i])
        } else {
            greater.push(list[i])
        }
    }
    return [...sortFunc(less), pivot, ...sortFunc(greater)]
}

const sortHistoryTypes = (listOfDirs) =>  listOfDirs.reduce((acc, item) => {
  if(item.length >= 5){
    acc.dayHosp.push(item)
    return acc
  }
  acc.roundHosp.push(item)
  return acc
}, {roundHosp: [], dayHosp: []})

String.prototype.between = function(arr){
    const min = Math.min.apply(Math, arr)
    const max = Math.max.apply(Math, arr)
    return Number(this) > Number(min) && Number(this) <= Number(max)
}

const buildList = (path) => {
    const monthNames = readdirSync(path)
    const obj = {}
    for(let i = 0; i < monthNames.length ; i++){
        if(monthNames[i] ){
            const dirnames = readdirSync(`${pathName}\\${monthNames[i]}`)
            const { roundHosp, dayHosp } = sortHistoryTypes(dirnames)
            const sortedRoundHosp = sortFunc(roundHosp)
            const sortedDayHosp = sortFunc(dayHosp)
            const roundHospRange = [sortedRoundHosp[0], sortedRoundHosp[sortedRoundHosp.length - 1]]
            const dayHospRange = [sortedDayHosp[0], sortedDayHosp[sortedDayHosp.length - 1]]
            obj[monthNames[i]] = { roundHospRange, dayHospRange}
        }
    }

    console.log(obj)

}

console.log(buildList(pathName))

// const BOT_TOKEN = '2064238273:AAFEVdDRRvewDRkXAW4_Xow-RZ-47eiAMMc'
// const bot = new TelegramBot(BOT_TOKEN, { polling: true });
// const diskPath = `\Z:\\Pol`

// const patientData = {
//     fio: '',
//     photoUrl: ''
// }

// const regexp = /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)/

// const replacer = (match, p1, p2, p3) => [p1[0].toUpperCase()+p1.slice(1), p2[0].toUpperCase(), p3[0].toUpperCase()].join(' ')



// bot.onText(/\/start/, (msg) => {
//     const { chat: { id } } = msg;
//     bot.sendMessage(id, `Введите ФИО пациента с помощью команды /FIO Например: /FIO Иванов Иван Иванович`)
// })

// bot.onText(/\/FIO (.+)/i, (msg, [source, match]) => {
//     const { chat: { id } } = msg;
//     const fio = match.replace(regexp, replacer)
//     patientData.fio = fio;
//     bot.sendMessage(id, `Спасибо 😘😘😘. Теперь нам нужно фото протокола. 
//     Прикрепите фото протокола и отправьте его`)
// })


// bot.on('photo', async (doc) => {
//     console.log(doc)
//     const { file_id  } = doc.photo[2]
//     const res = await fetch(
//         `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`
//     );
//     const res2 = await res.json();
//     const { file_path } = res2.result
//     patientData.photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`
//     await download(patientData.photoUrl, diskPath, patientData)

// })