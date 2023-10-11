import gm from 'gm'
import {readdirSync} from 'fs'
import path from 'path'

const generatePng = async (item, name) => {
    const promis = new Promise((res, rej) => {
      gm(`${item}\\${name}`)
        .write(`${item}\\${name.slice(0, name.length - 5)}.jpeg`, function (err) {
          if (err) rej(err);
          res('`${item}\\${name.slice(0, name.length - 5)}.jpeg`')
        }
    )})
    return promis
  }

export default async (list, bot, id) => {
    for(const item of list) {
        const historyNum = path.basename(item)
        let fileNames = readdirSync(item);
        try{
            for(const name of fileNames) {
                if(path.extname(name) !== '.db'){
                  await generatePng(item, name)
                }
              }
        } catch(e){
            console.log(e)
        }
        bot.sendMessage(id, `✔ Конвертация карты ${historyNum} завершена`)
      }
}