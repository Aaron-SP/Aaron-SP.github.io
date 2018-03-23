function antoine_water_bar(T) {
    var A, B, C;
    if (T > 344.0) {
        A = 5.08354;
        B = 1663.125;
        C = -45.622;
    }
    else if (T > 334.0) {
        A = 5.0768;
        B = 1659.793;
        C = -45.854;
    }
    else if (T > 304.0) {
        A = 5.20389;
        B = 1733.926;
        C = -39.485;
    }
    else {
        A = 5.40221;
        B = 1838.675;
        C = -31.737;
    }

    return Math.pow(10, A - (B / (T + C)));
}

function fugacity(Z, A, B) {
    var r2 = Math.sqrt(2.0);
    var ln_fug_coeff = (Z - 1.0) - Math.log(Z - B) - ((A / (2.0 * r2 * B)) * Math.log((Z + (1.0 + r2) * B) / (Z + (1.0 - r2) * B)));
    return Math.exp(ln_fug_coeff);
}

function peng_robinson(T, Tc, P, Pc, w) {

    var out = [1.0, 1.0, 1.0, 1.0];

    // Calculate inputs (units: m3 Pa K mol)
    var R = 8.3144598;
    var Tr = T / Tc;

    // Calculate peng robinson constants
    var kappa = 0.37464 + (1.54226 * w) - (0.26992 * w * w);
    var a_sqrt = 1.0 + (kappa * (1.0 - Math.sqrt(Tr)));
    var alpha = a_sqrt * a_sqrt;
    var a = (0.45724 * R * R * Tc * Tc * alpha) / Pc;
    var b = (0.07780 * R * Tc) / Pc;
    var A = a * P / (R * R * T * T);
    var B = b * P / (R * T);

    // Solve polynomial equation, Z^3 + (B-1)*Z^2 + (A-3B^2-2B)*Z + (B^3+B^2-AB) = 0
    // Z^3 + C2*Z^2 + C1*Z + C0 = 0;
    var C2 = B - 1.0;
    var C1 = A - (3.0 * B * B) - (2.0 * B);
    var C0 = (B * B * B) + (B * B) - (A * B);
    var Q1 = (C2 * C1 / 6.0) - (C0 / 2.0) - (C2 * C2 * C2 / 27.0);
    var P1 = (C2 * C2 / 9.0) - (C1 / 3.0);
    var D = (Q1 * Q1) - (P1 * P1 * P1);

    // Check for various solutions
    if (D >= 0) {
        alert("One solution, assuming vapor");
        out[0] = Math.cbrt(Q1 + Math.sqrt(D)) + Math.cbrt(Q1 - Math.sqrt(D)) - (C2 / 3.0);
    }
    else {
        var t1 = (Q1 * Q1) / (P1 * P1 * P1);
        var t2 = Math.sqrt(1.0 - t1) / (Math.sqrt(t1) * (Q1 / Math.abs(Q1)));
        var theta = Math.atan(t2);

        // Three solutions vapor, liquid, other need to sort
        var Z0 = 2.0 * Math.sqrt(P1) * Math.cos(theta / 3) - (C2 / 3.0);
        var Z1 = 2.0 * Math.sqrt(P1) * Math.cos((theta + 2.0 * Math.PI) / 3.0) - (C2 / 3.0);
        var Z2 = 2.0 * Math.sqrt(P1) * Math.cos((theta + 4.0 * Math.PI) / 3.0) - (C2 / 3.0);

        // Assign largest root to vapor and lowest to liquid
        out[0] = Math.max(Math.max(Z0, Z1), Z2);
        out[2] = Math.min(Math.min(Z0, Z1), Z2);
    }

    // Calculate pure fugacity coefficent for each phase
    out[1] = fugacity(out[0], A, B);
    out[3] = fugacity(out[2], A, B);

    // Return calculations
    return out;
}

function calculate() {

    // Get inputs
    var in_temp_K = Number(document.getElementById("in_temperature").value) + 273.15;
    var in_press_atm = Number(document.getElementById("in_pressure").value);
    var in_press_Pa = in_press_atm * 101325.0;

    // Calculate intermedaries
    var arr = peng_robinson(in_temp_K, 647.3, in_press_Pa, 221.2 * 100000.0, 0.344);
    var press_sat_atm = antoine_water_bar(in_temp_K) / 1.01325;

    // Calculate outputs
    var fug_vapor = arr[1] * in_press_atm;
    var fug_liquid = arr[3] * in_press_atm;
    var sat_mol_percent = (fug_liquid / fug_vapor) * 100.0;

    // Set output values
    document.getElementById("out_vapor_Z").value = arr[0].toFixed(4);
    document.getElementById("out_liquid_Z").value = arr[2].toFixed(4);
    document.getElementById("out_vapor_fugacity").value = fug_vapor.toFixed(4);
    document.getElementById("out_liquid_fugacity").value = fug_liquid.toFixed(4);
    document.getElementById("out_sat_conc_percent").value = sat_mol_percent.toFixed(4);

    // Return no form action
    return false;
}
