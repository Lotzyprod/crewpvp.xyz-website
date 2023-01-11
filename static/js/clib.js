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
			} else {
				onEndCallbackFn();
			}
		};

		this.button = document.querySelector('button.menu-button');
		this.button.addEventListener('click', ev => { this.toggle(); });
		this.stack = document.querySelector('.pages-stack');
		this.nav = document.querySelector('.pages-nav');
        var pages = [].slice.call(this.stack.children);
        var nav = [].slice.call(this.nav.querySelectorAll('.pages-nav__item'));
        var ids = [];
        pages.forEach(page => { ids.push(page.getAttribute('id')); });

        this.opened = false;
        this.dataStack = [];
        this.totalPages = pages.length;
        this.currentPage = 0;
        for(var i = 0; i < this.totalPages; i++) {
            this.dataStack.push([pages[i],nav[i],ids[i]]);
            this.registerPage(i);
        }
    }
    
    getStackIdById(id) {
    	for(var i=0; i<this.totalPages; i++) {
    		if (this.dataStack[i][2] == id) {
    			return i;
    		}
    	}
    }
    
    addPage(page,js) {
    	this.stack.insertAdjacentHTML('beforeend',page);
    	page = this.stack.children[this.totalPages];
    	var id = page.getAttribute('id');
    	this.nav.insertAdjacentHTML('beforeend',('<div class=\"pages-nav__item\" id=\"'+id+'\"><a class=\"link link--page\" href=\"#'+id+'\">'+id+'</a></div>'));
        var scr = document.createElement('script');
        scr.textContent = js;
        document.body.appendChild(scr);
        var nav = this.nav.querySelectorAll('.pages-nav__item')[this.totalPages];
        this.dataStack.push([page,nav,id]);
        this.registerPage(this.totalPages);
        this.totalPages++;
    }
    removePage(id) {
    	for(var i = 0; i<this.totalPages; i++) {
            if (this.dataStack[i][2] == id) {
            	this.dataStack[i][1].remove();
                if (!this.opened) {
		    		this.openMenu();
		    	}
                this.dataStack[i][0].remove();
                this.dataStack.splice(i,1);
                break;
            }
        }
    	this.totalPages--;
    }
    registerPage(i) {
        this.dataStack[i][1].addEventListener('click', ev => {
            ev.preventDefault();
            this.openPage(this.getStackIdById(event.currentTarget.id));

        });
        this.dataStack[i][0].addEventListener('click', ev => {
            if( this.opened ) {
                ev.preventDefault();
                this.openPage(this.getStackIdById(event.currentTarget.id));
            }
        });
        if (i == this.currentPage) {
            this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 0, 0)'; 
            this.dataStack[i][0].style.transform = 'translate3d(0, 0, 0)';
            this.dataStack[i][0].style.zIndex = 0;
        } else {
        	this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; 
            this.dataStack[i][0].style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
            this.dataStack[i][0].style.zIndex = -i;
        }
    }
    
    openPage(index) {
        var c = 1;
        for(var i = 0; i<this.totalPages; i++) {
            if (i == index) {
                this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 0, 0)'; 
                this.dataStack[i][0].style.transform = 'translate3d(0, 0, 0)';
                this.dataStack[i][0].style.zIndex = 0;
            } else {
                this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*c) + 'px)'; 
                this.dataStack[i][0].style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*c) + 'px)';
                this.dataStack[i][0].style.zIndex = -c;
                c++;
            }
        }
        this.button.classList.remove('menu-button--open');
        this.nav.classList.remove('pages-nav--open');
		this.onEndTransition(this.dataStack[index][0], ev => {
			this.stack.classList.remove('pages-stack--open');
			this.opened = false;
			this.currentPage = index;
		});
    }

    toggle() {
    	if (this.opened) {
    		this.openPage(this.currentPage);
    	} else {
    		this.openMenu();
    	}
    }
    getPagesIds() {
    	let pages = [];
    	this.dataStack.forEach(stack => { pages.push(stack[2]); });
    	return pages;
    }
    isOpened() { return this.opened; }
    openMenu() {
    	this.button.classList.add('menu-button--open');
    	this.stack.classList.add('pages-stack--open');
    	this.nav.classList.add('pages-nav--open');
    	this.opened = true;
        var c = 1;
        for(var i = 0; i<this.totalPages; i++) {
            if (i == this.currentPage) {
                this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200) + 'px)'; 
                this.dataStack[i][0].style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200) + 'px)';
                this.dataStack[i][0].style.zIndex = 0;
            } else {
                this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*c) + 'px)'; 
                this.dataStack[i][0].style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*c) + 'px)';
                this.dataStack[i][0].style.zIndex = -c;
                c++;

            }
        } 
    }  
}

/* class ContextMenu {
	constructor() {

	}
	addElement() {

	}
	removeElement() {

	}
	toggle() {
		
	}
} */