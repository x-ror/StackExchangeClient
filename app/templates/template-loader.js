const Observer = require('../observer/observer')
const uniqid = require('uniqid')
const SimpleMDE = require('SimpleMDE')
const simplemde = new SimpleMDE({
  autofocus: true,
  autosave: {
    enabled: true,
    uniqueId: uniqid(),
    delay: 1000,
  },
  blockStyles: {
    bold: '__',
    italic: '_'
  },
  element: document.getElementById('MyID'),
  forceSync: true,
  hideIcons: ['guide', 'heading'],
  indentWithTabs: false,
  initialValue: 'Hello world!',
  insertTexts: {
    horizontalRule: ['', '\n\n-----\n\n'],
    image: ['![](http://', ')'],
    link: ['[', '](http://)'],
    table: ['', '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n'],
  },
  lineWrapping: false,
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
    strikethrough: false,
    underscoresBreakWords: true,
  },
  placeholder: 'Type here...',
  previewRender: function (plainText, preview) { // Async method
    setTimeout(function () {
      preview.innerHTML = customMarkdownParser(plainText)
    }, 250)

    return 'Loading...'
  },
  promptURLs: true,
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  shortcuts: {
    drawTable: 'Cmd-Alt-T'
  },
  showIcons: ['code', 'table'],
  spellChecker: false,
  status: ['autosave', 'lines', 'words', 'cursor', {
    className: 'keystrokes',
    defaultValue: function (el) {
      this.keystrokes = 0
      el.innerHTML = '0 Keystrokes'
    },
    onUpdate: function (el) {
      el.innerHTML = ++this.keystrokes + ' Keystrokes'
    }
  }], // Another optional usage, with a custom status bar item that counts keystrokes
  styleSelectedText: false,
  tabSize: 4,
  toolbar: false,
  toolbarTips: false,
})
const path = require('path')

class Templates {
  constructor () {}

  static async load (file, back_data) {
    const link = document.createElement('link')

    link.rel = 'import'
    link.setAttribute('async', '') // make it async!
    link.setAttribute('class', file) // add class

    link.href = path.join(__dirname, `/fragments/${file}.html`)

    link.onload = await function (e, back_data) {
      Observer.publish(`load_${file}`, {e, back_data})
    }

    link.onerror = await function (e) {
      console.log('not loaded')
    }

    document.head.appendChild(link)
  }

  static xml2string (node) {
    if (typeof(XMLSerializer) !== 'undefined') {
      let serializer = new XMLSerializer()
      return serializer.serializeToString(node)
    } else if (node.xml) {
      return node.xml
    }
  }

  static loadScripts () {

    $.HSCore.components.HSGoTo.init('.js-go-to')

    // initialization of carousel
    $.HSCore.components.HSCarousel.init('.js-carousel')

    $('#we-provide').slick('setOption', 'responsive', [{
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }], true)

    // initialization of HSDropdown component
    $.HSCore.components.HSDropdown.init($('[data-dropdown-target]'), {
      afterOpen: function () {
        $(this).find('input[type="search"]').focus()
      }
    })

    // initialization of masonry
    $('.masonry-grid').imagesLoaded().then(function () {
      $('.masonry-grid').masonry({
        columnWidth: '.masonry-grid-sizer',
        itemSelector: '.masonry-grid-item',
        percentPosition: true
      })
    })

    // initialization of popups
    $.HSCore.components.HSPopup.init('.js-fancybox')

    // initialization of header
    $.HSCore.components.HSHeaderSide.init($('#js-header'))
    $.HSCore.helpers.HSHamburgers.init('.hamburger')

    // initialization of HSMegaMenu component
    $('.js-mega-menu').HSMegaMenu({
      event: 'hover',
      direction: 'vertical',
      breakpoint: 991
    })
    Observer.publish('script_loaded')
  }

}

class TemplatesLoader {
  static async loadHeader (profile) {
    let link = await Templates.load.memoize()
    link('header')
    Observer.subscribe('load_header', profile, data => {
      const link = document.querySelector('link[rel="import"].header')
      const content = link.import
      const el = content.querySelector('main')
      document.body.insertAdjacentHTML('afterbegin', Templates.xml2string(el.cloneNode(true)))

      let logo = document.querySelector('[data-logo="picture"]')
      logo.src = path.join('./app/assets/img/logo.png')

      let profilePicture = document.querySelector('[data-user="picture"]')
      profilePicture.src = profile.UserPicture
      profilePicture.alt = profile.UserName

      let UserName = document.querySelector('[data-user="name"]')
      UserName.innerHTML = profile.UserName.to(17)

      document.querySelector('[data-user="reputation"]').innerHTML = profile.Privileges.reputation
      document.querySelector('[data-user="badges"]').innerHTML = profile.Badges.mapping()
      Templates.loadScripts()
    })
  }

  static async renderQuestion (question) {
    let link = await Templates.load.once()('question')

    Observer.subscribe('load_question', question, data => {

      const link = document.querySelector('link[rel="import"].question')
      let content = link.import

      const link_content = document.querySelector('.content')
      while (link_content.firstChild) {
        link_content.removeChild(link_content.firstChild)
      }
      let el = content.querySelector('.question')

      link_content.insertAdjacentHTML('afterbegin', Templates.xml2string(el.cloneNode(true)))

      el = content = null

      document.querySelector('[data-question="title"]').innerHTML = question.Title
      document.querySelector('[data-question="title"]').setAttribute('data-clip', question.link)
      document.querySelector('[data-sidebar="asked"]').innerHTML = question.date
      document.querySelector('[data-sidebar="viewed"]').innerHTML = (question.Views).metric()
      document.querySelector('[data-sidebar="active"]').innerHTML = question.updated
      document.querySelector('[data-sidebar="username"]').innerHTML = question.Owner.UserName

      document.querySelector('[data-sidebar="reputation"]').innerHTML = question.Owner.Privileges.reputation + ' репутація'

      let UserPicture = document.querySelector('[data-sidebar="user_picture"]')
      const tags_content = document.querySelector('.tags')
      const body = document.querySelector('.question__body')
      body.insertAdjacentHTML('beforeend', question.body)
      tags_content.insertAdjacentHTML('beforeend', question.Tags.maping)

      UserPicture.src = question.Owner.UserPicture
      UserPicture.alt = question.Owner.UserPicture

      $('pre code:not(.prettyprint)', document).each(function () {
        $(this).addClass('prettyprint').parent().wrap('<p></p>')
      })

      $('p img', document).each((e, item) => {
        const img = item
        img.className += 'img-fluid u-block-hover__main--zoom-v1'
        let a = $(img).parent()
        a.wrap('<div class="u-block-hover" ></div>')

        a.href = img.src
        a.attr('data-fancybox-gallery', 'lightbox-gallery--02')
        a.addClass('js-fancybox d-block u-bg-overlay g-bg-black-opacity-0_3--after')

        a.append(`
          <span class="u-block-hover__additional--fade g-bg-black-opacity-0_3 g-color-white">
             <i class="hs-icon hs-icon-magnifier g-absolute-centered g-font-size-25"></i>
          </span>`)
      })

      prettyPrint()
      $.HSCore.components.HSPopup.init('.js-fancybox')
      Observer.unsubscribe('load_question', question)
    })
  }

}

module.exports = TemplatesLoader