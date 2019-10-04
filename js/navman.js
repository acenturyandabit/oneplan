//v2.3 animations, consistency, move samples up

/*
A sample page file:

navman.addpage('title', function () {
    this.style = document.createElement("style");
    this.style.innerHTML=`
        OPTIONAL -- TODO make this into a shadow dom.
    `;
    this.div = document.createElement("div");
    this.div.innerHTML = `
    <p>Stuff
    `;
})
navman.navigateTo("title",something);
navman.on("navigate",(t)=>{
    if (t.dest=='title'){
        do stuff;
    }
    t.data==something;
})

You can also use animations!
navman.defaultAnimation = 'fadein' || ... more soon
navman.navigateTo("title",{animation:'fadein'})
*/




function _navman(){
    //Add an event library.
    let me=this;
    this.events = {};
    this.fire = function (e, args) {
        if (this.events[e]) {
            this.events[e].forEach((f, i) => {
                try {
                    f(args)
                } catch (e) {
                    console.log(e);
                }
            });
        }
    };

    this.on = function (e, f) {
        _e = e.split(',');
        _e.forEach((i) => {
            if (!this.events[i]) this.events[e] = [];
            this.events[i].push(f);
        })
    };
    //Create the navigation stack to handle 'back' calls.
    this.navStack=[];
    this.pages={};
    document.addEventListener("DOMContentLoaded", function(){
        window.history.pushState({}, '');
        for (i in me.pages){
            document.body.appendChild(me.pages[i].div);
            if (me.pages[i].style)document.body.appendChild(me.pages[i].style);
        }

        //also styles
        let s = document.createElement("style");
        s.innerHTML=`
        .__navman_fadein_class{
            animation: __navman_fadein 0.5s;
        }
        @keyframes __navman_fadein {
            from { opacity: 0; }
            to   { opacity: 1; }
        }`;
        document.head.appendChild(s);

    })

    this.addpage=function(name,page){
        let _page=page;
        if (typeof page=='function')_page=new page();
        this.pages[name]=_page;
    }

    this.wrap=function(div,settings){
        //Wraps the div in contextually relevant fluff to ensure that it can be navigated away from, etc.
        //return _div;
    }

    this.navigateTo=function(pageName,params){
        //ready arguments for firing the navigate event.
        let args = {
            prev: this.navStack[this.navStack.length - 1],
            dest: pageName,
            cancel: () => {
                args._cancel = true;
            },
            _cancel: false,
            data:params
        };
        if (!pageName) {
            args.dest = this.navStack[this.navStack.length - 1];
        } else {
            args.dest = pageName;
        }
        this.fire('navigate', args);
        
        if (!args._cancel) {
            //hide all other pages
            for (let pg in this.pages){
                this.pages[pg].div.style.display="none";
            }
            if (!pageName) {//going back
                window.history.pushState({}, ''); // Pop the state.
                this.navStack.pop();               
            } else { // new page
                this.navStack.push(pageName);
            }
            this.pages[this.navStack[this.navStack.length - 1]].div.style.display="block";
            if ((params && params.animation) || this.defaultAnimation){
                let anim=this.defaultAnimation;
                if (params)anim=anim || params.animation;
                this.pages[this.navStack[this.navStack.length - 1]].div.classList.add(`__navman_${anim}_class`)
            }
        }
        //show the required page
        //push it onto the stack
    }

    this.back=function(){
        // pop the stack and move backwards
        this.navigateTo();
    }

    window.addEventListener('popstate', function () {
        me.back();
    })

    



}
var navman= new _navman();