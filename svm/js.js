let x_data = [0, 5, 10, 15, 20, 25];
let y_data = [1.2931, 1.2697, 1.2472, 1.2255, 1.2046, 1.1843];

// Check X/Y data lengths
if (x_data.length != y_data.length) {
    alert("X/Y data not same length");
}

// Extract data dimensions
let y_size = y_data.length;
let x_width = 1;

// Create parameter
let param = new libsvm.svm_parameter();
param.svm_type = libsvm.svm_parameter.EPSILON_SVR;
param.kernel_type = libsvm.svm_parameter.RBF; // kernel
param.degree = 3; // degree
param.gamma = 1.0 / x_width; // gamma
param.coef0 = 0.0; // coeff0 in kernel function
param.nu = 0.5; // nu
param.cache_size = 200; // cache size
param.C = 10.0; // cost
param.eps = 1e-6; // tolerance
param.p = 0.001; // epsilon
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

    // Fill in x values
    let arr = new Array(x_width);
    arr[0] = new libsvm.svm_node();
    arr[0].index = i;
    arr[0].value = x_data[i];

    // Assign into array
    prob.x[i] = arr;
}

// Fill in y values
prob.y = new Array(y_size).fill(0.0);
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
for (let i = 0; i < y_size; i++) {
    let predict = libsvm.svm.svm_predict(model, prob.x[i]);
    alert(i + ": " + predict);
}

