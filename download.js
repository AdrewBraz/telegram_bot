import { promisify } from 'util'
import fetch from 'node-fetch'
import fs from 'fs'

export default  async (url, path, patientData) => {
    const writeFilePromise = promisify(fs.writeFile);
    if(!fs.existsSync(`${path}\\${patientData.fio}`)){
        fs.mkdirSync(`${path}\\${patientData.fio}`)
    }
    return fetch(url)
      .then(x => {
          return x.arrayBuffer()
      })
      .then(x => writeFilePromise(`${path}\\${patientData.fio}\\${patientData.fio}.jpeg`, Buffer.from(x)));

  };