import TelegramBot from 'node-telegram-bot-api'
import generatePng from './generatePng'
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
    const { num, type } = history;
    const key = type === 'day' ? 'dayHospRange' : 'roundHospRange'
    console.log(history)
    let result = pathName
    for(let i = 0; i < keys.length; i++){
        console.log(arch[keys[i]])
        if(num.between(arch[keys[i]].get(key))){
            return `${result}${keys[i]}\\${num}`
        }
        continue
    }
    return ''
}

const BOT_TOKEN = '2064238273:AAFEVdDRRvewDRkXAW4_Xow-RZ-47eiAMMc'
const bot = new TelegramBot(BOT_TOKEN, { polling: true });


const regexp = /^[\d,\s]+$/gi
const hisRegexp = /[,\s]+/gi



bot.onText(/\/start/, (msg) => {
    const { chat: { id } } = msg;
    bot.sendMessage(id, `Введите ФИО пациента с помощью команды /FIO Например: /FIO Иванов Иван Иванович`)
})

bot.onText(regexp, async(msg, [source, match]) => {
    const { chat: { id } } = msg;
    const { text } = msg
    const arr = text.split(hisRegexp).map(item => Number(item) > 30000 ? {type: 'day', num: item} : {type: 'round', num: item})
    const listOfPaths = arr.map(item => getFullPath(item, arch)).filter(item => item.length > 0)
    await generatePng(listOfPaths, bot, id)
    // patientData.fio = fio;
    bot.sendMessage(id, `Список полностью конвертирован 🎈`)
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