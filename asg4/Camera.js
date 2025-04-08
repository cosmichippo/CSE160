class Camera{

    constructor(){
        this.type = 'camera';
        this.rotate_constant = 0.175; // Pi / 18;
        this.rotate_neg_constant = -0.175;
        this.at_scalar = 100;
        this.at = new Vector3([0, 5, -95]);
        this.eye = new Vector3([0, 5, 7]);
        this.up = new Vector3([0,1,0]);
        this.matrix = new Matrix4();

        document.addEventListener('keydown', (ev)=>{
            if (ev.key === 'w'){
                console.log("test");
                this.move_back();
                //console.log(this.eye);
            }
            if (ev.key === 's'){
                this.move_forwards();
            }
            if (ev.key === 'a'){
                this.move_left();
            }
            if(ev.key === 'd'){
                this.move_right();
            }

            if(ev.key === 'j'){
                this.rotate_x(this.rotate_neg_constant);
                //this.at.elements[1] += this.rotate_constant;
                this.updateMatrix();
            }
            if(ev.key === 'l'){
                //this.at.elements[1] -= this.rotate_constant;
                this.rotate_x(this.rotate_constant);
                this.updateMatrix();
            }

            if (ev.key === 'i'){
                this.rotate_y(this.rotate_constant);
                this.updateMatrix();
            }

            if(ev.key === 'm'){
                //this.rotate_y(this.rotate_constant);
                //this.at.elements[1] += this.rotate_constant;
                //this.updateMatrix();
                let test = new Cube();
                let norm = this.get_norm();
                norm.mul(-1);
                norm.add(this.eye);
                test.matrix = new Matrix4();
                test.matrix.rotate(-g_globalAngle,0,1,0);
                test.matrix.translate(...norm.elements);
                //console.log(test.matrix);
                console.log(norm.elements);
                all_blocks.push(test);

            }

            if (ev.key == 'n'){
                let norm = this.get_norm();
                norm.mul(-1);
                norm.add(this.eye);

                let n = new Cube();
                n.matrix = new Matrix4();
                n.matrix.setTranslate(...norm.elements);

                //all_blocks.push(n);

                for (let i = 0; i < all_blocks.length; i++){
                    let block = all_blocks[i];
                    if (Camera.looking(block, norm)){
                        console.log("Yes!!!");
                        all_blocks.splice(i, 1);
                    }else{
                        console.log("no");
                    }
                }
                
            }

            if(ev.key === 'k'){
                //this.at.elements[1] -= this.rotate_constant;
                this.rotate_y(this.rotate_neg_constant);
                this.updateMatrix();
            }
        });

        document.getElementById("webgl").addEventListener('mousemove',(ev) =>{
            //console.log(ev.movementX);
            let xPos = ev.movementX * Math.PI / 180;
            let yPos = ev.movementY * Math.PI / -180;
            this.rotate_x(xPos);
            //this.rotate_y(yPos);
            this.updateMatrix();

        });
        document.getElementById("webgl").addEventListener('mousedown', (ev) =>{
            if (ev.button === 2){
            let test = new Cube();
            let norm = this.get_norm();
            norm.mul(-1);
            norm.add(this.eye);
            test.matrix = new Matrix4();
            test.matrix.rotate(-g_globalAngle,0,1,0);
            test.normalMatrix.setInverseOf(test.matrix).transpose();

            test.matrix.translate(...norm.elements);
            all_blocks.push(test);
            }
            else if (ev.button === 0){
                let norm = this.get_norm();
                norm.mul(-1);
                norm.add(this.eye);

                let n = new Cube();
                n.matrix = new Matrix4();
                n.matrix.setTranslate(...norm.elements);

                //all_blocks.push(n);

                for (let i = 0; i < all_blocks.length; i++){
                    let block = all_blocks[i];
                    if (Camera.looking(block, norm)){
                        console.log("Yes!!!");
                        all_blocks.splice(i, 1);
                    }else{
                        console.log("no");
                    }
                }
            }
        });

        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });


    }

    move_forwards(){
        let f = new Vector3(this.eye.elements);
        //console.log(f);
        f.sub(this.at);
        f.normalize();
        this.eye.add(f);
        this.at.add(f);
        console.log(this.eye);
        this.updateMatrix();
    }
    move_back(){
        let f = new Vector3(this.eye.elements);
        let zero = new Vector3([0,0,0]);
        console.log("eye", this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(-1.5);
        f.add(zero);
        console.log(f);
        this.eye.add(f);

        this.at.add(f);
        console.log(this.eye.elements);
        this.updateMatrix();
    }

    move_left(){
        let dir = new Vector3(this.eye.elements).sub(this.at).normalize();
        let left = Vector3.cross(dir, this.up);
        let zero = new Vector3([0,0,0]);
        left.add(zero);
        this.eye.add(left);
        this.at.add(left);
        console.log(left);
        this.updateMatrix();
    }
    move_right(){
        let dir = new Vector3(this.eye.elements).sub(this.at).normalize();
        let left = Vector3.cross(dir, this.up);
        let zero = new Vector3([0,0,0]);
        left.add(zero);
        this.eye.sub(left);
        this.at.sub(left);
        console.log(left);
        this.updateMatrix();
    }

    rotate_x(rads){

        let dir = new Vector3(this.at.elements);
        let newVec;

        dir.sub(this.eye);

        let [x, y, z] = dir.elements;
        console.log("XYZ: ", x, y, z);
        let theta = Math.atan2(z, x);
        let mag = Math.sqrt(z*z + y*y + x*x);
        console.log("mag:", mag);

        theta += rads;

        let newZ, newX;
        newZ = Math.sin(theta);
        newX = Math.cos(theta);

        newVec = new Vector3([newX, 0, newZ]);
        newVec.mul(mag);
        newVec.add(this.eye);
        //console.log("mag:", mag);

        this.at.elements[0] = newVec.elements[0];
        this.at.elements[2] = newVec.elements[2];
    }

    rotate_y(rads){
        let dir = new Vector3(this.at.elements);
        let newX, newY, newZ;

        dir.sub(this.eye);

        let [x, y, z] = dir.elements;

        console.log("XYZ: ", x, y, z);
        let c = Math.sqrt(z*z + x * x);

        let mag = Math.sqrt(z*z + x*x + y*y);
        let theta = Math.atan2(y, c);
        theta += rads;

        newY = Math.sin(theta) * mag;

        newX = Math.cos(theta) * x;

        newZ = Math.cos(theta) * z;
        
        this.at.elements[0] = newX;
        this.at.elements[1] = newY;
        this.at.elements[2] = newZ;
    }

    static looking(cube, point){
        //if the camera is looking at the cube, return true; 
        let [px, py, pz] = point.elements;

        let a = cube.matrix.multiplyVector3(new Vector3([1,1,1]));
        let [ax, ay, az] = a.elements;

        let d = new Vector3(a.elements).add_arr([1,1,1]); //horrible
        let [dx, dy, dz] = d.elements;

        //compare x, z, y
        if (Math.abs(ax - px) <= Math.abs(ax-dx)){

            if (Math.abs(az - pz) <= Math.abs(az - dz)){

                if(Math.abs(ay - py) <= Math.abs(ay - dy)){
                    return true;
                }
            }
            
        }
        return false;

    }

    get_norm(){
        return new Vector3(this.eye.elements).sub(this.at).normalize();
    }

    push_to_GLSL(gl, matrixName){
        gl.uniformMatrix4fv(matrixName, false, this.matrix.elements);
    }
    
    updateMatrix(){
        let test = [...this.eye.elements, ... this.at.elements, ...this.up.elements];
        this.matrix.setLookAt(...test);
    }

}