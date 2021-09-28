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
    let kernel = Number(document.getElementById("in_kernel").value);
    let coef = Number(document.getElementById("in_coef").value);
    let deg = Number(document.getElementById("in_deg").value);
    let gam = Number(document.getElementById("in_gam").value);
    let C = Number(document.getElementById("in_C").value);
    let p = Number(document.getElementById("in_p").value);

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

    // Create parameter
    let param = new libsvm.svm_parameter();
    param.svm_type = libsvm.svm_parameter.EPSILON_SVR;
    param.kernel_type = kernel; // kernel
    param.degree = deg; // degree
    param.gamma = gam; // gamma
    param.coef0 = coef; // coeff0 in kernel function
    param.nu = 0.5; // nu
    param.cache_size = 100; // cache size
    param.C = C; // cost
    param.eps = 1e-6; // tolerance
    param.p = p; // epsilon
    param.shrinking = 1;
    param.probability = 0;
    param.nr_weight = 0;
    param.weight_label = [];
    param.weight = [];

    // Create problem
    let prob = new libsvm.svm_problem();
    prob.l = y_size;

    // Fill in x vales
    prob.x = new Array(y_size);
    for (let i = 0; i < y_size; i++) {

        // Create input array
        let input = new Array(depth);

        // Calculate input array
        let accum = 1.0;
        for (let k = 0; k < depth; k++) {
            accum *= x_data[i];
            input[k] = new libsvm.svm_node();
            input[k].index = k;
            input[k].value = accum;
        }

        // Assign into array
        prob.x[i] = input;
    }

    // Fill in y values
    prob.y = new Array(y_size);
    for (let i = 0; i < y_size; i++) {
        prob.y[i] = y_data[i];
    }

    // Check for errors in svm problem and parameters
    let error = libsvm.svm.svm_check_parameter(prob, param);
    if (error) {
        alert("svm_check_paramater errors: " + error);
    }

    // Train a SVM model
    let model = libsvm.svm.svm_train(prob, param);

    // Test model prediction
    let inner = 4;
    let interp = 1 / inner;
    let p_size = inner * (y_size - 1);
    let x_predict = new Array(p_size);
    let y_predict = new Array(p_size);
    let color_predict = new Array(p_size);
    let input = new Array(depth);
    for (let i = 0; i < depth; i++) {
        input[i] = new libsvm.svm_node();
    }

    // Get model predictions
    for (let i = 1; i < y_size; i++) {

        // Interpolate between X values
        let dx = x_data[i] - x_data[i - 1];
        for (let j = 0; j < inner; j++) {

            // Calculate index
            let index = (i - 1) * inner + j;

            // Interpolate position
            let m = interp * j;
            let x = m * dx + x_data[i - 1];

            // Calculate input array
            let accum = 1.0;
            for (let k = 0; k < depth; k++) {
                accum *= x;
                input[k].index = k;
                input[k].value = accum;
            }

            // Calculate network prediction
            x_predict[index] = input[0].value;
            y_predict[index] = libsvm.svm.svm_predict(model, input);
            color_predict[index] = "rgb(255,0,0)";
        }
    }

    // Graph two curves
    let data = new plot_data(x_data, y_data, color_data);
    let predict = new plot_data(x_predict, y_predict, color_predict);

    // Draw the SVM fit
    update_graph([data, predict], "X Values", "Y Values", x_format, y_format);

    // Report number of support vectors
    document.getElementById("out_sv").innerHTML = "Number of support vectors in model solution: " + model.l;

    // Return no form action
    return false;
}
