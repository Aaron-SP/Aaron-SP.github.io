function draw_graph(x_values, y_values, color, x_label, y_label) {

    // Get the canvas graph
    var canvas = document.getElementById('graph');

    // Check if context exists
    if (canvas.getContext) {

        // Get the 2D context
        var context = canvas.getContext('2d');

        //INPUTS
        if (x_values === null) {
            x_values = [0];
        }
        if (y_values === null) {
            y_values = [0];
        }

        // Global Constants
        var x_start = 75;
        var y_start = 75;
        var border_width = 10;
        var x_border_width = 15;
        var y_border_width = 10;
        var x_offset = 15;
        var y_offset = 0;
        var x_minor_count = 10;
        var y_minor_count = 10;
        var y_str_offset = 27;
        var x_str_offset = 50;

        // Canvas and graph sizes
        var width = canvas.width;
        var height = canvas.height;
        var inner_width = canvas.width - border_width;
        var inner_height = canvas.height - border_width;
        var graph_width = inner_width - 2 * x_start;
        var graph_height = inner_height - 2 * y_start;

        // Draw canvas background
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'white';
        context.fillRect(border_width / 2, border_width / 2, inner_width, inner_height);

        // Draw minor axes and value strings
        {
            // Calculate axis label positions
            var x_axis_y = y_start + graph_width + x_border_width;
            var y_axis_x = x_start - y_border_width;

            // Get the min/max x values
            var x_min = Math.min.apply(null, x_values);
            var x_max = Math.max.apply(null, x_values);

            // Get min/max y values
            var y_min = Math.min.apply(null, y_values);
            var y_max = Math.max.apply(null, y_values);

            // Position tick marks
            var dx = Math.floor(graph_width / x_minor_count);
            var dy = Math.floor(graph_height / y_minor_count);

            // Value tick marks
            var dx_val = (x_max - x_min) / x_minor_count;
            var dy_val = (y_max - y_min) / y_minor_count;

            // Write x values
            for (var i = 0, x = 0, x_val = x_min; i <= x_minor_count; i++ , x += dx, x_val += dx_val) {

                // Create x axis value string
                var x_str = x_val.toFixed(3).toString();

                // Calculate x minor position
                var x_pos = x_start + x

                // Draw x minor axis
                context.fillStyle = "grey";
                context.fillRect(x_pos, y_start, 1, graph_height);

                // Draw x minor axis value string
                context.fillStyle = "black";
                context.textAlign = "right";
                context.fillText(x_str, x_pos + x_offset, x_axis_y);
            }


            // Write y axis values
            for (var i = 0, y = 0, y_val = y_max; i <= y_minor_count; i++ , y += dy, y_val -= dy_val) {

                // Create y axis value string
                var y_str = y_val.toFixed(3).toString();

                // Calculate y minor position
                var y_pos = y_start + y

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
        {
            // Calculate graph position value translation
            var xslope = graph_width / (x_max - x_min);
            var yslope = graph_height / (y_max - y_min);

            // Draw lines
            context.lineWidth = 3;
            for (var i = 0; i < x_values.length - 1; i++) {

                // Calculate line start and stop
                var x0_point = xslope * (x_values[i] - x_min) + x_start;
                var x1_point = xslope * (x_values[i + 1] - x_min) + x_start;
                var y0_point = graph_height - yslope * (y_values[i] - y_min) + y_start;
                var y1_point = graph_height - yslope * (y_values[i + 1] - y_min) + y_start;

                // Create a line gradient
                var grad = context.createLinearGradient(x0_point, y0_point, x1_point, y1_point);
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
            context.font = '16px "Arial", sans-serif';

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
    var canvas = document.getElementById('graph');

    // Check if context exists
    if (canvas.getContext) {

        // Get the 2D context
        var context = canvas.getContext('2d');

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

// Data from https://www.ncdc.noaa.gov/cag/global/time-series/globe/land_ocean/1/1/1880-2018.csv
var x_data = [1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
var y_data = [0, -0.02, 0.08, -0.27, -0.19, -0.43, -0.12, -0.4, -0.39, -0.1, -0.37, -0.38, -0.23, -0.67, -0.43, -0.43, -0.1, -0.18, -0.04, -0.1, -0.23, -0.12, -0.09, -0.21, -0.54, -0.35, -0.17, -0.35, -0.36, -0.56, -0.31, -0.51, -0.27, -0.35, 0.1, -0.13, -0.17, -0.43, -0.21, -0.22, -0.11, -0.06, -0.32, -0.21, -0.25, -0.31, 0.18, -0.16, -0.06, -0.47, -0.32, -0.05, 0.16, -0.3, -0.31, -0.29, -0.25, -0.17, -0.04, -0.16, -0.12, 0.18, 0.29, -0.02, 0.42, 0.15, 0.22, -0.19, 0.04, 0.11, -0.28, -0.29, 0.15, 0.1, -0.24, 0.09, -0.18, -0.12, 0.29, 0.12, 0, 0.12, 0.13, 0.04, 0.05, -0.07, -0.05, -0.11, -0.19, -0.13, 0.12, -0.01, -0.24, 0.26, -0.2, 0.12, -0.02, 0.06, 0.16, 0.16, 0.31, 0.46, 0.13, 0.51, 0.28, 0.18, 0.32, 0.31, 0.54, 0.21, 0.36, 0.45, 0.47, 0.38, 0.29, 0.55, 0.26, 0.37, 0.6, 0.5, 0.34, 0.47, 0.7, 0.69, 0.6, 0.62, 0.47, 0.88, 0.27, 0.6, 0.7, 0.47, 0.42, 0.59, 0.7, 0.82, 1.06, 0.92, 0.71];
var color = ["rgb(98,0,157)", "rgb(95,0,160)", "rgb(110,0,145)", "rgb(58,0,197)", "rgb(70,0,185)", "rgb(35,0,220)", "rgb(81,0,174)", "rgb(39,0,216)", "rgb(41,0,214)", "rgb(84,0,171)", "rgb(44,0,211)", "rgb(42,0,213)", "rgb(64,0,191)", "rgb(0,0,255)", "rgb(35,0,220)", "rgb(35,0,220)", "rgb(84,0,171)", "rgb(72,0,183)", "rgb(92,0,163)", "rgb(84,0,171)", "rgb(64,0,191)", "rgb(81,0,174)", "rgb(85,0,170)", "rgb(67,0,188)", "rgb(19,0,236)", "rgb(47,0,208)", "rgb(73,0,182)", "rgb(47,0,208)", "rgb(45,0,210)", "rgb(16,0,239)", "rgb(53,0,202)", "rgb(23,0,232)", "rgb(58,0,197)", "rgb(47,0,208)", "rgb(113,0,142)", "rgb(79,0,176)", "rgb(73,0,182)", "rgb(35,0,220)", "rgb(67,0,188)", "rgb(66,0,189)", "rgb(82,0,173)", "rgb(89,0,166)", "rgb(51,0,204)", "rgb(67,0,188)", "rgb(61,0,194)", "rgb(53,0,202)", "rgb(125,0,130)", "rgb(75,0,180)", "rgb(89,0,166)", "rgb(29,0,226)", "rgb(51,0,204)", "rgb(91,0,164)", "rgb(122,0,133)", "rgb(54,0,201)", "rgb(53,0,202)", "rgb(56,0,199)", "rgb(61,0,194)", "rgb(73,0,182)", "rgb(92,0,163)", "rgb(75,0,180)", "rgb(81,0,174)", "rgb(125,0,130)", "rgb(141,0,114)", "rgb(95,0,160)", "rgb(160,0,95)", "rgb(120,0,135)", "rgb(131,0,124)", "rgb(70,0,185)", "rgb(104,0,151)", "rgb(114,0,141)", "rgb(57,0,198)", "rgb(56,0,199)", "rgb(120,0,135)", "rgb(113,0,142)", "rgb(63,0,192)", "rgb(112,0,143)", "rgb(72,0,183)", "rgb(81,0,174)", "rgb(141,0,114)", "rgb(116,0,139)", "rgb(98,0,157)", "rgb(116,0,139)", "rgb(117,0,138)", "rgb(104,0,151)", "rgb(106,0,149)", "rgb(88,0,167)", "rgb(91,0,164)", "rgb(82,0,173)", "rgb(70,0,185)", "rgb(79,0,176)", "rgb(116,0,139)", "rgb(97,0,158)", "rgb(63,0,192)", "rgb(137,0,118)", "rgb(69,0,186)", "rgb(116,0,139)", "rgb(95,0,160)", "rgb(107,0,148)", "rgb(122,0,133)", "rgb(122,0,133)", "rgb(144,0,111)", "rgb(166,0,89)", "rgb(117,0,138)", "rgb(173,0,82)", "rgb(140,0,115)", "rgb(125,0,130)", "rgb(145,0,110)", "rgb(144,0,111)", "rgb(178,0,77)", "rgb(129,0,126)", "rgb(151,0,104)", "rgb(165,0,90)", "rgb(168,0,87)", "rgb(154,0,101)", "rgb(141,0,114)", "rgb(179,0,76)", "rgb(137,0,118)", "rgb(153,0,102)", "rgb(187,0,68)", "rgb(172,0,83)", "rgb(148,0,107)", "rgb(168,0,87)", "rgb(201,0,54)", "rgb(200,0,55)", "rgb(187,0,68)", "rgb(190,0,65)", "rgb(168,0,87)", "rgb(228,0,27)", "rgb(138,0,117)", "rgb(187,0,68)", "rgb(201,0,54)", "rgb(168,0,87)", "rgb(160,0,95)", "rgb(185,0,70)", "rgb(201,0,54)", "rgb(219,0,36)", "rgb(255,0,0)", "rgb(234,0,21)", "rgb(203,0,52)"];

// Draw default graph
update_graph(x_data, y_data, color, "Year", "Anomaly (\xB0C)");
