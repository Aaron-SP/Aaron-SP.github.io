function x_format(x) {
    return x.toPrecision(3);
}

function y_format(y) {
    return y.toPrecision(3);
}

function h_air(T_inf, T_surf, vel_m_s, L_m) {

    // Calculate regression constants, temperatures in K
    let T_film = (T_inf + T_surf) * 0.5;
    let inv_T_film = 1.0 / T_film;
    let T_film2 = T_film * T_film;
    let T_film3 = T_film2 * T_film;

    // Calculate properties
    let k = (k_n2(inv_T_film, T_film, T_film2, T_film3) * 0.79) + (k_o2(inv_T_film, T_film, T_film2, T_film3) * 0.21);
    let Gr = (gr_n2(inv_T_film, T_film, T_film2, T_film3, T_inf, T_surf, L_m) * 0.79) + (gr_o2(inv_T_film, T_film, T_film2, T_film3, T_inf, T_surf, L_m) * 0.21);
    let Pr = (pr_n2(inv_T_film, T_film, T_film2, T_film3) * 0.79) + (pr_o2(inv_T_film, T_film, T_film2, T_film3) * 0.21);
    let Ra = Gr * Pr;
    let Re = (re_n2(inv_T_film, T_film, T_film2, T_film3, vel_m_s, L_m) * 0.79) + (re_o2(inv_T_film, T_film, T_film2, T_film3, vel_m_s, L_m) * 0.21);

    // Return air convection heat transfer
    return (nu_free_vertical_plate(Ra, Pr) + nu_forced_flat_plate(Re, Pr)) * (k / L_m);
}

function h_water(T_inf, T_surf, vel_m_s, L_m) {

    // Calculate regression constants, temperatures in K
    let T_film = (T_inf + T_surf) * 0.5;
    let inv_T_film = 1.0 / T_film;
    let T_film2 = T_film * T_film;
    let T_film3 = T_film2 * T_film;

    // Calculate Ra
    let k = k_water(inv_T_film, T_film, T_film2, T_film3);
    let Gr = gr_water(inv_T_film, T_film, T_film2, T_film3, T_inf, T_surf, L_m);
    let Pr = pr_water(inv_T_film, T_film, T_film2, T_film3);
    let Ra = Gr * Pr;
    let Re = re_water(inv_T_film, T_film, T_film2, T_film3, vel_m_s, L_m);

    // Return Nusselt number for air
    return (nu_free_vertical_plate(Ra, Pr) + nu_forced_flat_plate(Re, Pr)) * (k / L_m);
}

function solve_tank(A_m2, V_m3, L_m, thick_m, temp_air_K, temp_water_K, vel_m_s, step, iter) {

    // Temperature guess
    let K_glass = 0.8;

    // Solve steady state wall temperatures = zero
    // q = h_air * A_m2 * (T_air - T_1)
    //   = k_glass * A_m2 / thick_m * (T_1 - T_2)
    //   = h_wat * A_m2 * (T_2 - T_wat)
    let h = [0.0, 0.0];
    let t = 0.0;
    let Tw_K = temp_water_K;

    // Calculate data arrays
    let t_data = new Array(iter);
    let T_data = new Array(iter);

    // Calculate mass of water
    let inv_Tw_K = 1.0 / Tw_K;
    let Tw_K2 = Tw_K * Tw_K;
    let Tw_K3 = Tw_K2 * Tw_K;
    let water_mass_kg = rho_water(inv_Tw_K, Tw_K, Tw_K2, Tw_K3) * V_m3;
    let water_moles = water_mass_kg * (1000.0 / water_mw);

    // Solve the heat integral
    for (let i = 0; i < iter; i++) {

        let func = function (T1_K) {

            // Calculate air convection coefficient
            h[0] = h_air(temp_air_K, T1_K, vel_m_s, L_m);
            let q1 = h[0] * A_m2 * (temp_air_K - T1_K);

            // Calculate water wall temperature
            let T2_K = T1_K - ((q1 * thick_m) / (K_glass * A_m2));

            // Calculate water convection coefficient
            h[1] = h_water(Tw_K, T2_K, vel_m_s, L_m);

            // Calculate heat through water convection
            let q2 = h[1] * A_m2 * (T2_K - Tw_K);

            // Calculate function value
            return q1 - q2;
        };

        // Solve heat transfer
        let x0 = temp_air_K;
        let x1 = temp_air_K + 0.001;
        let f0 = func(x0);
        let T1_K = newton_solve(x0, x1, f0, func, 100);
        if (T1_K == undefined) {
            throw "Failed to solve heat flow through glass, increase iterations";
        }

        // Calculate thermal resistances of tank
        let R = (1.0 / (h[0] * A_m2)) + (thick_m / (K_glass * A_m2)) + (1.0 / (h[1] * A_m2));

        // Calculate heat flow through the glass
        let q = (temp_air_K - Tw_K) / R;

        // Calculate water regression constants
        let inv_Tw_K = 1.0 / Tw_K;
        let Tw_K2 = Tw_K * Tw_K;
        let Tw_K3 = Tw_K2 * Tw_K;

        // Calculate temperature change
        let dT_dt = q / (water_moles * cv_water(inv_Tw_K, Tw_K, Tw_K2, Tw_K3));

        // Calculate new temperature
        t += step;
        Tw_K += dT_dt * step;

        t_data[i] = t / 3600.0;
        T_data[i] = Tw_K - 273.15;
    }

    return [t_data, T_data];
}

function calculate() {

    // Get inputs
    let length_in = Number(document.getElementById("in_length_in").value);
    let width_in = Number(document.getElementById("in_width_in").value);
    let depth_in = Number(document.getElementById("in_depth_in").value);
    let thick_m = Number(document.getElementById("in_thickness_in").value) * 0.0254;
    let temp_air_K = Number(document.getElementById("in_temp_air_C").value) + 273.15;
    let temp_water_K = Number(document.getElementById("in_temp_water_C").value) + 273.15;
    let vel_m_s = Number(document.getElementById("in_velocity_m_s").value);
    let step = Number(document.getElementById("in_step").value);
    let iter = Number(document.getElementById("in_iter").value);

    // Calculate area and volume in m3, top and bottom well insulated
    let A_m2 = ((length_in * depth_in) + (width_in * depth_in)) * (2.0 * 0.00064516);
    let V_m3 = (length_in * width_in * depth_in) * (1.63871E-5);

    // Characteristic length is height of vertical plate
    let L_m = depth_in * 0.0254;

    let tank_data = solve_tank(A_m2, V_m3, L_m, thick_m, temp_air_K, temp_water_K, vel_m_s, step, iter);

    // Get the tabulated data
    let x_data = tank_data[0];
    let y_data = tank_data[1];
    let size = x_data.length;
    let color_data = new Array(size);
    for (let i = 0; i < size; i++) {
        color_data[i] = "rgb(0,0,0)";
    }

    // Graph two curves
    let data = new plot_data(x_data, y_data, color_data);

    // Draw the SVM fit
    update_graph([data], "t (hr)", "Temperature (degC)", x_format, y_format);

    // Return no form action
    return false;
}
