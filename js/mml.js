/* Copyright [2013-2016] [Aaron Springstroh, Minimal Math Library]
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var mml = mml || {};

mml.mapper = class {
    constructor(min, max) {
        this._min = min;
        this._max = max;
        this._dx = max - min;
        this._inv_dx = 1.0 / this._dx;
    }

    map(val) {
        return (val - this._min) * this._inv_dx;
    }

    unmap(val) {
        return (val * this._dx) + this._min;
    }
}

mml.nnode = class {
    constructor(size) {
        this._weight_range = 1E6;
        this._weights = new Array(size).fill(1.0);
        this._delta_weights = new Array(size).fill(0.0);
        this._inputs = new Array(size).fill(0.0);
        this._bias = 0.0;
        this._sum = 0.0;
        this._output = 0.0;
        this._delta = 0.0;
    }
    construct(weights, bias) {
        this._weight_range = 1E6;
        let size = weights.length;
        this._weights = weights.slice();
        this._delta_weights = new Array(size).fill(0.0);
        this._inputs = new Array(size).fill(0.0);
        this._bias = bias;
        this._sum = 0.0;
        this._output = 0.0;
        this._delta = 0.0;
    }

    // private
    range(weight) {
        return Math.max(-this._weight_range, Math.min(weight, this._weight_range));
    }

    transfer_deriv_identity(output) {
        return 1.0;
    }

    transfer_identity(input) {
        return input;
    }

    transfer_deriv_relu(output) {
        let arg = -1.0 * output;
        if (arg > 20.0) {
            return 0.0;
        }
        else if (arg < -20.0) {
            return 1.0;
        }

        return 1.0 / (1.0 + Math.exp(arg));
    }

    transfer_relu(input) {
        return Math.log(1.0 + Math.exp(input));
    }

    transfer_deriv_sigmoid(output) {
        return output * (1.0 - output);
    }

    transfer_sigmoid(input) {
        let arg = -1.0 * input;
        if (arg > 20.0) {
            return 0.0;
        }
        else if (arg < -20.0) {
            return 1.0;
        }

        return 1.0 / (1.0 + Math.exp(arg));
    }

    transfer_deriv_tanh(output) {
        return 1.0 - (output * output);
    }

    transfer_tanh(input) {
        let arg = -2.0 * input;
        if (arg > 20.0) {
            return 0.0;
        }
        else if (arg < -20.0) {
            return 1.0;
        }

        return (2.0 / (1.0 + Math.exp(arg))) - 1.0;
    }

    backprop(step_size) {

        // Calculate the delta sum term
        let size = this._inputs.length;
        for (let i = 0; i < size; i++) {
            this._delta_weights[i] = (this._delta * this._weights[i]);
        }

        // Calculate step by step size
        let step = step_size * this._delta;

        // Update weights
        for (let i = 0; i < size; i++) {
            this._weights[i] -= (step * this._inputs[i]);
        }

        // Update bias
        this._bias -= step;
    }

    zero() {
        this._sum = this._bias;
        this._output = 0.0;
    }

    // public
    mult_eq(n) {
        let size = n._weights.length;
        for (let i = 0; i < size; i++) {

            // average weights and check for weight overflow
            this._weights[i] = this.range((this._weights[i] + n._weights[i]) * 0.5);
        }

        // average bias and check for bias overflow
        this._bias = this.range((this._bias + n._bias) * 0.5);

        return this;
    }

    backprop_identity(propagated, step_size) {
        // propagated = sum(dk * Wjk) or if last layer (Ok - tk)
        // dj = 1.0 * propagated
        this._delta = this.transfer_deriv_identity(this._output) * propagated;

        // Calculate steps for weights and biases
        this.backprop(step_size);
    }

    backprop_relu(propagated, step_size) {
        // propagated = sum(dk * Wjk) or if last layer (Ok - tk)
        // dj = 1.0/(1.0+exp(-x)) * propagated
        this._delta = this.transfer_deriv_relu(this._output) * propagated;

        // Calculate steps for weights and biases
        this.backprop(step_size);
    }

    backprop_sigmoid(propagated, step_size) {
        // propagated = sum(dk * Wjk) or if last layer (Ok - tk)
        // dj = (Oj) * (1.0 - Oj) * propagated
        this._delta = this.transfer_deriv_sigmoid(this._output) * propagated;

        // Calculate steps for weights and biases
        this.backprop(step_size);
    }

    backprop_tanh(propagated, step_size) {
        // propagated = sum(dk * Wjk) or if last layer (Ok - tk)
        // dj = (1.0 - (Oj * Oj)) * propagated
        this._delta = this.transfer_deriv_tanh(this._output) * propagated;

        // Calculate steps for weights and biases
        this.backprop(step_size);
    }

    calculate_identity() {
        // Calculate transfer
        this._output = this.transfer_identity(this._sum);
    }

    calculate_relu() {
        // Calculate transfer
        this._output = this.transfer_relu(this._sum);
    }

    calculate_sigmoid() {
        // Calculate transfer
        this._output = this.transfer_sigmoid(this._sum);
    }

    calculate_tanh() {
        // Calculate transfer
        this._output = this.transfer_tanh(this._sum);
    }

    delta(index) {
        return this._delta_weights[index];
    }

    get_bias() {
        return this._bias;
    }

    get_inputs() {
        return this._weights.length;
    }

    get_weights() {
        return this._weights;
    }

    // Skipping mutate no RNG
    // mutate(ran){}

    output() {
        return this._output;
    }

    reset() {
        // Reset the node
        this.zero();
    }

    sum(input, index) {
        // Store input for later
        this._inputs[index] = input;

        // Sum input
        this._sum += input * this._weights[index];
    }
}

mml.nnlayer = class {
    constructor(size, inputs) {
        this._nodes = new Array(size);
        for (let i = 0; i < size; i++) {
            this._nodes[i] = new mml.nnode(inputs);
        }
        this._inputs = inputs;
    }

    size() {
        return this._nodes.length;
    }

    inputs() {
        return this._inputs;
    }

    get(index) {
        return this._nodes[index];
    }
}

mml.nnet = class {
    constructor(IN, OUT) {
        this.IN = IN;
        this.OUT = OUT;
        this._input = new Array(IN);
        this._output = new Array(OUT);
        this._layers = [];
        this._final = false;
        this._linear_output = false;
    }

    // private
    backprop(back, set_point, step_size) {
        // We assume the network is in calculated state

        // If we are in a valid state
        if (this._layers.length >= 2) {

            // Do backprop for last layer first
            let last = this._layers.length - 1;

            // Check that last layer is the appropriate size
            let last_size = this._layers[last].size();
            if (last_size != this.OUT) {
                throw "nnet: backprop invalid output dimension";
            }

            // If we want a linear output node
            if (this._linear_output) {

                // For all nodes in last layer
                for (let i = 0; i < last_size; i++) {

                    let error = this._layers[last].get(i).output() - set_point[i];

                    // Do backprop for node in last layer
                    this._layers[last].get(i).backprop_identity(error, step_size);
                }
            }
            else {
                // For all nodes in last layer
                for (let i = 0; i < last_size; i++) {

                    let error = this._layers[last].get(i).output() - set_point[i];

                    // Do backprop for node in last layer
                    back(this._layers[last].get(i), error, step_size);
                }
            }

            // For all internal layers, iterating backwards
            let layers = this._layers.length;
            for (let i = 1; i < layers; i++) {
                let current = last - i;
                let nodes = this._layers[current].size();
                for (let j = 0; j < nodes; j++) {

                    // For all nodes in layer, calculate delta summation
                    let sum = 0.0;
                    let size_out = this._layers[current + 1].size();
                    for (let k = 0; k < size_out; k++) {
                        sum += this._layers[current + 1].get(k).delta(j);
                    }

                    // Do backprop for this node
                    back(this._layers[current].get(j), sum, step_size);
                }
            }
        }
        else {
            throw "nnet: can't backprop, not enough layers";
        }
    }

    calculate(calc) {

        if (this._final) {

            // If we added any layers
            if (this._layers.length >= 2) {
                let in_nodes = this._layers[0].size();
                for (let i = 0; i < in_nodes; i++) {

                    // Reset the layer node
                    this._layers[0].get(i).reset();

                    // Map input to first layer of net
                    for (let j = 0; j < this.IN; j++) {

                        // Calculate sum of inputs
                        this._layers[0].get(i).sum(this._input[j], j);
                    }
                }

                // Do N-1 propagations from first layer
                let layers = this._layers.length - 1;
                for (let i = 0; i < layers; i++) {

                    // For all nodes in out_layer
                    let size_out = this._layers[i + 1].size();
                    for (let j = 0; j < size_out; j++) {

                        // Reset the layer node
                        this._layers[i + 1].get(j).reset();

                        // For all nodes in in_layer
                        let size_in = this._layers[i].size();
                        for (let k = 0; k < size_in; k++) {

                            calc(this._layers[i].get(k));
                            this._layers[i + 1].get(j).sum(this._layers[i].get(k).output(), k);
                        }
                    }
                }

                // Map last layer to output of net
                // Last layer is special and added during finalize so we can just grab the output value
                // From the last internal layer for the output

                // If we want a linear output node
                if (this._linear_output) {

                    let last = this._layers[this._layers.length - 1];
                    for (let i = 0; i < this.OUT; i++) {

                        last.get(i).calculate_identity();
                        this._output[i] = last.get(i).output();
                    }
                }
                else {

                    let last = this._layers[this._layers.length - 1];
                    for (let i = 0; i < this.OUT; i++) {

                        calc(last.get(i));
                        this._output[i] = last.get(i).output();
                    }
                }
            }
            else {
                throw "nnet: can't calculate, not enough layers";
            }
        }
        else {
            throw "nnet: can't calculate, must finalize net";
        }

        return this._output;
    }

    on_net(f) {

        // For all net layers
        let layers = _layers.length;
        for (let i = 0; i < layers; i++) {

            // For all layer nodes
            let nodes = _layers[i].size();
            for (let j = 0; j < nodes; j++) {

                f(_layers[i].get(j), i, j);
            }
        }
    }

    // public
    add_layer(size) {

        if (!this._final) {

            // If first layer
            let inputs = this.IN;
            if (this._layers.length != 0) {

                // Size of last layer is number of inputs to next layer
                inputs = this._layers[this._layers.length - 1].size();
            }

            // Zero initialize layer to zero
            this._layers.push(new mml.nnlayer(size, inputs));
        }
        else {
            throw "nnet: can't add layers to a finalized neural net";
        }
    }

    // Skipping breed no RNG
    // breed(p1, p2){}

    backprop_identity(set_point, step_size = 0.1) {
        let f = function (node, propagated, step) {
            node.backprop_identity(propagated, step);
        };

        this.backprop(f, set_point, step_size);
    }

    backprop_relu(set_point, step_size = 0.1) {
        let f = function (node, propagated, step) {
            node.backprop_relu(propagated, step);
        };

        this.backprop(f, set_point, step_size);
    }

    backprop_sigmoid(set_point, step_size = 0.1) {
        let f = function (node, propagated, step) {
            node.backprop_sigmoid(propagated, step);
        };

        this.backprop(f, set_point, step_size);
    }

    backprop_tanh(set_point, step_size = 0.1) {
        let f = function (node, propagated, step) {
            node.backprop_tanh(propagated, step);
        };

        this.backprop(f, set_point, step_size);
    }

    calculate_identity() {
        let f = function (node) {
            node.calculate_identity();
        };

        return this.calculate(f);
    }

    calculate_relu() {
        let f = function (node) {
            node.calculate_relu();
        };

        return this.calculate(f);
    }

    calculate_sigmoid() {
        let f = function (node) {
            node.calculate_sigmoid();
        };

        return this.calculate(f);
    }

    calculate_tanh() {
        let f = function (node) {
            node.calculate_tanh();
        };

        return this.calculate(f);
    }

    compatible(p1, p2) {

        // Test if nets are compatible
        if (p1._layers.length != p2._layers.length) {
            throw "nnet: can't breed incompatible neural nets, layers differ";
        }

        // Check net compatibility
        let layers = p1._layers.length;
        for (let i = 0; i < layers; i++) {

            // For all nodes in layer
            let nodes = p1._layers[i].size();
            if (p2._layers[i].size() != nodes) {
                throw "nnet: can't breed incompatible neural nets, nodes differ";
            }
        }

        return true;
    }

    get_input() {
        return this._input;
    }

    get_weights(i, j) {
        return this._layers[i].get(j).get_weights();
    }

    debug_weights(i, j) {

        let out = "";
        let size = this._layers[i].get(j).get_inputs();
        let w = this._layers[i].get(j).get_weights();

        // Print out weights
        for (let k = 0; k < size; k++) {

            out += "Node " + i + ", " + j + "\n";
            out += "Weight " + k + ": " + w[k] + "\n";
        }

        // Print out bias
        out += "Bias " + this._layers[i].get(j).get_bias();

        // Return the string
        return out;
    }

    debug_connections() {

        let out = "";

        // Print out entire neural net
        let layers = this._layers.length;
        for (let i = 0; i < layers; i++) {

            let nodes = this._layers[i].size();
            for (let j = 0; j < nodes; j++) {

                out += this.debug_weights(i, j);
            }
        }

        // Return the string
        return out;
    }

    get_output(i, j) {
        return this._layers[i].get(j).output();
    }

    finalize() {

        if (!this._final) {

            // Create output network layer with input count from last layer
            this.add_layer(this.OUT);
            this._final = true;
        }
    }

    set_linear_output(mode) {
        this._linear_output = mode;
    }

    // Skipping mutate no RNG
    // mutate(ran){}

    // Skipping randomize no RNG
    // randomize(ran){}

    reset() {
        // Clear layers
        this._layers.length = 0;

        // Unfinalize the net
        this._final = false;
    }

    set_input(input) {
        this._input = input;
    }
}
