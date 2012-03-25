//game resources
var g_resources = [
// our level tileset
{
    name: "area01_level_tiles",
    type: "image",
    src: "data/area01_tileset/area01_level_tiles.png"
},
// our level
{
    name: "area01",
    type: "tmx",
    src: "data/area01.tmx"
},

{
    name: "area02",
    type: "tmx",
    src: "data/area02.tmx"
},
// the main player spritesheet
{
    name: "gripe_run_right",
    type: "image",
    src: "data/sprite/gripe_run_right.png"
},
// the parallax background
{
    name: "area01_bkg0",
    type: "image",
    src: "data/area01_parallax/area01_bkg0.png"
}, {
    name: "area01_bkg1",
    type: "image",
    src: "data/area01_parallax/area01_bkg1.png"
},
// the spinning coin spritesheet
{
    name: "spinning_coin_gold",
    type: "image",
    src: "data/sprite/spinning_coin_gold.png"
},
// our enemty entity
{
    name: "wheelie_right",
    type: "image",
    src: "data/sprite/wheelie_right.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/sprite/32x32_font.png"
},
// title screen
{
    name: "title_screen",
    type: "image",
    src: "data/GUI/title_screen.png"
},
// audio resources
{
    name: "cling",
    type: "audio",
    src: "data/audio/",
    channel: 2
}, {
    name: "stomp",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "jump",
    type: "audio",
    src: "data/audio/",
    channel: 1
}, {
    name: "DST-InertExponent",
    type: "audio",
    src: "data/audio/",
    channel: 1
}];


var jsApp	= 
{	
	onload: function()
	{
        me.debug.renderHitBox = true;
		
		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
            return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
    loaded: function ()
    {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new TitleScreen());

       // set the "Play/Ingame" Screen Object
       me.state.set(me.state.PLAY, new PlayScreen());

       // add our player entity in the entity pool
       me.entityPool.add("mainPlayer", PlayerEntity);
       me.entityPool.add("CoinEntity", CoinEntity);
       me.entityPool.add("EnemyEntity", EnemyEntity);

       // enable the keyboard
       me.input.bindKey(me.input.KEY.LEFT,	"left");
       me.input.bindKey(me.input.KEY.RIGHT,	"right");
       me.input.bindKey(me.input.KEY.X,     "jump", true);

       // start the game
       me.state.change(me.state.MENU);
    }

};

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

    onResetEvent: function() {
        // play the audio track
        //me.audio.playTrack("DST-InertExponent");

        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("area01");

        // add a default HUD to the game mngr
        me.game.addHUD(0, 430, 640, 60);

        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(620, 10));

        // make sure everyhting is in the right order
        me.game.sort();
    },

	onDestroyEvent: function()
	{
        // remove the HUD
        me.game.disableHUD();

        // stop the current audio track
        me.audio.stopTrack();
    }
});

var TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);

        // title screen image
        this.title = null;

        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;

        this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
        this.scrollerpos = 600;
    },

    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");

            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");

        }

        // reset to default value
        this.scrollerpos = 640;

        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

        // play something
        me.audio.play("cling");

    },

    // some callback for the tween objects
    scrollover: function() {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },

    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },

    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);

        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },

    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);

        //just in case
        this.scrollertween.stop();
    }

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
