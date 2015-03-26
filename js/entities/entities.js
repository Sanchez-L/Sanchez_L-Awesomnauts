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
        this.body.setVelocity(10, 15);
        //keeps track on what direction my player is facing
        this.facing = "right";
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 159);
        this.renderable.setCurrentAnimation("idle");
        this.renderable.addAnimation("attack", [89, 90, 91, 92, 93, 94, 95, 96, 97, 98], 80);
    },
    update: function(delta) {
        //check if right button is pressed
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //this line says to unflip the animation when going right
            this.facing = "right";
            this.flipX(false);
        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            //this line says to unflip the animation when going right
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(true);
        }
        else {
            this.body.vel.x = 0;
        }


        //this checks if a left button is pressed.

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
            } else if (me.input.isKeyPressed('jump')) {
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
        }
        //these are my controlles for my player
        //me.collision.check(this, true, this.collideHandler.bind(this), true);
        //this is the position between mario and whatever he hits or lands on 

        if (me.input.isKeyPressed("attack")) {
             
            console.log("attack1");
            if (!this.renderable.isCurrentAnimation("attack")) {
                 
                console.log("attack2");
                //sets the currnt animation to attack and thenn go back to idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that the next time we start this sequence we begin
                //from the first animation not wherever we switched to another animation
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }else if (!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
                                                                                              
    },
    collideHandler: function(response) {
        //console.log(response.b.type);
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            console.log("xdif" + xdif + "ydif" + ydif);
            if (ydif<-40 && xdif<70 && xdif>-35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if (xdif>-35 && this.facing === 'right' && (xdif<0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            } else if (xdif<70 && this.facing === 'left' && (xdif>0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }
        }
    }
});

game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 70)).toPolygon();
                }

            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "PlayerBaseEntity";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderrable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }
});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 70)).toPolygon();

                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "EnemyBaseEntity";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderrable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }
});