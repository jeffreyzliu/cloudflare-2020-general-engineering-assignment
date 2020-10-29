const links = [{ "name": "Cute Animals", "url": "https://www.reddit.com/r/aww" },
  { "name": "Cool Nonprofit Org", "url": "https://qubitbyqubit.org" },
  { "name": "Steph Curry :O", "url": "https://www.youtube.com/watch?v=MsrRHmJHSrE&ab_channel=OttoRam%C3%ADrez" }
  ]

const socialLinks = [
  {icon: "https://simpleicons.org/icons/github.svg",url:"https://github.com/jeffreyzliu"},
{icon: "https://simpleicons.org/icons/linkedin.svg", url:"https://www.linkedin.com/in/jeffreyzliu/"}
];

const myName = "Jeffrey Liu"


addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if(request.url.endsWith("/links"))
      return new Response(JSON.stringify(links), {
        headers: { "content-type": "application/json" },
      })
  console.log("start")
  let html = await fetch("https://static-links-page.signalnerve.workers.dev")

    return new HTMLRewriter()
        .on("div#links", new LinksTransformer(links))
        .on("div#profile", new StyleDeleter())
        .on("img#avatar", new ProfilePicSelector("https://avatars3.githubusercontent.com/u/32628972?s=460&u=3b8071dde305eb47f75d2414941fcccef86adcbd&v=4"))
        .on("h1#name", new TextWriter(myName))
        .on("div#social", new StyleDeleter())
        .on("div#social", new IconSetter(socialLinks))
        .on("title", new TitleChanger("Jeffrey Liu"))
        .on("body", new BackgroundChanger("bg-red-500"))
        .transform(html)

}

class LinksTransformer {
  constructor(links) {
    console.log("link")
    this.links = links
  }

  async element(element) {
    links.forEach(function (link) {
      element.append(`<a href=${link.url}>${link.name}</a>`, {html:true})
    })
  }
}

class StyleDeleter {
  constructor() {
    console.log("style")

  }

  async element(element) {
    element.setAttribute("style","")
    return
  }
}

class ProfilePicSelector {
  constructor(link) {
    this.link = link
  }

  async element(element) {
    element.setAttribute("src",this.link)
  }
}

class TextWriter {
  constructor(content) {
    this.content = content
  }

  async element(element) {
    try {
      element.setInnerContent(this.content, {html: true})
    }
    catch (e) {
      console.log("content")
    }
  }
}

class IconSetter {
  constructor(content) {
    this.content = content
  }

  async element(element) {
    element.removeAttribute("style", "");
    this.content.forEach((contents) => {
      element.append(`<a href="${contents.url}" target="_blank"><img src="${contents.icon}"/></a>`, { html: true });
    });
  }
}

class TitleChanger {
  constructor(content) {
    this.content = content
  }

  async element(element) {
    try {
      element.setInnerContent(this.content, {html: true})
    }
    catch (e) {
      console.log("title")
    }
  }
}

class BackgroundChanger {
  constructor(content) {
    this.content = content
  }

  async element(element) {
    element.setAttribute("class", this.content)
  }
}




