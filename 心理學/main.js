const canvas=document.getElementById("canvas");
let ww=window.innerWidth;
let hh=window.innerHeight;
canvas.width=ww-20;
canvas.height=hh-20;

const ctx=canvas.getContext("2d");

let fps=100;
let tt=0;
let timeRecord=0;
let mode=0;
let maxMode=101;
let number;
let count;
let countRecord=0;
let consistance;
let str="";
let datas=[];


function init(){
    document.addEventListener("keydown",(e)=>{
        if(e.code=="Enter"){
            if(mode==0){
                mode+=1;
                newData();
                timeRecord=tt;
            }
        }
        if(e.code[5]==count&&0<mode&&mode<maxMode){
            mode+=1;
            
            datas.push({
                rt:tt-timeRecord,
                consistance:consistance,
                number:number,
                count:count
            })
            timeRecord=tt;
            newData();
        }
    })
}
function update()
{
    ctx.fillStyle="black";
    ctx.fillRect(0,0,ww,hh);
    ctx.fillStyle="white";
    ctx.font="60px Arial";
    if(mode==0){
        ctx.fillText("Enter to start",ww/2-ctx.measureText("Enter to start").width/2,hh/2);
    }else if(mode<maxMode){
        ctx.fillText(str,ww/2-ctx.measureText(str).width/2,hh/2);
    }else{
        graph();

    }
    tt+=1000/fps;
    
}
function newData(){
    if(Math.random()>0.5){
        consistance=true;
    }else{
        consistance=false;
    }
    number=Math.floor(Math.random()*9+1);
    count=number;
    if(!consistance){
        while(count==number){
            count=Math.floor(Math.random()*9+1);
        }
        
    }
    if(count==countRecord){
        newData();
        return;
    }
    countRecord=count;
    str="";
    for(let i=0;i<count;i++){
        str+=" "+number;
    }
    
}
function graph(){
    let max_rt=0;
    let con_count=0;
    let inc_count=0;
    let con_sum=0;
    let inc_sum=0;
    for(let data of datas){
        if(data.consistance){
            con_count++;
            con_sum+=data.rt;
        }else{
            inc_count++;
            inc_sum+=data.rt;
        }
        if(data.rt>max_rt){
            max_rt=data.rt
        }
    }
    ctx.font="20px Arial";
    ctx.fillStyle="gray"
    for(let i=0;i<max_rt/100+1;i++){
        if(i%5==0)ctx.fillText(i/10,170-2*(i%10),600-500*i*100/max_rt);
        ctx.fillRect(200,600-500*i*100/max_rt,1000,1);
    }
    for(let i=0;i<9;i++){
        ctx.fillText(i+1,200+100*(i+1),630);
    }
    
    for(let data of datas){
        if(data.consistance){
            ctx.fillStyle="green"
        }else{
            ctx.fillStyle="red"
        }
        ctx.beginPath();
        ctx.arc(200+100*data.count,600-500*data.rt/max_rt,5,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillStyle="white"
    ctx.fillText("consistant RT: ",1250,200);
    ctx.fillText(Math.round(con_sum/con_count)/1000,1250,250);
    ctx.fillText("inconsistant RT: ",1250,400);
    ctx.fillText(Math.round(inc_sum/inc_count)/1000,1250,450);


}

init();
setInterval(update, 1000/fps);