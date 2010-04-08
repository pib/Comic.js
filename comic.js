// TODO: Add auto-placement of characters and dialog

function Comic(canvas_elem) {
    this.ctx = canvas_elem.getContext('2d');
    this.title = '';
    this.copyright = '';
    this.title_font = '14px Arial';

    this.canvas_width = this.ctx.canvas.width;
    this.canvas_height = this.ctx.canvas.height;

    this.objects = [];
}

Comic.prototype = {
    drawTitle: function() {
        this.ctx.save();

        this.ctx.font = this.title_font;
        this.ctx.textBaseline = 'bottom';
        var full_title = this.copyright ? this.title + ' ' + this.copyright : this.title;
        var title_size = this.ctx.measureText(full_title);
        var title_x = this.canvas_width - title_size.width;
        var title_y = this.canvas_height;
        this.ctx.fillText(full_title, title_x, title_y);

        this.ctx.restore();
    },
    render: function() {
        this.drawObjects();
        this.drawBorder();
        this.drawTitle();
    },

    drawBorder: function() {
        this.ctx.strokeRect(5, 5, this.canvas_width - 10, this.canvas_height - 10 - 14);
    },

    drawObjects: function() {
        var object_count = this.objects.length;
        var obj;
        for (var i=0; i<object_count; i++) {
            this.ctx.save();
            this.objects[i].render(this.ctx);
            this.ctx.restore();
        }
    },

    addObject: function(obj, x, y) {
        this.objects.push(obj);
    }
};

function Character(x, y) {
    Character.count += 1;
    this.name = 'person ' + Character.count;
    this.gender = 'male';
    this.x = x;
    this.y = y;
    this.dialog = [];
}

Character.count = 0;
Character.prototype = {


    /* Render this character at their assigned location. Assume that
     * ctx.save and ctx.restore will be called by the caller
     */
    render: function(ctx) {
        ctx.translate(this.x, this.y);

        this.render_body(ctx);
        this.render_limbs(ctx);
        this.render_head(ctx);
        this.render_clothes(ctx);

        this.render_dialog(ctx);
    },
    addDialog: function(text, x, y) {
        this.dialog.push(new Dialog(text, x, y));
    },
    render_dialog: function(ctx) {
        var dialog_length = this.dialog.length;
        if (!dialog_length) return;
        for (var i=0; i<dialog_length; i++) {
            ctx.save();
            // reset center to the character's head
            ctx.translate(0, -90);
            this.dialog[i].render(ctx);
            ctx.restore();
        }
    },
    render_body: function(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(0, 75);
        ctx.stroke();

    },
    render_limbs: function(ctx) {
        ctx.beginPath();
        ctx.moveTo(-60, -25);
        ctx.lineTo(0, -15);
        var dir = this.gender == 'female' ? -1 : 1;
        ctx.lineTo(60, dir * -25);

        ctx.moveTo(-50, 180);
        ctx.lineTo(0, 75);
        ctx.lineTo(50, 180);

        ctx.stroke();
    },
    render_head: function(ctx) {
        ctx.beginPath();
        ctx.arc(0, -90, 40, 0, Math.PI*2, true);
        ctx.closePath();

        // glasses
        ctx.save();
        ctx.translate(0, -90);

        ctx.moveTo(-40, -10);
        ctx.lineTo(-30, -5);

        ctx.moveTo(40, -10);
        ctx.lineTo(30, -5);

        ctx.moveTo(-30, -10);
        ctx.lineTo(-30, 5);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-5, -10);
        ctx.closePath();

        ctx.moveTo(-5, -3);
        ctx.lineTo(5, -3);

        ctx.moveTo(30, -10);
        ctx.lineTo(30, 5);
        ctx.lineTo(5, 5);
        ctx.lineTo(5, -10);
        ctx.closePath();


        ctx.restore();

        ctx.stroke();
    },
    render_clothes: function(ctx) {
        if (this.gender == 'female') {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(-10, -25);
            ctx.lineTo(-50, 150);
            ctx.lineTo(50, 150);
            ctx.lineTo(10, -25);
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

    }
};

function Dialog(text, x, y, c_x, c_y) {
    this.text = text;
    this.x = x;
    this.y = y;
}

// TODO: un-hard-code line height
Dialog.line_height = 12;
Dialog.prototype = {
    /*
     * Draw the dialog box, with tail pointing toward the current 0,0
     */
    render: function(ctx) {
        ctx.font = '12px Helvetica';

        var lines = this.text.split('\n');
        // TODO: add max-width option and auto-wrap text at that width
        var line_count = lines.length;
        var top_offset = 0;
        var max_width = 0;
        for (var i=0; i<line_count; i++) {

            var txt_size = ctx.measureText(lines[i]);
            max_width = Math.max(txt_size.width, max_width);

            ctx.fillText(lines[i], this.x, this.y + top_offset);
            top_offset += Dialog.line_height;
        }
        this.draw_tail(ctx, max_width);
    },
    draw_tail: function(ctx, max_width) {
        if (this.x >= 0) {
            var txt_x = this.x - 2;
            var txt_y = this.y - Dialog.line_height / 4;
        }
        else {
            var txt_x = this.x + max_width + 2;
            var txt_y = this.y - Dialog.line_height / 4;
        }

        var tail_x = txt_x / 1.75;
        var tail_y = txt_y / 1.75;
        ctx.beginPath();
        ctx.moveTo(txt_x, txt_y);
        ctx.lineTo(tail_x, tail_y);
        ctx.stroke();
    }
};