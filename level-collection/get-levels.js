import { readFileSync, writeFileSync } from "fs"
import { setTimeout } from "timers/promises"

const data = readFileSync("pending-ids.json", "utf-8")
// console.log(data)
let level_ids = JSON.parse(data)
let full_levels = []

async function silly() {
  try {
    for (let level of level_ids) {
      let id = level.id
      console.log("fetching " + id)
      const resp = (await fetch("https://api.aredl.net/v2/api/aredl/levels/" + id))
      const jsonData = await resp.json()
      full_levels.push(jsonData)
      console.log("got " + jsonData.name)
      await setTimeout(200)
    }
  } catch (e) {
    console.error("error in fetching! ", e)
  }

  writeFileSync("pending-full.json", JSON.stringify(full_levels))
}

silly().finally(()=>{console.log("success!")})
