class Sensor{
    constructor(car)
    {
        this.car=car;
        this.raycount=5;
        this.raylength=150;
        this.rayspread=Math.PI/2;
        this.rays=[];
        this.readings=[];
    }
    update(roadBorders,traffic)
    {
        this.#castRays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++)
        {
           this.readings.push(this.#getReading(this.rays[i],roadBorders,traffic));  
        }
    }
    #getReading(ray,roadBorders,traffic)
    {
        let touches=[];
        for(let i=0;i<roadBorders.length;i++)
        {
            const touch=getIntersection(ray[0],ray[1],roadBorders[i][0],roadBorders[i][1]);
            if(touch)
        {
            touches.push(touch);
        }
        }
        for(let i=0;i<traffic.length;i++)
        {
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++)
            {
                const value=getIntersection(ray[0],ray[1],poly[j],poly[(j+1)%poly.length]);
                if(value)
                {
                    touches.push(value);
                }
            }
        }
        if(touches.length==0)
        {
            return null;
        }
        else{
            const offsets=touches.map(e=>e.offset);
            const mini=Math.min(...offsets);
            return touches.find(e=>e.offset==mini);
        }
    }
    #castRays()
    {
        this.rays=[];
        for(let i=0;i<this.raycount;i++)
        {
            const rayangle=lerp(this.rayspread/2,
            -this.rayspread/2,
            this.raycount==1?0.5:i/(this.raycount-1))+this.car.angle;

            const start={x:this.car.x,y:this.car.y};
            const end={
                x:this.car.x-Math.sin(rayangle)*this.raylength,
                y:this.car.y-Math.cos(rayangle)*this.raylength
            };
            this.rays.push([start,end]);
        }
    }
    draw(ref){
        for(let i=0;i<this.raycount;i++)
        {
            let end=this.rays[i][1];
            if(this.readings[i])
            {
                end=this.readings[i];
            }
            ref.beginPath();
            ref.lineWidth=2;
            ref.strokeStyle="yellow";
            ref.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            ref.lineTo(end.x,end.y);
            ref.stroke();
            ref.beginPath();
            ref.lineWidth=2;
            ref.strokeStyle="black";
            ref.moveTo(this.rays[i][1].x,this.rays[i][1].y);
            ref.lineTo(end.x,end.y);
            ref.stroke();
        }
    }
}