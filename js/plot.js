class plot_data {
    constructor(x, y, color) {
        this._x = x;
        this._y = y;
        this._color = color;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get color() {
        return this._color;
    }
}

function default_format(out) {
    if (out == undefined) {
        return out;
    }
    if (out >= 0.1 && out <= 10000.0) {
        return out.toFixed(3);
    }

    return out.toExponential(3);
}

function draw_graph(data, x_label, y_label, format_x = default_format, format_y = default_format) {

    // Unpack inputs
    let x_values = data[0].x;
    let y_values = data[0].y;

    // Get the canvas graph
    let canvas = document.getElementById("graph");

    // Check if context exists
    if (canvas.getContext) {

        // Get the 2D context
        let context = canvas.getContext("2d");

        //INPUTS
        if (x_values === null) {
            x_values = [0];
        }
        if (y_values === null) {
            y_values = [0];
        }

        // Global Constants
        let x_start = 75;
        let y_start = 75;
        let border_width = 10;
        let x_border_width = 15;
        let y_border_width = 10;
        let x_offset = 15;
        let y_offset = 0;
        let x_minor_count = 10;
        let y_minor_count = 10;
        let y_str_offset = 27;
        let x_str_offset = 50;

        // Canvas and graph sizes
        let width = canvas.width;
        let height = canvas.height;
        let inner_width = canvas.width - border_width;
        let inner_height = canvas.height - border_width;
        let graph_width = inner_width - 2 * x_start;
        let graph_height = inner_height - 2 * y_start;

        // Draw canvas background
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "white";
        context.fillRect(border_width / 2, border_width / 2, inner_width, inner_height);

        // Get the min/max x values
        let x_min = Math.min.apply(null, x_values);
        let x_max = Math.max.apply(null, x_values);

        // Get min/max y values
        let y_min = Math.min.apply(null, y_values);
        let y_max = Math.max.apply(null, y_values);

        // Draw minor axes and value strings
        {
            // Calculate axis label positions
            let x_axis_y = y_start + graph_height + x_border_width;
            let y_axis_x = x_start - y_border_width;

            // Position tick marks
            let dx = Math.floor(graph_width / x_minor_count);
            let dy = Math.floor(graph_height / y_minor_count);

            // Value tick marks
            let dx_val = (x_max - x_min) / x_minor_count;
            let dy_val = (y_max - y_min) / y_minor_count;

            // Write x values
            for (let i = 0, x = 0, x_val = x_min; i <= x_minor_count; i++ , x += dx, x_val += dx_val) {

                // Create x axis value string
                let x_str = format_x(x_val).toString();

                // Calculate x minor position
                let x_pos = x_start + x

                // Draw x minor axis
                context.fillStyle = "grey";
                context.fillRect(x_pos, y_start, 1, graph_height);

                // Draw x minor axis value string
                context.fillStyle = "black";
                context.textAlign = "right";
                context.fillText(x_str, x_pos + x_offset, x_axis_y);
            }

            // Write y axis values
            for (let i = 0, y = 0, y_val = y_max; i <= y_minor_count; i++ , y += dy, y_val -= dy_val) {

                // Create y axis value string
                let y_str = format_y(y_val).toString();

                // Calculate y minor position
                let y_pos = y_start + y

                // Draw y minor axis
                context.fillStyle = "grey";
                context.fillRect(x_start, y_pos, graph_width, 1);

                // Draw y minor axis value string
                context.fillStyle = "black";
                context.textAlign = "right";
                context.fillText(y_str, y_axis_x, y_pos + y_offset);
            }
        }

        // Draw gradient line data
        let curves = data.length;
        for (let i = 0; i < curves; i++) {

            // Get the x/y values
            let x_val = data[i].x;
            let y_val = data[i].y;
            let color = data[i].color;

            // Calculate graph position value translation
            let xslope = graph_width / (x_max - x_min);
            let yslope = graph_height / (y_max - y_min);

            // Draw lines
            context.lineWidth = 3;
            for (let i = 0; i < x_val.length - 1; i++) {

                // Calculate line start and stop
                let x0_point = xslope * (x_val[i] - x_min) + x_start;
                let x1_point = xslope * (x_val[i + 1] - x_min) + x_start;
                let y0_point = graph_height - yslope * (y_val[i] - y_min) + y_start;
                let y1_point = graph_height - yslope * (y_val[i + 1] - y_min) + y_start;

                // Create a line gradient
                let grad = context.createLinearGradient(x0_point, y0_point, x1_point, y1_point);
                grad.addColorStop(0, color[i]);
                grad.addColorStop(1, color[i + 1]);
                context.strokeStyle = grad;

                // Draw line
                context.beginPath();
                context.moveTo(x0_point, y0_point);
                context.lineTo(x1_point, y1_point);
                context.stroke();
            }
        }

        // Save default state for later use
        context.save();

        // Draw axis labels
        {
            // Set axis text font
            context.font = "16px 'Arial', sans-serif";

            // Draw X axis label
            context.fillText(x_label, width / 2 + border_width, graph_height + x_start + x_str_offset);

            // Draw Y axis label
            context.translate(y_str_offset, y_start + graph_height);
            context.rotate(-Math.PI / 2);
            context.fillText(y_label, (y_start + graph_height) / 2, 0);
        }

        // Restore default stare
        context.restore();
    }
}

function clear_graph() {

    // Get the canvas
    let canvas = document.getElementById("graph");

    // Check if context exists
    if (canvas.getContext) {

        // Get the 2D context
        let context = canvas.getContext("2d");

        // Clear rect on canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function update_graph(x, data, color, x_label, y_label) {

    // Clear the graph
    clear_graph();

    // Draw the graph
    draw_graph(x, data, color, x_label, y_label);
}
