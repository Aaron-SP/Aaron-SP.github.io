function calc_henry(in_gas, in_temp_K) {

    // Calculate henry's law constant for gas and temperature
    var inv_T = 1.0 / in_temp_K;
    var inv_298 = 1.0 / 298.15;
    var inv_dT = inv_T - inv_298;
    switch (in_gas) {
        case 0:
            return 0.0013 * Math.exp(1500.0 * inv_dT);
        case 1:
            return 0.00065 * Math.exp(1300.0 * inv_dT);
        case 2:
            return 0.035 * Math.exp(2400.0 * inv_dT);
        default:
            return -1.0;
    }
}

function calc_molar_mass(in_gas) {
    switch (in_gas) {
        case 0:
            return 31.9988;
        case 1:
            return 28.0134;
        case 2:
            return 44.01;
        default:
            return -1.0;
    }
}

function density_water(in_temp_K) {
    var in_temp_K2 = in_temp_K * in_temp_K;
    var in_temp_K3 = in_temp_K2 * in_temp_K;
    return (2.21626842369862E-05 * in_temp_K3) - (0.024769954365551 * in_temp_K2) + (8.60858628942933 * in_temp_K) + 44.9091206885057;
}

function calculate() {
    // Get inputs
    var in_gas = Number(document.querySelector('input[name="in_gas"]:checked').value);
    var in_molar = Number(document.getElementById("in_molar").value) / 100.0;
    var in_temp_degC = Number(document.getElementById("in_temperature").value);
    var in_temp_K = in_temp_degC + 273.15;

    // Calculate outputs
    var kh = calc_henry(in_gas, in_temp_K);
    var molar_mass = calc_molar_mass(in_gas);
    var conc_mol_kg = kh * in_molar * 1.01325;
    var gas_mol = conc_mol_kg;
    var gas_kg = gas_mol * molar_mass;
    var water_density = density_water(in_temp_K);
    var conc_mol_L = gas_mol / ((1.0 + gas_kg) * (1000.0 / water_density));

    // Set output values
    document.getElementById("out_kh").value = kh.toExponential(3);
    document.getElementById("out_water_density").value = water_density.toPrecision(5);
    document.getElementById("out_conc_mol_kg").value = conc_mol_kg.toExponential(3);
    document.getElementById("out_conc_mol_L").value = conc_mol_L.toExponential(3);

    // Return no form action
    return false;
}

function on_radio_select() {
    var in_gas = Number(document.querySelector('input[name="in_gas"]:checked').value);
    switch (in_gas) {
        case 0:
            document.getElementById("in_molar").value = 20.95;
            break;
        case 1:
            document.getElementById("in_molar").value = 78.09;
            break;
        case 2:
            document.getElementById("in_molar").value = 0.04;
            break;
    }
}
