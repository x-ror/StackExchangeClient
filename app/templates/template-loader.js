const Observer = require('../observer/observer')

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
      Observer.publish('load_header', {e, back_data})
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

  }

}

class TemplatesLoader {
  static async loadHeader (profile) {
    let link = await Templates.load('header')

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
}

module.exports = TemplatesLoader