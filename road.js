class Road{
    constructor(x,width,lane=3)
    {
        this.x=x;
        this.width=width;
        this.lane=lane;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinite=9999999;
        this.top=-infinite;
        this.bottom=infinite;
        const topleft={x:this.left,y:this.top};
        const topright={x:this.right,y:this.top};
        const bottomleft={x:this.left,y:this.bottom};
        const bottomright={x:this.right,y:this.bottom};
        this.borders=[[topleft,bottomleft],[topright,bottomright]];
    }
    centrelane(laneIndex)
    {
        const centrewidth=this.width/this.lane;
        return this.left+centrewidth/2+laneIndex+
        Math.min(laneIndex,this.lane-1)*centrewidth;
    }
    draw(ref)
    {
        ref.lineWidth=5;
        ref.strokeStyle="white";
        for(let i=1;i<=this.lane-1;i++)
        {
            const x=lerp(this.left,this.right,i/this.lane);
                ref.setLineDash([20,20]);
            
                ref.beginPath();
            ref.moveTo(x,this.top);
            ref.lineTo(x,this.bottom);
            ref.stroke();
        }
        ref.setLineDash([]);
        this.borders.forEach(border=>{
            ref.beginPath();
            ref.moveTo(border[0].x,border[0].y);
            ref.lineTo(border[1].x,border[1].y);
            ref.stroke();
        })
    }
}
