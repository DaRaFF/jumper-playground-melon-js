var TeammateEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
        // define this here instead of tiled
//        settings.image = "wheelie_right";
//        settings.spritewidth = 32;

        // call the parent constructor
        this.parent(x, y, settings);
        this.type = 'TeammateEntity';

        this.startX = x;
//        this.endX = x + settings.width - settings.spritewidth;
    },

    update: function() {
        this.pos.x = 100;

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