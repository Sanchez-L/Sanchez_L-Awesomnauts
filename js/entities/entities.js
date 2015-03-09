//sets the size of my player and 
game.playerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        this.body.setVelocity(5, 20);

        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("smallWalk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 159);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        //check if right button is pressed
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //this line says to unflip the aniimation 
            this.flipX(false);
        } else {
            this.body.vel.x = 0;
        }
        if(!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
        }
        
        //this checks if a left button is pressed.
        if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(true);
        } else {
            this.body.vel.x = 0;
        }
        //this checks if the player jumps
        if (me.input.isKeyPressed('jump')) {
//            console.log(me.state);
//            me.state.change(1);
            //me.state.change(me.state.MENU);
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
                // play some audio 
                me.audio.play("jump");
            }
        }
        //these are my controlles for my player
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        //this is the position between mario and whatever he hits or lands on 
        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }



        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    }
});