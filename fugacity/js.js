function calculate() {

    // Get inputs
    var in_temp_K = Number(document.getElementById("in_temperature").value) + 273.15;
    var in_press_atm = Number(document.getElementById("in_pressure").value);
    var in_press_Pa = in_press_atm * 101325.0;

    // Calculate intermedaries
    var arr = peng_robinson_pure(in_temp_K, in_press_Pa, 647.3, 221.2 * 100000.0, 0.344);
    var press_sat_Pa = antoine_water_bar(in_temp_K) * 100000.0;

    // Calculate outputs
    var fug_vapor_Pa = arr[1] * in_press_Pa;
    var fug_liquid_Pa = arr[3] * in_press_Pa;
    var sat_mol_percent = Math.max(Math.min((fug_liquid_Pa / fug_vapor_Pa) * 100.0, 100.0), 0.0);
    var fug_sat_coeff = sat_fugacity_coeff(arr[2], fug_liquid_Pa, in_press_Pa, press_sat_Pa, in_temp_K);

    // Change units
    var fug_vapor_atm = fug_vapor_Pa / 101325;
    var fug_liquid_atm = fug_liquid_Pa / 101325;

    // Set output values
    document.getElementById("out_vapor_Z").value = arr[0].toFixed(4);
    document.getElementById("out_liquid_Z").value = arr[2].toFixed(4);
    document.getElementById("out_vapor_fugacity_atm").value = fug_vapor_atm.toFixed(4);
    document.getElementById("out_liquid_fugacity_atm").value = fug_liquid_atm.toFixed(4);
    document.getElementById("out_sat_conc_percent").value = sat_mol_percent.toFixed(4);
    document.getElementById("out_fug_sat_coeff").value = fug_sat_coeff.toFixed(4);

    // Return no form action
    return false;
}
