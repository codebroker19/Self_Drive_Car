const carcanvas=document.getElementById("carcanvas");
carcanvas.width=200;
const networkcanvas=document.getElementById("networkcanvas");
networkcanvas.width=300;
const carref=carcanvas.getContext("2d");
const networkref=networkcanvas.getContext("2d");
const road=new Road(carcanvas.width/2,carcanvas.width*0.92);
const N=1;
const cars=generatecars(N);
let bestcar=cars[0];
if(localStorage.getItem("bestbrain")){
    for(let i=0;i<cars.length;i++)
    {
        cars[i].brain=JSON.parse(localStorage.getItem("bestbrain"));
        if(i!=0)
        {
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}
const traffic=[new Car(road.centrelane(1),-100,30,50,"DUMMY",2),
new Car(road.centrelane(0),-300,30,50,"DUMMY",2),
new Car(road.centrelane(2),-300,30,50,"DUMMY",2),
new Car(road.centrelane(0),-500,30,50,"DUMMY",2),
new Car(road.centrelane(1),-500,30,50,"DUMMY",2),
new Car(road.centrelane(1),-700,30,50,"DUMMY",2),
new Car(road.centrelane(2),-700,30,50,"DUMMY",2)];
animate();
function save()
{
    localStorage.setItem("bestbrain",
    JSON.stringify(bestcar.brain));
}
function discard(){
    localStorage.removeItem("bestbrain");
}
function generatecars(N)
{
    const cars=[];
    for(let i=0;i<N;i++)
    {
        cars.push(new Car(road.centrelane(1),100,30,50,"AI"));
    }
    return cars;
}
function animate(time)
{
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++)
    {
        cars[i].update(road.borders,traffic);
    }
    //car.update(road.borders,traffic);
     bestcar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));
    carcanvas.height=window.innerHeight;
    networkcanvas.height=window.innerHeight;
    carref.save();
    carref.translate(0,-bestcar.y+carcanvas.height*0.8);
    road.draw(carref);
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].draw(carref,"red");
    }
    carref.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++)
    {
        cars[i].draw(carref,"blue");
    }
    carref.globalAlpha=1;
    bestcar.draw(carref,"blue",true);
    //car.draw(carref,"blue");
    carref.restore();
    networkref.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkref,bestcar.brain);
    requestAnimationFrame(animate);
}