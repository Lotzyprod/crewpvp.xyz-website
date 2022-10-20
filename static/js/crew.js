async function fetchAsync (url) {
  let response = await fetch(url);
  return await response.text();
}
document.addEventListener("DOMContentLoaded", function(e) {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var posX = e.pageX;
    var posY = e.pageY;
    ctx = document.querySelector(".contextmenu");
    var menuWidth = ctx.clientWidth;
    var menuHeight = ctx.clientHeight;
    var secMargin = 10;
    if(posX + menuWidth + secMargin >= winWidth
    && posY + menuHeight + secMargin >= winHeight){
      posLeft = posX - menuWidth - secMargin + "px";
      posTop = posY - menuHeight - secMargin + "px";
    }
    else if(posX + menuWidth + secMargin >= winWidth){
      posLeft = posX - menuWidth - secMargin + "px";
      posTop = posY + secMargin + "px";
    }
    else if(posY + menuHeight + secMargin >= winHeight){
      posLeft = posX + secMargin + "px";
      posTop = posY - menuHeight - secMargin + "px";
    }
    else {
      posLeft = posX + secMargin + "px";
      posTop = posY + secMargin + "px";
    };
    ctx.style.left = posLeft;
    ctx.style.top = posTop;
    ctx.style.display = "block";
  });
  document.addEventListener('click', function(e) { 
    document.querySelector(".contextmenu").style.display = "none"; 
  });
});

(function(window) {

  var support = { transitions: Modernizr.csstransitions },
    transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    onEndTransition = function( el, callback ) {
      var onEndCallbackFn = function( ev ) {
        if( support.transitions ) {
          if( ev.target != this ) return;
          this.removeEventListener( transEndEventName, onEndCallbackFn );
        }
        if( callback && typeof callback === 'function' ) { callback.call(this); }
      };
      if( support.transitions ) {
        el.addEventListener( transEndEventName, onEndCallbackFn );
      }
      else {
        onEndCallbackFn();
      }
    },
    stack = document.querySelector('.pages-stack'),
    pages = [].slice.call(stack.children),
    pagesTotal = pages.length,
    current = 0,
    menuCtrl = document.querySelector('button.menu-button'),
    nav = document.querySelector('.pages-nav'),
    navItems = [].slice.call(nav.querySelectorAll('.link--page')),
    isMenuOpen = false;

  function init() {
    buildStack();
    initEvents();
  }

  function buildStack() {
    var stackPagesIdxs = getStackPagesIdxs();

    for(var i = 0; i < pagesTotal; ++i) {
      var page = pages[i],
        posIdx = stackPagesIdxs.indexOf(i);

      if( current !== i ) {
        page.classList.add('page--inactive');

        if( posIdx !== -1 ) {
          page.style.WebkitTransform = 'translate3d(0,100%,0)';
          page.style.transform = 'translate3d(0,100%,0)';
        }
        else {
          page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
          page.style.transform = 'translate3d(0,75%,-300px)';   
        }
      }
      else {
        page.classList.remove('page--inactive');
      }

      page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);
      
      if( posIdx !== -1 ) {
        page.style.opacity = parseFloat(1 - 0.05 * posIdx);
      }
      else {
        page.style.opacity = 0;
      }
    }
  }

  function initEvents() {
    menuCtrl.addEventListener('click', toggleMenu);

    navItems.forEach(function(item) {
      var pageid = item.getAttribute('href').slice(1);
      item.addEventListener('click', function(ev) {
        ev.preventDefault();
        openPage(pageid);
      });
    });

    pages.forEach(function(page) {
      var pageid = page.getAttribute('id');
      page.addEventListener('click', function(ev) {
        if( isMenuOpen ) {
          ev.preventDefault();
          openPage(pageid);
        }
      });
    });
  }

  function toggleMenu() {
    if( isMenuOpen ) {
      closeMenu();
    }
    else {
      openMenu();
      isMenuOpen = true;
    }
  }

  function openMenu() {
    menuCtrl.classList.add('menu-button--open');
    stack.classList.add('pages-stack--open');
    nav.classList.add('pages-nav--open');

    var stackPagesIdxs = getStackPagesIdxs();
    for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
      var page = pages[stackPagesIdxs[i]];
      page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; 
      page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
    }
  }

  function closeMenu() {
    openPage();
  }

  function openPage(id) {
    var futurePage = id ? document.getElementById(id) : pages[current],
      futureCurrent = pages.indexOf(futurePage),
      stackPagesIdxs = getStackPagesIdxs(futureCurrent);

    futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
    futurePage.style.transform = 'translate3d(0, 0, 0)';
    futurePage.style.opacity = 1;

    for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
      var page = pages[stackPagesIdxs[i]];
      page.style.WebkitTransform = 'translate3d(0,100%,0)';
      page.style.transform = 'translate3d(0,100%,0)';
    }

    if( id ) {
      current = futureCurrent;
    }
    
    menuCtrl.classList.remove('menu-button--open');
    nav.classList.remove('pages-nav--open');
    onEndTransition(futurePage, function() {
      stack.classList.remove('pages-stack--open');
      buildStack();
      isMenuOpen = false;
    });
  }

  function getStackPagesIdxs(excludePageIdx) {
    var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
      nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
      idxs = [],

      excludeIdx = excludePageIdx || -1;

    if( excludePageIdx != current ) {
      idxs.push(current);
    }
    if( excludePageIdx != nextStackPageIdx ) {
      idxs.push(nextStackPageIdx);
    }
    if( excludePageIdx != nextStackPageIdx_2 ) {
      idxs.push(nextStackPageIdx_2);
    }

    return idxs;
  }

  init();

})(window)

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = 'qwertyuiopasdfghjklzxcvbnm'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += char
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}
function fadeOut(e,t) {
    var fe = setInterval(function () {
        if (!e.style.opacity) {
            e.style.opacity = 1;
            e.style.visibility = 'visible';
        }
        if (e.style.opacity > 0) {
            e.style.opacity -= 0.1;
        } else {
          e.style.visibility = 'hidden';
            clearInterval(fe);
        }
    }, t);
}

window.addEventListener('load', function (e) {
    var loader = document.querySelector('#page-preloader');
    setTimeout(fadeOut(loader,50), 350);
})