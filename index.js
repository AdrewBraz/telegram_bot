import TelegramBot from 'node-telegram-bot-api'
import { format } from 'date-fns'
import getDirectoryStructure from './getDirectoryStructure'


const date = new Date().getFullYear()
const pathName = `\\\\172.16.11.205\\mc_scans\\${date}\\`

String.prototype.between = function(arr){
    const min = Math.min.apply(Math, arr)
    const max = Math.max.apply(Math, arr)
    return Number(this) > Number(min) && Number(this) <= Number(max)
}



const arch = getDirectoryStructure(pathName)
const keys = Object.keys(arch)

const getFullPath = (history, arch) => {
    let i = 0
    let result = pathName
    do{
        i = i + 1
        result = `${pathName}${keys[i]}`
    }while(!history.between(arch[keys[i]].roundHospRange))
    return `${result}\\${history}`
}

const resPath = getFullPath('2322', arch)

// Object.keys(arch).forEach(i => {
//     console.log(arch[i])
// })
const BOT_TOKEN = '2064238273:AAFEVdDRRvewDRkXAW4_Xow-RZ-47eiAMMc'
const bot = new TelegramBot(BOT_TOKEN, { polling: true });


const regexp = /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)/

const replacer = (match, p1, p2, p3) => [p1[0].toUpperCase()+p1.slice(1), p2[0].toUpperCase(), p3[0].toUpperCase()].join(' ')



bot.onText(/\/start/, (msg) => {
    const { chat: { id } } = msg;
    bot.sendMessage(id, `Введите ФИО пациента с помощью команды /FIO Например: /FIO Иванов Иван Иванович`)
})

bot.onText(/^[\d,\n\b]+$/i, (msg, [source, match]) => {
    const { chat: { id } } = msg;
    // const fio = match.replace(regexp, replacer)
    // patientData.fio = fio;
    bot.sendMessage(id, `Спасибо 😘😘😘. Теперь нам нужно фото протокола. 
    Прикрепите фото протокола и отправьте его`)
})


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