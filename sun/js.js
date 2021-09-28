// Sourced from http://www.fao.org/docrep/X0490E/x0490e07.htm
function calc_day(phi, J) {

    // Shortcut PI
    let PI = Math.PI;

    // Convert Julian day into angle
    let day_angle = 2.0 * PI * J / 365.0;

    // Inverse relative distance Earth-Sun
    let d_r = 1.0 + (0.033 * Math.cos(day_angle));

    // Solar decimation
    let delta = 0.409 * Math.sin(day_angle - 1.39);

    // Sunset hour angle
    let w_s = Math.acos(Math.tan(phi) * Math.tan(delta) * -1.0);

    // Calculate phase terms
    let p1 = w_s * Math.sin(phi) * Math.sin(delta);
    let p2 = Math.cos(phi) * Math.cos(delta) * Math.sin(w_s);

    // Solar constant (MJ/m2/d)
    let G_sc = 0.0820;

    // Calculate extraterrestrial radiation
    let R_a = (1440.0 / PI) * (G_sc * d_r) * (p1 + p2);

    // Return R_a
    return R_a;
}

function calc_hour(lat, lon, J, t) {

    // Shortcut PI
    let PI = Math.PI;

    // Convert lat to radians
    lat *= (PI / 180.0);

    // Convert Julian day into angle
    let day_angle = 2.0 * PI * J / 365.0;

    // Inverse relative distance Earth-Sun
    let d_r = 1.0 + (0.033 * Math.cos(day_angle));

    // Solar decimation
    let delta = 0.409 * Math.sin(day_angle - 1.39);

    // Sunset hour angle
    let ws = Math.acos(Math.tan(lat) * Math.tan(delta) * -1.0);

    // Solar time angle at midpoint of the period
    let lon_zone = Math.round(lon / 15.0) * 15.0;
    let b = (2 * PI) * (J - 81.0) / 364.0;
    let sc = 0.1645 * Math.sin(2.0 * b) - 0.1255 * Math.cos(b) - 0.025 * Math.sin(b);
    let w = (PI / 12.0) * ((t + ((lon_zone - lon) / 15.0) + sc) - 12.0);

    // Solar time angles at the beginning and end of the period in hours
    let w1 = w - (PI * 1.0 / 24.0);
    let w2 = w + (PI * 1.0 / 24.0);

    // Calculate phase terms
    let p1 = (w2 - w1) * Math.sin(lat) * Math.sin(delta);
    let p2 = Math.cos(lat) * Math.cos(delta) * (Math.sin(w2) - Math.sin(w1));

    // Solar constant (MJ/m2/d)
    let G_sc = 0.0820;

    // Calculate extraterrestrial radiation
    let R_a = (720.0 / PI) * (G_sc * d_r) * (p1 + p2);
    if (w < -ws || w > ws) {
        R_a = 0.0;
    }
    else if (R_a < 0.0) {
        R_a = 0.0;
    }

    // Return R_a in W/m2
    return R_a * (1000000.0 / 3600.0);
}

function solar_irr(lat, lon, day) {

    // Calculate data
    let x = [];
    let y = [];
    let color = [];

    for (let i = 0; i < 24; i++) {
        x.push(i);
        y.push(calc_hour(lat, lon, day, i));
        color.push("rgb(255,0,0)");
    }

    // return plot data
    return new plot_data(x, y, color);
}

function x_format(x) {
    return x.toFixed(1);
}

function y_format(y) {
    return y.toFixed(1);
}

function calculate() {

    // Get inputs
    let in_lat = Number(document.getElementById("in_lat").value);
    let in_lon = Number(document.getElementById("in_lon").value);
    let in_day = Number(document.getElementById("in_day").value);

    // Calculate solar profile
    let solar_data = solar_irr(in_lat, in_lon, in_day);

    // Update the graph
    update_graph([solar_data], "t (hour)", "Irradiance (W/m2)", x_format, y_format);

    // No form update
    return false;
}

calculate();
