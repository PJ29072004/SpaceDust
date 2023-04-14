C = document.getElementById("C")
c = C.getContext("2d")
r = 2
dx = 20
if(navigator.userAgent.match(/Android/i)){
    r = 5
    dx = 50
}
noiseState = 0
noise = []
texture = []
field = []
tr = 1000
x = 0
y = 0
G = 50
function resize(){
    C.width = window.innerWidth
    C.height = window.innerHeight
    texture=[]
    noise=[]
    for(var i=0;i<C.width/dx;i++){
        var L = []
        var N = []
        for(var j=0;j<C.width/dx;j++){
            L.push(Math.random())
            var n = []
            for(var k=0;k<6;k++){
                n.push(Math.random())
            }
            N.push(n)
        }
        texture.push(L)
        noise.push(N)
    }
}
window.onresize = function(){
    resize()
    move()
}
resize()
function Dot(x,y,col=0){
    c.fillStyle = `rgb(${255*Math.cos(col/100)},${255*Math.sin(col/100)},${col})`
    c.beginPath()
    c.arc(x,y,r,0,6.3)
    c.closePath()
    c.fill()
}
function rDots(N=3000){
    c.clearRect(0,0,C.width,C.height)
    for(var i=0;i<N;i++){
        Dot(Math.random()*C.width,Math.random()*C.height)
    }
}
function Disturbance(){
    c.clearRect(0,0,C.width,C.height)
    noiseState = (noiseState+2) % 6
    for(var i = 0;i<noise.length;i+=1){
        for(var j=0;j<noise[0].length;j+=1){
            //var R = Math.sqrt((x-i*dx)**2 + (y-j*dx)**2)
            Dot(field[i][j][1] + noise[i][j][noiseState] + dx*texture[i][j],field[i][j][2] + noise[i][j][noiseState+1] + dx*texture[i][j],field[i][j][0]*(1+4*texture[i][j])/5)
        }
    }
}
function move(){
    field = []
    for(var i = 0;i<noise.length;i+=1){
        L = []
        for(var j=0;j<noise[0].length;j+=1){
            var R = Math.sqrt((x-i*dx)**2 + (y-j*dx)**2)
                L.push([R,i*dx + G*(i*dx-x)/(1+R) ,j*dx+G*(j*dx-y)/(1+R)])
        }
        field.push(L)
    }
}
move()
document.addEventListener("mousemove",function(e){
    x = e.clientX
    y = e.clientY
    move()
})
document.addEventListener("touchmove",function(e){
    x = e.touches[0].clientX
    y = e.touches[0].clientY
    G = 3*e.touches[0].radiusX
    move()
})
D = setInterval(Disturbance,50)
