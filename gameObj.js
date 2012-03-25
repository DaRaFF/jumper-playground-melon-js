var BulletEntity = me.ObjectEntity.extend({

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.collidable = true;
        this.gravity = 0;
        this.type = 'bullet';
    },

    update: function () {
		if (!this.visible){
			// remove myself if not on the screen anymore
            me.game.remove(this);
		}

		this.vel.x = 10;

        this.updateMovement();
        var res = me.game.collide(this);

        return true;
    }
});

var PlayerEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(3, 15);
        this.updateColRect(8, 48, -1, 0);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.type = 'mainPlayer';
        this.lastTick = 0;

    },

    update: function() {
        if (me.input.isKeyPressed('left')) {
            this.doWalk(true);
        } else if (me.input.isKeyPressed('right')) {
            this.doWalk(false);
        } else {
            this.vel.x = 0;
        }
        if (me.input.isKeyPressed('jump')) {
            if (this.doJump()) {
                me.audio.play("jump");
            }
        }

        // check & update player movement
        this.updateMovement();

        // check for collision
        var res = me.game.collide(this);

        if (res) {
            // if we collide with an enemy
            if (res.obj && res.obj.type == me.game.ENEMY_OBJECT) {
                // check if we jumped on it
                if ((res.y > 0) && ! this.jumping) {
                    // bounce
                    me.audio.play("stomp");
                    this.forceJump();
                } else {
                    // let's flicker in case we touched an enemy
                    this.flicker(45);
                }
            }
        }

        //shoot
        if (me.input.isKeyPressed('shoot')) {
            if(this.lastTick + 200 < me.timer.getTime()){
                this.lastTick = me.timer.getTime();
                var shot = new BulletEntity(this.pos.x + 20, this.pos.y, { image: 'bullet', spritewidth: 12 });
                me.game.add(shot, this.z);
                me.game.sort();
            }
        }

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;

    }
});


var CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },

    onCollision : function ()
    {
        // do something when collide
        me.audio.play("cling");
        // give some score
        me.game.HUD.updateItemValue("score", 250);
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    },


    // this function is called by the engine, when
    // an object is destroyed (here collected)
    onDestroyEvent: function() {
	    // increase score
	    me.game.HUD.updateItemValue("score", 250);

        me.game.viewport.shake(10, 30, me.game.viewport.AXIS.BOTH);
    }

});



var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "wheelie_right";
        settings.spritewidth = 64;

        // call the parent constructor
        this.parent(x, y, settings);

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite

        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;

        // walking & jumping speed
        this.setVelocity(4, 6);

        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

    },

    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        if (this.alive && (res.y > 0) && obj.falling) {
            this.flicker(45);
        }

        if (obj.type == "bullet") {
            this.alive = false;
            this.flipY(true);
            this.flicker(60);
        }
    },

    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!this.visible)
            return false;

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.doWalk(this.walkLeft);
        } else {
            this.vel.x = 0;
        }

        // check and update movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
});

var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
    },

    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }

});

