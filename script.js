"use strict";
var app = app || {};
var canvas;
var canvas_context;
app.KEYBOARD = {
    "KEY_LEFT": 37,
    "KEY_UP": 38,
    "KEY_RIGHT": 39,
    "KEY_DOWN": 40
};
app.keydown = [];

const GAME_ITEM_TYPE_LIST = ["WEAPONS", "APPAREL", "POTIONS", "SCROLLS", "INGREDIENTS", "BOOKS", "KEYS", "MISC."];

window.onload = function()
{
    console.log("window has loaded");
    canvas = document.querySelector("#canvas");
    canvas_context = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 500;
    window.addEventListener("keydown", function(e)
	{
		app.keydown[e.keyCode] = true;
	});
	window.addEventListener("keyup",function(e)
	{
		app.keydown[e.keyCode] = false;
	});
    app.Skyrim_Menu.init();
    
}