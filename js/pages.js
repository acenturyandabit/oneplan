navman.defaultAnimation='fadein';


navman.addpage('landing', function () {
    this.div = document.createElement("div");
    this.div.style.textAlign = "center";
    this.div.innerHTML = `
    <img src="op.png" style="height: 5em">
    <h1>Oneplan</h1>
    <input placeholder="Enter ID">
    <button>View plan</button>
    `;
    this.div.querySelector("button").addEventListener("click", () => {
        navman.navigateTo("main",this.div.querySelector("input").value);
    })
})


navman.addpage('main', function () {
    this.div = document.createElement("div");
    this.div.innerHTML = `
    <h1><img src="op.png" style="height: 0.7em"> <span id="dn">{document name}</span><a id="lid">FIND UNICODE LINK</a></h1>
        <div style="display:flex; flex-direction: row; height: 90%">
            <div style="margin: 1em">
                <h2>Versions</h2>
                <p>Version 0</p>
                <button>Upload revision</button>
            </div>
            <div style="flex:1 0 auto; margin: 1em">
                <canvas>
                <img style="display:none" src="">
            </div>
        </div>
    `;
    navman.on("navigate",(p)=>{
        if (p.dest=='main'){
            this.div.querySelector("#dn").innerHTML=p.data;
            this.div.querySelector("#lid").href="?ln="+p.data;
        }
    });
    //make button add one more revision
    //make click draggable image
    this.canvas=this.div.querySelector("canvas");
    this.canvas.addEventListener("mousedown",(e)=>{
        this.moving=true;
        this.op={x:e.screenX,y:e.screenY};
    })
    this.canvas.addEventListener("mousemove",()=>{
        if (this.moving){
            //redraw
        }
    });
    this.canvas.addEventListener("mouseup",()=>{

    })
})

navman.navigateTo('landing');