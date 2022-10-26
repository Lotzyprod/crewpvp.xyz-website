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

window.addEventListener('load', function (e) { setTimeout(fadeOut(document.querySelector('#page-preloader'),50), 350); })

class PagesStack {
  constructor() {
    this.support = { transitions: Modernizr.csstransitions };
    this.transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' };
    this.transEndEventName = this.transEndEventNames[ Modernizr.prefixed( 'transition' ) ];
    this.onEndTransition = ( el, callback ) => {
      var onEndCallbackFn = ( ev ) => {
        if( this.support.transitions ) {
          if( ev.target != el ) return;
          el.removeEventListener( this.transEndEventName, onEndCallbackFn );
        }
        if( callback && typeof callback === 'function' ) { callback.call(el); }
      };
      if( this.support.transitions ) {
        el.addEventListener( this.transEndEventName, onEndCallbackFn );
      }
      else {
        onEndCallbackFn();
      }
    };

    this.stack = document.querySelector('.pages-stack');
    this.pages = [].slice.call(this.stack.children);
    this.pagesTotal = this.pages.length;
    this.current = 0;
    this.menuCtrl = document.querySelector('button.menu-button');
    this.nav = document.querySelector('.pages-nav');
    this.navItems = [].slice.call(this.nav.querySelectorAll('.link--page'));
    this.isMenuOpen = false;
    this.buildStack();
    this.initEvents();
  }

  addPage(page,nav) {
    this.pagesTotal++;
    document.querySelector('.pages-stack').innerHTML+=page;
    document.querySelector('.pages-nav').innerHTML+=nav;
    this.stack = document.querySelector('.pages-stack');
    this.pages = [].slice.call(this.stack.children);
    this.nav = document.querySelector('.pages-nav');
    this.navItems = [].slice.call(nav.querySelectorAll('.link--page'));
    if (this.isMenuOpen) {
      page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; 
      page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
    }
  }

  getStackPagesIdxs(excludePageIdx) {
    var nextStackPageIdx = this.current + 1 < this.pagesTotal ? this.current + 1 : 0,
      nextStackPageIdx_2 = this.current + 2 < this.pagesTotal ? this.current + 2 : 1,
      idxs = [], excludeIdx = excludePageIdx || -1;

    if( excludePageIdx != this.current ) {
      idxs.push(this.current);
    }
    if( excludePageIdx != nextStackPageIdx ) {
      idxs.push(nextStackPageIdx);
    }
    if( excludePageIdx != nextStackPageIdx_2 ) {
      idxs.push(nextStackPageIdx_2);
    }

    return idxs;
  }

  buildStack() {
    var stackPagesIdxs = this.getStackPagesIdxs();

    for(var i = 0; i < this.pagesTotal; ++i) {
      var page = this.pages[i],
        posIdx = stackPagesIdxs.indexOf(i);

      if( this.current !== i ) {
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

      page.style.zIndex = i < this.current ? parseInt(this.current - i) : parseInt(this.pagesTotal + this.current - i);
      
      if( posIdx !== -1 ) {
        page.style.opacity = parseFloat(1 - 0.05 * posIdx);
      }
      else {
        page.style.opacity = 0;
      }
    }
  }

  openPage(id) {
    var futurePage = id ? document.getElementById(id) : this.pages[this.current],
      futureCurrent = this.pages.indexOf(futurePage),
      stackPagesIdxs = this.getStackPagesIdxs(futureCurrent);

    futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
    futurePage.style.transform = 'translate3d(0, 0, 0)';
    futurePage.style.opacity = 1;

    for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
      var page = this.pages[stackPagesIdxs[i]];
      page.style.WebkitTransform = 'translate3d(0,100%,0)';
      page.style.transform = 'translate3d(0,100%,0)';
    }

    if( id ) {
      this.current = futureCurrent;
    }
    
    this.menuCtrl.classList.remove('menu-button--open');
    this.nav.classList.remove('pages-nav--open');
    this.onEndTransition(futurePage, ev => {
      this.stack.classList.remove('pages-stack--open');
      this.buildStack();
      this.isMenuOpen = false;
    });
  }

  openMenu() {
    this.menuCtrl.classList.add('menu-button--open');
    this.stack.classList.add('pages-stack--open');
    this.nav.classList.add('pages-nav--open');

    var stackPagesIdxs = this.getStackPagesIdxs();
    for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
      var page = this.pages[stackPagesIdxs[i]];
      page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; 
      page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
    }
  }

  closeMenu() {
    this.openPage();
  }

  toggleMenu() {
    if( this.isMenuOpen ) {
      this.closeMenu();
    } else {
      this.openMenu();
      this.isMenuOpen = true;
    }
  }

  initEvents() {
    this.menuCtrl.addEventListener('click', this.toggleMenu.bind(this));

    this.navItems.forEach(item => {
      var pageid = item.getAttribute('href').slice(1);
      item.addEventListener('click', ev => {
        ev.preventDefault();
        this.openPage(pageid);
      });
    });

    this.pages.forEach(page => {
      var pageid = page.getAttribute('id');
      page.addEventListener('click', ev => {
        if( this.isMenuOpen ) {
          ev.preventDefault();
          this.openPage(pageid);
        }
      });
    });
  }
}

var ps = new PagesStack(); 