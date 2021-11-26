import fetch from 'node-fetch'
import fs from 'fs'
import { promisify } from 'util'
import TelegramBot from 'node-telegram-bot-api'
import path from 'path'


const bot = new TelegramBot(BOT_TOKEN, { polling: true })

const patientData = {
    fio: '',
    photoUrl: ''
}

const regexp = /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)/

const replacer = (match, p1, p2, p3) => [p1[0].toUpperCase()+p1.slice(1), p2[0].toUpperCase(), p3[0].toUpperCase()].join(' ')
const writeFilePromise = promisify(fs.writeFile);
const download = async (url, path) => {
    return fetch(url)
      .then(x => {
          console.log(x)
          return x.arrayBuffer()
      })
      .then(x => writeFilePromise(path, Buffer.from(x)));

  };


bot.onText(/([А-ЯЁа-яё]+)/, (msg) => {
    const { chat: { id } } = msg;
    bot.sendMessage(id, `Введите ФИО пациента с помощью команды /FIO Например: /FIO Иванов Иван Иванович`)
})

bot.onText(/\/start/, (msg) => {
    const { chat: { id } } = msg;
    bot.sendMessage(id, `Введите ФИО пациента с помощью команды /FIO Например: /FIO Иванов Иван Иванович`)
})

bot.onText(/\/FIO (.+)/, (msg, [source, match]) => {
    const { chat: { id } } = msg;
    const fio = match.replace(regexp, replacer)
    patientData.fio = fio;
    bot.sendMessage(id, `Спасибо 😘😘😘. Теперь нам нужно фото протокола. 
    Прикрепите фото протокола и отправьте его`)
})

bot.on('photo', async (doc) => {
    console.log(doc)
    const { file_id  } = doc.photo[2]
    const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`
    );
    const res2 = await res.json();
    const { file_path } = res2.result
    patientData.photoUrl
    const downloadURL = 
      `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;
    await download(downloadURL, path.join(__dirname, `${patientData.fio}.png`))

})