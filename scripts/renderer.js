class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.square = [Vector3(100, 100, 1),
                       Vector3(300, 100, 1),
                       Vector3(300, 300, 1),
                       Vector3(100, 300, 1)];
        this.square_rotate = new Matrix(3, 3);

        this.pentagon = [Vector3(400, 300),
                         Vector3(600, 300),
                         Vector3(600, 500),
                         Vector3(500, 600),
                         Vector3(400, 500)];
        this.pentagon_rotate = new Matrix(3, 3);

        this.ballVelocity = {x: 1, y: 1};
        this.ball = [];
        this.slide0transform = new Matrix(3, 3);
        this.createBall(this.ball);

    }

    //This helper function creates a ball
    createBall(list)
    {
        let center = {x: this.canvas.width/2, y: this.canvas.height/2};
        let numPoints = 20;
        let increment = 2*Math.PI/numPoints;
        let xpos,ypos;
        let r = 50;
        let i = 0;
        while(i<2*Math.PI)
        {
            xpos = Math.round(r*Math.cos(i) + center.x);
            ypos = Math.round(r*Math.sin(i) + center.y);
            list.push(Vector3(xpos,ypos,1));
            i += increment;
        }
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation

        //Set up translation matrix for slide 0
        mat3x3Translate(this.slide0transform, this.ballVelocity.x*delta_time, this.ballVelocity.y*delta_time);
        mat3x3Rotate(this.square_rotate, 10*(delta_time/100));
        mat3x3Rotate(this.pentagon_rotate, 20*(delta_time/100));

    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        
        // Following line is example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)
        
        //Set teal color code
        let teal = [0, 128, 128, 255];

        /*
        //Create translation matrix to use
        let translate = new Matrix(3, 3);

        //Set up translation matrix
        mat3x3Translate(translate, this.ballVelocity.x, this.ballVelocity.y);
        */
        
        let translate = this.slide0transform;
        let polySize = this.ball.length;
        let i;
        //Transform the all points
        for (i = 0; i < polySize; i++)
        {
            this.ball[i] = Matrix.multiply([translate, this.ball[i]]);
        }
        let xdisp, ydisp, xt,yt;
        for (i = 0; i < polySize; i++)
        {
            xt = 0;
            yt = 0;
            xdisp = this.ball[i].values[0];
            //Bounce off sides
            if (xdisp <= 0 || xdisp >= this.canvas.width)
            {
                //invert the x velocity
                this.ballVelocity.x = this.ballVelocity.x * -1;
                if (xdisp < 0)
                {
                    xt = -xdisp*2;
                }
                else if (xdisp > this.canvas.width)
                {
                    xt = -(xdisp - this.canvas.width)*2;
                }
            }
            ydisp = this.ball[i].values[1];
            //Bounce off top/bottom
            if (ydisp <= 0 || ydisp >= this.canvas.height)
            {
                //invert the y velocity
                this.ballVelocity.y = this.ballVelocity.y * -1;
                if (ydisp < 0)
                {
                    yt = -ydisp*2;
                }
                else if (ydisp > this.canvas.height)
                {
                    yt = -(ydisp - this.canvas.height)*2;
                }
            }
            this.moveBall(xt,yt);
        }
        //Draw the ball
        this.drawConvexPolygon(this.ball, teal);
    }

    //Helper function translates the ball with x and y offsets, used for correcting out of bounds ball
    moveBall(x,y)
    {
        let polySize = this.ball.length;
        let i;
        let t = new Matrix(3, 3);
        mat3x3Translate(t, x, y);
        for (i = 0; i < polySize; i++)
        {
            this.ball[i] = Matrix.multiply([t, this.ball[i]]);
        }
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        //this.drawConvexPolygon(square, [255, 0, 0, 255]);
        //console.log("hello");
        
        let teal = [0, 128, 128, 255];
        let red = [255, 0, 0, 255];
        //this.drawConvexPolygon(this.pentagon, red);
        let square_origin = new Matrix(3, 3);
        let square_return = new Matrix(3, 3);
        let square_mult1 = new Matrix(3, 3);
        let square_mult2 = new Matrix(3, 3);  
        mat3x3Translate(square_return, 200, 200);
        mat3x3Translate(square_origin, -200, -200);
        square_mult1 = Matrix.multiply([square_return, this.square_rotate]);
        square_mult2 = Matrix.multiply([square_mult1, square_origin]);
        for(let i = 0; i < this.square.length; i++) {
            this.square[i] = Matrix.multiply([square_mult2, this.square[i]]);
        }
        this.drawConvexPolygon(this.square, teal);
        /*
        let pentagon_origin = new Matrix(3, 3);
        let pentagon_return = new Matrix(3, 3);
        let pentagon_mult1 = new Matrix(3, 3);
        let pentagon_mult2 = new Matrix(3, 3);  
        mat3x3Translate(pentagon_return, 500, 450);
        mat3x3Translate(pentagon_origin, -500, -450);
        pentagon_mult1 = Matrix.multiply([pentagon_return, this.pentagon_rotate]);
        pentagon_mult2 = Matrix.multiply([pentagon_mult1, pentagon_origin]);
        for(let j = 0; j < this.pentagon.length; j++) {
            this.pentagon[j] = Matrix.multiply([pentagon_mult2, this.pentagon[j]]);
        }
        this.drawConvexPolygon(this.pentagon, red);
        */
        
        
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};
