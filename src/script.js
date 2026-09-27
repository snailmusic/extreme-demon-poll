import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xagppftwimzodqtmwjxi.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ3BwZnR3aW16b2RxdG13anhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzAwNzYsImV4cCI6MjA3NTEwNjA3Nn0.sblHbyH-BnRZ-Lzgv0z3WbiceYxhHcwjveNiEFX3nqA"
const supabase = createClient(supabaseUrl, supabaseKey)

let levels = []

get_levels()

async function get_levels() {
  let level_data = await supabase.rpc("fetch_random_demons")

  levels = level_data.data
  console.log(levels)
  update_displays()
}

function update_displays() {
  let box_container = document.getElementById("box_container")
  box_container.innerHTML = ""
  for (let level of levels) {
    box_container.appendChild(level_box(level))
  }
}

function level_box({id, name, publisher, video}) {
  let box = document.createElement("div")
  box.className = "box"


  let header = document.createElement("p")
  header.className = "header"
  header.innerHTML = `<b>${name}</b> by ${publisher}`


  let detail = document.createElement("p")
  detail.className = "detail"
  detail.innerHTML = `ID: <a href="https://gdbrowser.com/${id}">${id}</a>`


  let input = document.createElement("input")
  input.type = "number"
  input.placeholder = "Your Rating (1-10)"
  input.max = "10"
  input.min = "1"


  let button = document.createElement("button")
  button.innerText = "Submit/Skip"


  let ytSlug = video.slice(-11)
  let ytIframe = document.createElement("iframe")
  ytIframe.src = `https://www.youtube.com/embed/${ytSlug}`
  ytIframe.title = "YouTube Video Player"
  ytIframe.frameBorder = "0"
  ytIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  ytIframe.referrerPolicy = "strict-origin-when-cross-origin"
  ytIframe.allowFullscreen = "true"

  box.appendChild(header)
  box.appendChild(detail)
  box.appendChild(input)
  box.appendChild(button)
  box.appendChild(ytIframe)
  return box
}
