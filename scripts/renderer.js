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
        
        this.ballDirection = {x: 10, y: 10};
        this.ball = [];
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

        //Create translation matrix to use
        let translate = new Matrix(3, 3);

        //Set up translation matrix
        mat3x3Translate(translate, this.ballDirection.x, this.ballDirection.y);
        let polySize = this.ball.length;
        let i;
        //Transform the all points
        for (i = 0; i < polySize; i++)
        {
            this.ball[i] = Matrix.multiply([translate, this.ball[i]]);
        }

        for (i = 0; i < polySize; i++)
        {
            //Bounce off top/bottom
            if (this.ball[i].values[1] <= 0 || this.ball[i].values[1] >= this.canvas.height)
            {
                this.ballDirection.y = this.ballDirection.y * -1;
            }

            //Bounce off sides
            if (this.ball[i].values[0] <= 0 || this.ball[i].values[0] >= this.canvas.width)
            {
                this.ballDirection.x = this.ballDirection.x * -1;
            }
        }

        //Draw the ball
        this.drawConvexPolygon(this.ball, teal);
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        //this.drawConvexPolygon(square, [255, 0, 0, 255]);
        //console.log("hello");
        
        let teal = [0, 128, 128, 255];  
        let square_origin = new Matrix(3, 3);
        mat3x3Translate(square_origin, -200, -200);
        let square_rotate = new Matrix(3, 3);
        mat3x3Rotate(square_rotate, 15);
        let square_return = new Matrix(3, 3);
        mat3x3Translate(square_return, 200, 200);
        let mult1 = Matrix.multiply([square_return, square_rotate]);
        let mult2 = Matrix.multiply([mult1, square_origin]);
        for(let i = 0; i < this.square.length; i++) {
            this.square[i] = Matrix.multiply([mult2, this.square[i]]);
        }
        console.log(square_origin);
        console.log(square_rotate);
        console.log(square_return);
        console.log(mult1);
        console.log(mult2);
        //console.log(this.square);
        this.drawConvexPolygon(this.square, teal);
        
        
        
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
