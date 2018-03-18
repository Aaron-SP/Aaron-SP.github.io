function rho_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (-2.5450902371E-05 * in_temp_K3) + (3.4194880147E-02 * in_temp_K2) + (-1.8709594965E+01 * in_temp_K) + (-4.3122264716E+05 * in_inv_temp_K) + 5.6564879932E+03;
}

function U_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (-1.0222394272E-07 * in_temp_K3) + (1.5661774765E-04 * in_temp_K2) + (-1.1564609350E-02 * in_temp_K) + (-1.8466611218E+03 * in_inv_temp_K) + 3.1713505744E-01;
}

function H_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (-1.0017708670E-07 * in_temp_K3) + (1.5389160791E-04 * in_temp_K2) + (-1.0205246672E-02 * in_temp_K) + (-1.8218750440E+03 * in_inv_temp_K) + 1.8607659632E-02;
}

function S_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (-3.2305303380E-07 * in_temp_K3) + (3.7001789176E-04 * in_temp_K2) + (-3.6883379790E-02 * in_temp_K) + (-1.3785874313E+04 * in_inv_temp_K) + 3.9520149342E+01;
}

function Cv_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (-3.2146920677E-08 * in_temp_K3) + (6.6499466456E-04 * in_temp_K2) + (-7.8326370226E-01 * in_temp_K) + (-2.8816514277E+04 * in_inv_temp_K) + 3.4645981936E+02;
}

function Cp_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (1.3657860932E-05 * in_temp_K3) + (-1.8158164974E-02 * in_temp_K2) + (9.0948286512E+00 * in_temp_K) + (1.7045120461E+05 * in_inv_temp_K) - 1.9558362360E+03;
}

function mew_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (7.7034298871E-09 * in_temp_K3) + (-1.0537876064E-05 * in_temp_K2) + (5.4176759298E-03 * in_temp_K) + (1.0747292604E+02 * in_inv_temp_K) - 1.2422792740E+00;
}

function k_water(in_temp_K) {
    var in_inv_temp_K = 1.0 / in_temp_K;
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;

    return (1.9743358882E-07 * in_temp_K3) + (-2.6581525823E-04 * in_temp_K2) + (1.3164426134E-01 * in_temp_K) + (2.1414764226E+03 * in_inv_temp_K) - 2.7428565255E+01;
}

function calculate() {
    var in_temp_degC = Number(document.getElementById("in_temperature").value);
    var in_temp_K = in_temp_degC + 273.15;

    // Calculate outputs
    var water_rho = rho_water(in_temp_K);
    var water_U = U_water(in_temp_K);
    var water_H = H_water(in_temp_K);
    var water_S = S_water(in_temp_K);
    var water_Cv = Cv_water(in_temp_K);
    var water_Cp = Cp_water(in_temp_K);
    var water_mew = mew_water(in_temp_K);
    var water_k = k_water(in_temp_K);

    // Set output values
    document.getElementById("out_water_density").value = water_rho.toPrecision(6);
    document.getElementById("out_water_internal_energy").value = water_U.toPrecision(6);
    document.getElementById("out_water_enthalpy").value = water_H.toPrecision(6);
    document.getElementById("out_water_entropy").value = water_S.toPrecision(6);
    document.getElementById("out_water_cv").value = water_Cv.toPrecision(6);
    document.getElementById("out_water_cp").value = water_Cp.toPrecision(6);
    document.getElementById("out_water_viscosity").value = water_mew.toPrecision(6);
    document.getElementById("out_water_thermal_cond").value = water_k.toPrecision(6);

    // Return no form action
    return false;
}
