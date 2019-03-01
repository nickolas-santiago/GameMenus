"use strict";
var app = app||{};

app.Skyrim_Menu = {
    chosen_item_type: 0,
    can_scroll: true,
    
    init: function()
    {
        this.update();
    },
    renderItemMenu: function()
    {
        this.renderItemTypeList();
    },
    renderItemTypeList()
    {
        var section_width = 150;
        var section_xpos = 210;
        var section_border_width = 2;
        var section_border_buffer = 7;
        var visible_limit = 4;
        var item_type_list = ["FAVORITES", "ALL", ...GAME_ITEM_TYPE_LIST];
        
        if(app.keydown[38] == true)
        {
            if(this.can_scroll == true)
            {
                if(this.chosen_item_type > 0)
                {
                    this.chosen_item_type--;
                }
                this.can_scroll = false;
            }
        }
        else if(app.keydown[40] == true)
        {
            if(this.can_scroll == true)
            {
                if(this.chosen_item_type < (item_type_list.length - 1))
                {
                    this.chosen_item_type++;
                }
                this.can_scroll = false;
            }
        }
        else
        {
            this.can_scroll = true;
        }
        
        //---render section wrapper
        canvas_context.fillStyle = "rgba(255,255,255,0.5)";
        canvas_context.fillRect(section_xpos, 0, section_width, canvas.height);
        //---render section wrapper borders
        canvas_context.fillStyle = "rgba(255,255,255,1)";
        canvas_context.fillRect((section_xpos + section_border_buffer), 0, section_border_width, canvas.height);
        canvas_context.fillRect((section_xpos + (section_width - section_border_buffer - section_border_width)), 0, section_border_width, canvas.height);
        //---render section list
        canvas_context.textBaseline = "middle";
        for(var item_type = 0; item_type < item_type_list.length; item_type++)
        {
            if((item_type >= (this.chosen_item_type - visible_limit)) && (item_type <= (this.chosen_item_type + visible_limit)))
            {
                var item_type_xpos = (section_xpos + section_border_buffer + section_border_width + section_border_buffer);
                var item_type_ypos = 0;
                if((item_type == (this.chosen_item_type - visible_limit)) || (item_type == (this.chosen_item_type + visible_limit)))
                {
                    canvas_context.fillStyle = "rgba(255,255,255,0.5)";
                }
                else
                {
                    canvas_context.fillStyle = "rgba(255,255,255,1)";
                }
                if(item_type == this.chosen_item_type)
                {
                    canvas_context.font = "20px Arial";
                    item_type_ypos = (canvas.height/2);
                }
                else
                {
                    canvas_context.font = "15px Arial";
                    item_type_ypos = (canvas.height/2) - (40 * (this.chosen_item_type - item_type));
                }
                canvas_context.fillText(item_type_list[item_type], item_type_xpos, item_type_ypos);
            }
        }
    },
    update: function()
    {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        canvas_context.fillStyle = "orange";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        this.renderItemMenu();
        canvas_context.beginPath();
        canvas_context.moveTo(0, canvas.height/2);
        canvas_context.lineTo(canvas.width, canvas.height/2);
        canvas_context.stroke(); 
    }
};