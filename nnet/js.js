function x_format(x) {
    return x.toPrecision(3);
}

function y_format(y) {
    return y.toPrecision(3);
}

function power(x) {
    return x * x;
}

function sin(x) {
    return Math.sin(x);
}

function update_y_values(tbody, rows) {

    // Get the fitting function
    let func = Number(document.querySelector('input[name="in_function"]:checked').value);

    // For each row in data table
    for (let i = 0; i < rows; i++) {

        // Get the table row
        let row = tbody.rows[i];

        // Select fit function
        let y_val = 0.2 * i;
        if (func == 0) {
            row.getElementsByClassName("in_y")[0].value = power(y_val).toFixed(2);
        }
        else if (func == 1) {
            row.getElementsByClassName("in_y")[0].value = sin(y_val).toFixed(2);
        }
    }
}

function on_radio_select() {

    // Get the table
    let table = document.getElementById("fit_table");

    // Get the table body
    let tbody = table.getElementsByTagName("tbody")[0];

    // Get number of rows
    let rows = tbody.getElementsByTagName("tr").length;

    // Update the y values
    update_y_values(tbody, rows);
}

function add_rows(tbody, rows, count) {

    // Create a document fragment
    let fragment = document.createDocumentFragment();

    // Get last row in table to clone
    let row_clone = tbody.rows[tbody.rows.length - 1];

    // For each row clone last row
    for (let i = rows; i < rows + count; i++) {

        // Create clone of row
        let clone = row_clone.cloneNode(true);

        // Set the row attribute
        clone.setAttribute("id", "row" + i.toString());

        // Populate rows with unique values
        let x_val = 0.1 * i;
        clone.getElementsByClassName("in_x")[0].value = x_val.toFixed(1);

        // Add clone to the fragment
        fragment.appendChild(clone);
    }

    // Add rows to the table
    tbody.appendChild(fragment);
}

function delete_rows(tbody, count) {

    // Delete all rows from back
    for (let i = 0, row = tbody.getElementsByTagName("tr").length - 1; i < count; i++ , row--) {
        tbody.deleteRow(row);
    }
}

function set_rows() {

    // Get the table
    let table = document.getElementById("fit_table");

    // Get the table body
    let tbody = table.getElementsByTagName("tbody")[0];

    // Get number of rows
    let rows = tbody.getElementsByTagName("tr").length;

    // Create new rows
    let in_count = Number(document.getElementById("in_count").value);
    if (in_count > rows) {

        // Number of rows to add
        let count = in_count - rows;

        // Add rows
        add_rows(tbody, rows, count);

        // Update the y values
        update_y_values(tbody, rows);
    }
    else if (in_count < rows) {

        // Number of rows to delete
        let count = rows - in_count;

        // Delete rows
        delete_rows(tbody, count);
    }
}

function calculate() {

    // Get the table
    let table = document.getElementById("fit_table");

    // Get the table body
    let tbody = table.getElementsByTagName("tbody")[0];

    // Get number of rows
    let rows = tbody.getElementsByTagName("tr").length;

    // Get inputs
    let depth = Number(document.getElementById("in_feature").value);
    let width = Number(document.getElementById("in_width").value);
    let step = Number(document.getElementById("in_step").value);
    let iter = Number(document.getElementById("in_iter").value);

    // Get the tabulated data
    let x_data = new Array(rows);
    let y_data = new Array(rows);
    let color_data = new Array(rows);
    for (let i = 0; i < rows; i++) {
        let row = tbody.rows[i];
        x_data[i] = Number(row.getElementsByClassName("in_x")[0].value);
        y_data[i] = Number(row.getElementsByClassName("in_y")[0].value);
        color_data[i] = "rgb(0,0,0)";
    }

    // Check X/Y data lengths
    if (x_data.length != y_data.length) {
        alert("X/Y data not same length");
    }

    // Extract data dimensions
    let y_size = y_data.length;

    // Create network topology
    let input = new Array(depth);
    let net = new mml.nnet(depth, 1);
    for (let i = 0; i < width; i++) {
        net.add_layer(depth);
    }

    // Finalize network
    net.finalize();
    net.set_linear_output(true);

    // Train model N iterations
    for (let i = 0; i < iter; i++) {

        // For each data point
        for (let j = 0; j < y_size; j++) {

            // Calculate input array
            input[0] = x_data[j];
            for (let k = 1; k < depth; k++) {
                input[k] = input[k - 1] * input[0];
            }

            // Calculate network value
            net.set_input(input);
            net.calculate_sigmoid();

            // Train input to be setpoint
            let sp = [y_data[j]];
            net.backprop_sigmoid(sp, step);
        }
    }

    // Test model prediction
    let inner = 4;
    let interp = 1 / inner;
    let p_size = inner * (y_size - 1);
    let x_predict = new Array(p_size);
    let y_predict = new Array(p_size);
    let color_predict = new Array(p_size);

    // Get model predictions
    for (let i = 1; i < y_size; i++) {

        // Interpolate between X values
        let dx = x_data[i] - x_data[i - 1];
        for (let j = 0; j < inner; j++) {

            // Calculate index
            let index = (i - 1) * inner + j;

            // Interpolate position
            let m = interp * j;
            input[0] = m * dx + x_data[i - 1];

            // Calculate input array
            for (let k = 1; k < depth; k++) {
                input[k] = input[k - 1] * input[0];
            }

            // Calculate network prediction
            net.set_input(input);
            x_predict[index] = input[0];
            y_predict[index] = net.calculate_sigmoid()[0];
            color_predict[index] = "rgb(255,0,0)";
        }
    }

    // Graph two curves
    let data = new plot_data(x_data, y_data, color_data);
    let predict = new plot_data(x_predict, y_predict, color_predict);

    // Draw the SVM fit
    update_graph([data, predict], "X Values", "Y Values", x_format, y_format);

    // Return no form action
    return false;
}
