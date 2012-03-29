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
                socket.emit('message', {
                    position: {
                        x: this.pos.x,
                        y: this.pos.y,
                        z: this.z
                    }
                });
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