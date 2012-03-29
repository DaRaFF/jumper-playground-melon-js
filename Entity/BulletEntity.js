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