// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

class PagesStack {
    constructor() {
        var pages = ['page-1','page-2','page-3','page-4'];
        var nav = ['nav-1','nav-2','nav-3','nav-4'];
        var ids = ['id-1','id-2','id-3','id-4'];
        this.opened = false;
        this.dataStack = [];
        this.totalPages = pages.length;
        this.currentPage = this.totalPages-1;
        for(var i = 0; i < this.totalPages; i++) {
            this.dataStack.push([pages[i],nav[i],ids[i]]);
            registerPage
        }
    }
    
    getPageById(id) {
        for(var stack in this.dataStack) {
            if (stack[2] == id) {
                return stack[2];
            }
        }
        return;
    }
    
    addPage(page,nav,id) {
        this.dataStack.push([page,nav,id]);
        this.registerPage(this.totalPages);
        this.totalPages++;
    }

    registerPage(index) {
        this.dataStack[index][1].addEventListener('click', ev => {
            ev.preventDefault();
            this.openPage(this.dataStack[index][2]);
        });
        this.dataStack[index][0].addEventListener('click', ev => {
            if( this.opened ) {
                ev.preventDefault();
                this.openPage(this.dataStack[index][2]);
            }
        });
        if( this.opened ) {
            page.classList.add('page--inactive');
            page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*index) + 'px)'; 
            page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*index) + 'px)';
            page.style.zIndex = index;
        }
        if (index == this.currentPage) {
            
        }
    }
    
    openPage(id) {
        index = this.getPageById(id);
        this.currentPage = index;
        var c = 1;
        for(var i = 0; i<this.totalPages; i++) {
            if (i == index) {
                this.dataStack[i][0].classList.remove('page--inactive');
                this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 100%, 0)'; 
                this.dataStack[i][0].style.transform = 'translate3d(0, 100%, 0)';
                this.dataStack[i][0].style.zIndex = 0;
            } else {
                this.dataStack[i][0].classList.add('page--inactive');
                this.dataStack[i][0].style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*c) + 'px)'; 
                this.dataStack[i][0].style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*c) + 'px)';
                this.dataStack[i][0].style.zIndex = c;
                c++;
            }
        }
    }
    
    open() {
        opened = true;
        
    }
    close() {
        opened = false;
        
    }
    
}

var ps = new PagesStack();