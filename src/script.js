import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xagppftwimzodqtmwjxi.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ3BwZnR3aW16b2RxdG13anhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzAwNzYsImV4cCI6MjA3NTEwNjA3Nn0.sblHbyH-BnRZ-Lzgv0z3WbiceYxhHcwjveNiEFX3nqA"
const supabase = createClient(supabaseUrl, supabaseKey)

import star0 from 'bundle-text:./star0.svg'
import star1 from 'bundle-text:./star1.svg'
import star2 from 'bundle-text:./star2.svg'

let token

let levels = []

class StarRating extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" })
    const wrapper = document.createElement("span")
    wrapper.className = "wrapper"

    let stars = []

    for (let i = 0; i < 5; i++) {
      let star = document.createElement("span")
      star.innerHTML = star0
      stars.push(star)
    }

    const style = document.createElement("style")
    style.textContent = `
      .wrapper {
        display: flex-inline;
        flex-direction: row;
      }

      svg {
        width: 2rem;
        height: 2rem;
        aspect-ratio: 1/1;
      }
    `

    const amt = stars.length * 2
    let callback = (e) => {
      let boundingRect = wrapper.getBoundingClientRect()
      let pos = e.x - boundingRect.x
      let idx = Math.floor((pos / boundingRect.width) * amt)
      let last_star = Math.floor(idx / 2)
      this.setAttribute("value", idx)
      if (idx % 2 == 0) {
        stars[last_star].innerHTML = star1
      }
      else {
        stars[last_star].innerHTML = star2
      }
      for (let i = 0; i < last_star; i++) {
        stars[i].innerHTML = star2
      }
      for (let i = stars.length - 1; i > last_star; i--) {
        stars[i].innerHTML = star0
      }
    }

    wrapper.onclick = callback
    wrapper.ontouchend = callback

    shadow.appendChild(style)
    shadow.appendChild(wrapper)
    stars.forEach(x=>{wrapper.appendChild(x)})
  }
}
customElements.define("star-rating", StarRating)

init()

async function init() {
  let temp = localStorage.getItem("token")
  if (temp) {
    token = temp
  }
  else {
    token = crypto.randomUUID()
    localStorage.setItem("token", token)
  }

  get_levels()
}

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
  detail.innerHTML = `<a href="https://gdbrowser.com/${id}">${id}</a>`


  let input = document.createElement("star-rating")


  let button_flex = document.createElement("div")


  let submit_button = document.createElement("button")
  submit_button.innerText = "Submit"
  submit_button.onclick = async () => {
    const response = await supabase.rpc("new_rating", { p_level_id: id, p_rating_amt: input.getAttribute("value"), p_token: token })
    if (response.status != "200") {
      console.error(response)
    }
    get_levels()
  }


  let skip_button = document.createElement("button")
  skip_button.innerText = "Skip"
  skip_button.onclick = () => {
    get_levels()
  }

  button_flex.appendChild(skip_button)
  button_flex.appendChild(submit_button)


  let ytSlug = video.slice(-11)
  let ytIframe = document.createElement("iframe")
  ytIframe.src = `https://www.youtube.com/embed/${ytSlug}`
  ytIframe.title = "YouTube Video Player"
  ytIframe.frameBorder = "0"
  ytIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  ytIframe.referrerPolicy = "strict-origin-when-cross-origin"
  ytIframe.allowFullscreen = "true"

  box.appendChild(ytIframe)
  box.appendChild(header)
  box.appendChild(detail)
  box.appendChild(input)
  box.appendChild(button_flex)
  return box
}
