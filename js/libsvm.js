/* Generated from Java with JSweet 2.0.0 - http://www.jsweet.org */

/* Javascript transpiled from source http://www.csie.ntu.edu.tw/~cjlin/libsvm */
// Copyright(c) 2000 - 2014 Chih - Chung Chang and Chih - Jen Lin
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:

// 1. Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and / or other materials provided with the distribution.

// 3. Neither name of copyright holders nor the names of its contributors
// may be used to endorse or promote products derived from this software
// without specific prior written permission.


// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
//     ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED.IN NO EVENT SHALL THE REGENTS OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
//     EXEMPLARY, OR CONSEQUENTIAL DAMAGES(INCLUDING, BUT NOT LIMITED TO,
//         PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

let __extends = (this && this.__extends) || function (d, b) {
    for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
let libsvm;
(function (libsvm) {
    let Random = (function () {
        function Random() {
        }
        Random.prototype.nextInt = function (i) {
            let rand = Math.random();
            let i_dbl = i;
            return (Math.round(rand * i_dbl) | 0);
        };
        return Random;
    }());
    libsvm.Random = Random;
    Random["__class"] = "libsvm.Random";
    let svm_model = (function () {
        function svm_model() {
            this.param = null;
            this.nr_class = 0;
            this.l = 0;
            this.SV = null;
            this.sv_coef = null;
            this.rho = null;
            this.probA = null;
            this.probB = null;
            this.sv_indices = null;
            this.label = null;
            this.nSV = null;
        }
        return svm_model;
    }());
    libsvm.svm_model = svm_model;
    svm_model["__class"] = "libsvm.svm_model";
    let svm_node = (function () {
        function svm_node() {
            this.index = 0;
            this.value = 0;
        }
        return svm_node;
    }());
    libsvm.svm_node = svm_node;
    svm_node["__class"] = "libsvm.svm_node";
    let svm_parameter = (function () {
        function svm_parameter() {
            this.svm_type = 0;
            this.kernel_type = 0;
            this.degree = 0;
            this.gamma = 0;
            this.coef0 = 0;
            this.cache_size = 0;
            this.eps = 0;
            this.C = 0;
            this.nr_weight = 0;
            this.weight_label = null;
            this.weight = null;
            this.nu = 0;
            this.p = 0;
            this.shrinking = 0;
            this.probability = 0;
        }
        svm_parameter.prototype.clone = function () {
            try {
                return (function (o) {
                    let clone = Object.create(o); for (let p in o) {
                        if (o.hasOwnProperty(p))
                            clone[p] = o[p];
                    } return clone;
                })(this);
            }
            catch (e) {
                return null;
            }
            ;
        };
        return svm_parameter;
    }());
    svm_parameter.C_SVC = 0;
    svm_parameter.NU_SVC = 1;
    svm_parameter.ONE_CLASS = 2;
    svm_parameter.EPSILON_SVR = 3;
    svm_parameter.NU_SVR = 4;
    svm_parameter.LINEAR = 0;
    svm_parameter.POLY = 1;
    svm_parameter.RBF = 2;
    svm_parameter.SIGMOID = 3;
    svm_parameter.PRECOMPUTED = 4;
    libsvm.svm_parameter = svm_parameter;
    svm_parameter["__class"] = "libsvm.svm_parameter";
    svm_parameter["__interfaces"] = ["java.lang.Cloneable"];
    let svm_problem = (function () {
        function svm_problem() {
            this.l = 0;
            this.y = null;
            this.x = null;
        }
        return svm_problem;
    }());
    libsvm.svm_problem = svm_problem;
    svm_problem["__class"] = "libsvm.svm_problem";
    let Cache = (function () {
        function Cache(l_, size_) {
            this.l = 0;
            this.size = 0;
            this.head = null;
            this.lru_head = null;
            this.l = l_;
            this.size = size_;
            this.head = new Array(this.l);
            for (let i = 0; i < this.l; i++)
                this.head[i] = new Cache.head_t(this);
            this.size /= 4;
            this.size -= this.l * ((16 / 4 | 0));
            this.size = Math.max(this.size, 2 * Math.floor(this.l));
            this.lru_head = new Cache.head_t(this);
            this.lru_head.next = this.lru_head.prev = this.lru_head;
        }
        Cache.prototype.lru_delete = function (h) {
            h.prev.next = h.next;
            h.next.prev = h.prev;
        };
        Cache.prototype.lru_insert = function (h) {
            h.next = this.lru_head;
            h.prev = this.lru_head.prev;
            h.prev.next = h;
            h.next.prev = h;
        };
        Cache.prototype.get_data = function (index, data, len) {
            let h = this.head[index];
            if (h.len > 0)
                this.lru_delete(h);
            let more = len - h.len;
            if (more > 0) {
                while ((this.size < more)) {
                    let old = this.lru_head.next;
                    this.lru_delete(old);
                    this.size += old.len;
                    old.data = null;
                    old.len = 0;
                }
                ;
                let new_data = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(len);
                if (h.data != null)
                    libsvm.svm.arraycopy(h.data, 0, new_data, 0, h.len);
                h.data = new_data;
                this.size -= more;
                do {
                    let tmp = h.len;
                    h.len = len;
                    len = tmp;
                } while ((false));
            }
            this.lru_insert(h);
            data[0] = h.data;
            return len;
        };
        Cache.prototype.swap_index = function (i, j) {
            if (i === j)
                return;
            if (this.head[i].len > 0)
                this.lru_delete(this.head[i]);
            if (this.head[j].len > 0)
                this.lru_delete(this.head[j]);
            do {
                let tmp = this.head[i].data;
                this.head[i].data = this.head[j].data;
                this.head[j].data = tmp;
            } while ((false));
            do {
                let tmp = this.head[i].len;
                this.head[i].len = this.head[j].len;
                this.head[j].len = tmp;
            } while ((false));
            if (this.head[i].len > 0)
                this.lru_insert(this.head[i]);
            if (this.head[j].len > 0)
                this.lru_insert(this.head[j]);
            if (i > j)
                do {
                    let tmp = i;
                    i = j;
                    j = tmp;
                } while ((false));
            for (let h = this.lru_head.next; h !== this.lru_head; h = h.next) {
                if (h.len > i) {
                    if (h.len > j)
                        do {
                            let tmp = h.data[i];
                            h.data[i] = h.data[j];
                            h.data[j] = tmp;
                        } while ((false));
                    else {
                        this.lru_delete(h);
                        this.size += h.len;
                        h.data = null;
                        h.len = 0;
                    }
                }
            }
            ;
        };
        return Cache;
    }());
    libsvm.Cache = Cache;
    Cache["__class"] = "libsvm.Cache";
    (function (Cache) {
        let head_t = (function () {
            function head_t(__parent) {
                this.__parent = __parent;
                this.prev = null;
                this.next = null;
                this.data = null;
                this.len = 0;
            }
            return head_t;
        }());
        Cache.head_t = head_t;
        head_t["__class"] = "libsvm.Cache.head_t";
    })(Cache = libsvm.Cache || (libsvm.Cache = {}));
    let QMatrix = (function () {
        function QMatrix() {
        }
        return QMatrix;
    }());
    libsvm.QMatrix = QMatrix;
    QMatrix["__class"] = "libsvm.QMatrix";
    let Solver = (function () {
        function Solver() {
            this.active_size = 0;
            this.y = null;
            this.G = null;
            this.alpha_status = null;
            this.alpha = null;
            this.Q = null;
            this.QD = null;
            this.eps = 0;
            this.Cp = 0;
            this.Cn = 0;
            this.p = null;
            this.active_set = null;
            this.G_bar = null;
            this.l = 0;
            this.unshrink = false;
        }
        Solver.INF_$LI$ = function () {
            if (Solver.INF == null)
                Solver.INF = Number.POSITIVE_INFINITY; return Solver.INF;
        };
        ;
        Solver.prototype.get_C = function (i) {
            return (this.y[i] > 0) ? this.Cp : this.Cn;
        };
        Solver.prototype.update_alpha_status = function (i) {
            if (this.alpha[i] >= this.get_C(i))
                this.alpha_status[i] = Solver.UPPER_BOUND;
            else if (this.alpha[i] <= 0)
                this.alpha_status[i] = Solver.LOWER_BOUND;
            else
                this.alpha_status[i] = Solver.FREE;
        };
        Solver.prototype.is_upper_bound = function (i) {
            return this.alpha_status[i] === Solver.UPPER_BOUND;
        };
        Solver.prototype.is_lower_bound = function (i) {
            return this.alpha_status[i] === Solver.LOWER_BOUND;
        };
        Solver.prototype.is_free = function (i) {
            return this.alpha_status[i] === Solver.FREE;
        };
        Solver.prototype.swap_index = function (i, j) {
            this.Q.swap_index(i, j);
            do {
                let tmp = this.y[i];
                this.y[i] = this.y[j];
                this.y[j] = tmp;
            } while ((false));
            do {
                let tmp = this.G[i];
                this.G[i] = this.G[j];
                this.G[j] = tmp;
            } while ((false));
            do {
                let tmp = this.alpha_status[i];
                this.alpha_status[i] = this.alpha_status[j];
                this.alpha_status[j] = tmp;
            } while ((false));
            do {
                let tmp = this.alpha[i];
                this.alpha[i] = this.alpha[j];
                this.alpha[j] = tmp;
            } while ((false));
            do {
                let tmp = this.p[i];
                this.p[i] = this.p[j];
                this.p[j] = tmp;
            } while ((false));
            do {
                let tmp = this.active_set[i];
                this.active_set[i] = this.active_set[j];
                this.active_set[j] = tmp;
            } while ((false));
            do {
                let tmp = this.G_bar[i];
                this.G_bar[i] = this.G_bar[j];
                this.G_bar[j] = tmp;
            } while ((false));
        };
        Solver.prototype.reconstruct_gradient = function () {
            if (this.active_size === this.l)
                return;
            let i;
            let j;
            let nr_free = 0;
            for (j = this.active_size; j < this.l; j++)
                this.G[j] = this.G_bar[j] + this.p[j];
            for (j = 0; j < this.active_size; j++)
                if (this.is_free(j))
                    nr_free++;
            ;
            if (2 * nr_free < this.active_size)
                libsvm.svm.info("\nWARNING: using -h 0 may be faster\n");
            if (nr_free * this.l > 2 * this.active_size * (this.l - this.active_size)) {
                for (i = this.active_size; i < this.l; i++) {
                    let Q_i = this.Q.get_Q(i, this.active_size);
                    for (j = 0; j < this.active_size; j++)
                        if (this.is_free(j))
                            this.G[i] += this.alpha[j] * Q_i[j];
                    ;
                }
                ;
            }
            else {
                for (i = 0; i < this.active_size; i++)
                    if (this.is_free(i)) {
                        let Q_i = this.Q.get_Q(i, this.l);
                        let alpha_i = this.alpha[i];
                        for (j = this.active_size; j < this.l; j++)
                            this.G[j] += alpha_i * Q_i[j];
                    }
                ;
            }
        };
        Solver.prototype.Solve = function (l, Q, p_, y_, alpha_, Cp, Cn, eps, si, shrinking) {
            this.l = l;
            this.Q = Q;
            this.QD = Q.get_QD();
            this.p = p_.slice(0);
            this.y = y_.slice(0);
            this.alpha = alpha_.slice(0);
            this.Cp = Cp;
            this.Cn = Cn;
            this.eps = eps;
            this.unshrink = false;
            {
                this.alpha_status = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                for (let i = 0; i < l; i++)
                    this.update_alpha_status(i);
            }
            ;
            {
                this.active_set = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                for (let i = 0; i < l; i++)
                    this.active_set[i] = i;
                this.active_size = l;
            }
            ;
            {
                this.G = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                this.G_bar = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                let i;
                for (i = 0; i < l; i++) {
                    this.G[i] = this.p[i];
                    this.G_bar[i] = 0;
                }
                ;
                for (i = 0; i < l; i++)
                    if (!this.is_lower_bound(i)) {
                        let Q_i = Q.get_Q(i, l);
                        let alpha_i = this.alpha[i];
                        let j = void 0;
                        for (j = 0; j < l; j++)
                            this.G[j] += alpha_i * Q_i[j];
                        if (this.is_upper_bound(i))
                            for (j = 0; j < l; j++)
                                this.G_bar[j] += this.get_C(i) * Q_i[j];
                    }
                ;
            }
            ;
            let iter = 0;
            let max_iter = Math.max(10000000, l > (Number.MAX_VALUE / 100 | 0) ? Number.MAX_VALUE : 100 * l);
            let counter = Math.min(l, 1000) + 1;
            let working_set = [0, 0];
            while ((iter < max_iter)) {
                if (--counter === 0) {
                    counter = Math.min(l, 1000);
                    if (shrinking !== 0)
                        this.do_shrinking();
                    libsvm.svm.info(".");
                }
                if (this.select_working_set(working_set) !== 0) {
                    this.reconstruct_gradient();
                    this.active_size = l;
                    libsvm.svm.info("*");
                    if (this.select_working_set(working_set) !== 0)
                        break;
                    else
                        counter = 1;
                }
                let i = working_set[0];
                let j = working_set[1];
                ++iter;
                let Q_i = Q.get_Q(i, this.active_size);
                let Q_j = Q.get_Q(j, this.active_size);
                let C_i = this.get_C(i);
                let C_j = this.get_C(j);
                let old_alpha_i = this.alpha[i];
                let old_alpha_j = this.alpha[j];
                if (this.y[i] !== this.y[j]) {
                    let quad_coef = this.QD[i] + this.QD[j] + 2 * Q_i[j];
                    if (quad_coef <= 0)
                        quad_coef = 1.0E-12;
                    let delta = (-this.G[i] - this.G[j]) / quad_coef;
                    let diff = this.alpha[i] - this.alpha[j];
                    this.alpha[i] += delta;
                    this.alpha[j] += delta;
                    if (diff > 0) {
                        if (this.alpha[j] < 0) {
                            this.alpha[j] = 0;
                            this.alpha[i] = diff;
                        }
                    }
                    else {
                        if (this.alpha[i] < 0) {
                            this.alpha[i] = 0;
                            this.alpha[j] = -diff;
                        }
                    }
                    if (diff > C_i - C_j) {
                        if (this.alpha[i] > C_i) {
                            this.alpha[i] = C_i;
                            this.alpha[j] = C_i - diff;
                        }
                    }
                    else {
                        if (this.alpha[j] > C_j) {
                            this.alpha[j] = C_j;
                            this.alpha[i] = C_j + diff;
                        }
                    }
                }
                else {
                    let quad_coef = this.QD[i] + this.QD[j] - 2 * Q_i[j];
                    if (quad_coef <= 0)
                        quad_coef = 1.0E-12;
                    let delta = (this.G[i] - this.G[j]) / quad_coef;
                    let sum = this.alpha[i] + this.alpha[j];
                    this.alpha[i] -= delta;
                    this.alpha[j] += delta;
                    if (sum > C_i) {
                        if (this.alpha[i] > C_i) {
                            this.alpha[i] = C_i;
                            this.alpha[j] = sum - C_i;
                        }
                    }
                    else {
                        if (this.alpha[j] < 0) {
                            this.alpha[j] = 0;
                            this.alpha[i] = sum;
                        }
                    }
                    if (sum > C_j) {
                        if (this.alpha[j] > C_j) {
                            this.alpha[j] = C_j;
                            this.alpha[i] = sum - C_j;
                        }
                    }
                    else {
                        if (this.alpha[i] < 0) {
                            this.alpha[i] = 0;
                            this.alpha[j] = sum;
                        }
                    }
                }
                let delta_alpha_i = this.alpha[i] - old_alpha_i;
                let delta_alpha_j = this.alpha[j] - old_alpha_j;
                for (let k = 0; k < this.active_size; k++) {
                    this.G[k] += Q_i[k] * delta_alpha_i + Q_j[k] * delta_alpha_j;
                }
                ;
                {
                    let ui = this.is_upper_bound(i);
                    let uj = this.is_upper_bound(j);
                    this.update_alpha_status(i);
                    this.update_alpha_status(j);
                    let k = void 0;
                    if (ui !== this.is_upper_bound(i)) {
                        Q_i = Q.get_Q(i, l);
                        if (ui)
                            for (k = 0; k < l; k++)
                                this.G_bar[k] -= C_i * Q_i[k];
                        else
                            for (k = 0; k < l; k++)
                                this.G_bar[k] += C_i * Q_i[k];
                    }
                    if (uj !== this.is_upper_bound(j)) {
                        Q_j = Q.get_Q(j, l);
                        if (uj)
                            for (k = 0; k < l; k++)
                                this.G_bar[k] -= C_j * Q_j[k];
                        else
                            for (k = 0; k < l; k++)
                                this.G_bar[k] += C_j * Q_j[k];
                    }
                }
                ;
            }
            ;
            if (iter >= max_iter) {
                if (this.active_size < l) {
                    this.reconstruct_gradient();
                    this.active_size = l;
                    libsvm.svm.info("*");
                }
                libsvm.svm.error("\nWARNING: reaching max number of iterations\n");
            }
            si.rho = this.calculate_rho();
            {
                let v = 0;
                let i;
                for (i = 0; i < l; i++)
                    v += this.alpha[i] * (this.G[i] + this.p[i]);
                si.obj = v / 2;
            }
            ;
            {
                for (let i = 0; i < l; i++)
                    alpha_[this.active_set[i]] = this.alpha[i];
            }
            ;
            si.upper_bound_p = Cp;
            si.upper_bound_n = Cn;
            libsvm.svm.info("\noptimization finished, #iter = " + iter + "\n");
        };
        Solver.prototype.select_working_set = function (working_set) {
            let Gmax = -Solver.INF_$LI$();
            let Gmax2 = -Solver.INF_$LI$();
            let Gmax_idx = -1;
            let Gmin_idx = -1;
            let obj_diff_min = Solver.INF_$LI$();
            for (let t = 0; t < this.active_size; t++)
                if (this.y[t] === +1) {
                    if (!this.is_upper_bound(t))
                        if (-this.G[t] >= Gmax) {
                            Gmax = -this.G[t];
                            Gmax_idx = t;
                        }
                }
                else {
                    if (!this.is_lower_bound(t))
                        if (this.G[t] >= Gmax) {
                            Gmax = this.G[t];
                            Gmax_idx = t;
                        }
                }
            ;
            let i = Gmax_idx;
            let Q_i = null;
            if (i !== -1)
                Q_i = this.Q.get_Q(i, this.active_size);
            for (let j = 0; j < this.active_size; j++) {
                if (this.y[j] === +1) {
                    if (!this.is_lower_bound(j)) {
                        let grad_diff = Gmax + this.G[j];
                        if (this.G[j] >= Gmax2)
                            Gmax2 = this.G[j];
                        if (grad_diff > 0) {
                            let obj_diff = void 0;
                            let quad_coef = this.QD[i] + this.QD[j] - 2.0 * this.y[i] * Q_i[j];
                            if (quad_coef > 0)
                                obj_diff = -(grad_diff * grad_diff) / quad_coef;
                            else
                                obj_diff = -(grad_diff * grad_diff) / 1.0E-12;
                            if (obj_diff <= obj_diff_min) {
                                Gmin_idx = j;
                                obj_diff_min = obj_diff;
                            }
                        }
                    }
                }
                else {
                    if (!this.is_upper_bound(j)) {
                        let grad_diff = Gmax - this.G[j];
                        if (-this.G[j] >= Gmax2)
                            Gmax2 = -this.G[j];
                        if (grad_diff > 0) {
                            let obj_diff = void 0;
                            let quad_coef = this.QD[i] + this.QD[j] + 2.0 * this.y[i] * Q_i[j];
                            if (quad_coef > 0)
                                obj_diff = -(grad_diff * grad_diff) / quad_coef;
                            else
                                obj_diff = -(grad_diff * grad_diff) / 1.0E-12;
                            if (obj_diff <= obj_diff_min) {
                                Gmin_idx = j;
                                obj_diff_min = obj_diff;
                            }
                        }
                    }
                }
            }
            ;
            if (Gmax + Gmax2 < this.eps || Gmin_idx === -1)
                return 1;
            working_set[0] = Gmax_idx;
            working_set[1] = Gmin_idx;
            return 0;
        };
        Solver.prototype.be_shrunk = function (i, Gmax1, Gmax2, Gmax3, Gmax4) {
            if (((typeof i === 'number') || i === null) && ((typeof Gmax1 === 'number') || Gmax1 === null) && ((typeof Gmax2 === 'number') || Gmax2 === null) && Gmax3 === undefined && Gmax4 === undefined) {
                return this.be_shrunk$int$double$double(i, Gmax1, Gmax2);
            }
            else
                throw new Error('invalid overload');
        };
        Solver.prototype.be_shrunk$int$double$double = function (i, Gmax1, Gmax2) {
            if (this.is_upper_bound(i)) {
                if (this.y[i] === +1)
                    return (-this.G[i] > Gmax1);
                else
                    return (-this.G[i] > Gmax2);
            }
            else if (this.is_lower_bound(i)) {
                if (this.y[i] === +1)
                    return (this.G[i] > Gmax2);
                else
                    return (this.G[i] > Gmax1);
            }
            else
                return (false);
        };
        Solver.prototype.do_shrinking = function () {
            let i;
            let Gmax1 = -Solver.INF_$LI$();
            let Gmax2 = -Solver.INF_$LI$();
            for (i = 0; i < this.active_size; i++) {
                if (this.y[i] === +1) {
                    if (!this.is_upper_bound(i)) {
                        if (-this.G[i] >= Gmax1)
                            Gmax1 = -this.G[i];
                    }
                    if (!this.is_lower_bound(i)) {
                        if (this.G[i] >= Gmax2)
                            Gmax2 = this.G[i];
                    }
                }
                else {
                    if (!this.is_upper_bound(i)) {
                        if (-this.G[i] >= Gmax2)
                            Gmax2 = -this.G[i];
                    }
                    if (!this.is_lower_bound(i)) {
                        if (this.G[i] >= Gmax1)
                            Gmax1 = this.G[i];
                    }
                }
            }
            ;
            if (this.unshrink === false && Gmax1 + Gmax2 <= this.eps * 10) {
                this.unshrink = true;
                this.reconstruct_gradient();
                this.active_size = this.l;
            }
            for (i = 0; i < this.active_size; i++)
                if (this.be_shrunk$int$double$double(i, Gmax1, Gmax2)) {
                    this.active_size--;
                    while ((this.active_size > i)) {
                        if (!this.be_shrunk$int$double$double(this.active_size, Gmax1, Gmax2)) {
                            this.swap_index(i, this.active_size);
                            break;
                        }
                        this.active_size--;
                    }
                    ;
                }
            ;
        };
        Solver.prototype.calculate_rho = function () {
            let r;
            let nr_free = 0;
            let ub = Solver.INF_$LI$();
            let lb = -Solver.INF_$LI$();
            let sum_free = 0;
            for (let i = 0; i < this.active_size; i++) {
                let yG = this.y[i] * this.G[i];
                if (this.is_lower_bound(i)) {
                    if (this.y[i] > 0)
                        ub = Math.min(ub, yG);
                    else
                        lb = Math.max(lb, yG);
                }
                else if (this.is_upper_bound(i)) {
                    if (this.y[i] < 0)
                        ub = Math.min(ub, yG);
                    else
                        lb = Math.max(lb, yG);
                }
                else {
                    ++nr_free;
                    sum_free += yG;
                }
            }
            ;
            if (nr_free > 0)
                r = sum_free / nr_free;
            else
                r = (ub + lb) / 2;
            return r;
        };
        return Solver;
    }());
    Solver.LOWER_BOUND = 0;
    Solver.UPPER_BOUND = 1;
    Solver.FREE = 2;
    libsvm.Solver = Solver;
    Solver["__class"] = "libsvm.Solver";
    (function (Solver) {
        let SolutionInfo = (function () {
            function SolutionInfo() {
                this.obj = 0;
                this.rho = 0;
                this.upper_bound_p = 0;
                this.upper_bound_n = 0;
                this.r = 0;
            }
            return SolutionInfo;
        }());
        Solver.SolutionInfo = SolutionInfo;
        SolutionInfo["__class"] = "libsvm.Solver.SolutionInfo";
    })(Solver = libsvm.Solver || (libsvm.Solver = {}));
    let svm = (function () {
        function svm() {
        }
        svm.rand_$LI$ = function () {
            if (svm.rand == null)
                svm.rand = new libsvm.Random(); return svm.rand;
        };
        ;
        svm.info = function (s) {
        };
        svm.error = function (s) {
        };
        svm.out = function (s) {
        };
        svm.arraycopy = function (src, srcPos, dest, destPos, length) {
            for (let i = 0; i < length; i++) {
                dest[destPos + i] = src[srcPos + i];
            }
            ;
        };
        svm.solve_c_svc = function (prob, param, alpha, si, Cp, Cn) {
            let l = prob.l;
            let minus_ones = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            let y = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            let i;
            for (i = 0; i < l; i++) {
                alpha[i] = 0;
                minus_ones[i] = -1;
                if (prob.y[i] > 0)
                    y[i] = +1;
                else
                    y[i] = -1;
            }
            ;
            let s = new libsvm.Solver();
            s.Solve(l, new libsvm.SVC_Q(prob, param, y), minus_ones, y, alpha, Cp, Cn, param.eps, si, param.shrinking);
            let sum_alpha = 0;
            for (i = 0; i < l; i++)
                sum_alpha += alpha[i];
            if (Cp === Cn)
                svm.info("nu = " + sum_alpha / (Cp * prob.l) + "\n");
            for (i = 0; i < l; i++)
                alpha[i] *= y[i];
        };
        svm.solve_nu_svc = function (prob, param, alpha, si) {
            let i;
            let l = prob.l;
            let nu = param.nu;
            let y = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            for (i = 0; i < l; i++)
                if (prob.y[i] > 0)
                    y[i] = +1;
                else
                    y[i] = -1;
            ;
            let sum_pos = nu * l / 2;
            let sum_neg = nu * l / 2;
            for (i = 0; i < l; i++)
                if (y[i] === +1) {
                    alpha[i] = Math.min(1.0, sum_pos);
                    sum_pos -= alpha[i];
                }
                else {
                    alpha[i] = Math.min(1.0, sum_neg);
                    sum_neg -= alpha[i];
                }
            ;
            let zeros = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            for (i = 0; i < l; i++)
                zeros[i] = 0;
            let s = new libsvm.Solver_NU();
            s.Solve(l, new libsvm.SVC_Q(prob, param, y), zeros, y, alpha, 1.0, 1.0, param.eps, si, param.shrinking);
            let r = si.r;
            svm.info("C = " + 1 / r + "\n");
            for (i = 0; i < l; i++)
                alpha[i] *= y[i] / r;
            si.rho /= r;
            si.obj /= (r * r);
            si.upper_bound_p = 1 / r;
            si.upper_bound_n = 1 / r;
        };
        svm.solve_one_class = function (prob, param, alpha, si) {
            let l = prob.l;
            let zeros = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            let ones = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            let i;
            let n = ((param.nu * prob.l) | 0);
            for (i = 0; i < n; i++)
                alpha[i] = 1;
            if (n < prob.l)
                alpha[n] = param.nu * prob.l - n;
            for (i = n + 1; i < l; i++)
                alpha[i] = 0;
            for (i = 0; i < l; i++) {
                zeros[i] = 0;
                ones[i] = 1;
            }
            ;
            let s = new libsvm.Solver();
            s.Solve(l, new libsvm.ONE_CLASS_Q(prob, param), zeros, ones, alpha, 1.0, 1.0, param.eps, si, param.shrinking);
        };
        svm.solve_epsilon_svr = function (prob, param, alpha, si) {
            let l = prob.l;
            let alpha2 = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * l);
            let linear_term = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * l);
            let y = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * l);
            let i;
            for (i = 0; i < l; i++) {
                alpha2[i] = 0;
                linear_term[i] = param.p - prob.y[i];
                y[i] = 1;
                alpha2[i + l] = 0;
                linear_term[i + l] = param.p + prob.y[i];
                y[i + l] = -1;
            }
            ;
            let s = new libsvm.Solver();
            s.Solve(2 * l, new libsvm.SVR_Q(prob, param), linear_term, y, alpha2, param.C, param.C, param.eps, si, param.shrinking);
            let sum_alpha = 0;
            for (i = 0; i < l; i++) {
                alpha[i] = alpha2[i] - alpha2[i + l];
                sum_alpha += Math.abs(alpha[i]);
            }
            ;
            svm.info("nu = " + sum_alpha / (param.C * l) + "\n");
        };
        svm.solve_nu_svr = function (prob, param, alpha, si) {
            let l = prob.l;
            let C = param.C;
            let alpha2 = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * l);
            let linear_term = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * l);
            let y = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * l);
            let i;
            let sum = C * param.nu * l / 2;
            for (i = 0; i < l; i++) {
                alpha2[i] = alpha2[i + l] = Math.min(sum, C);
                sum -= alpha2[i];
                linear_term[i] = -prob.y[i];
                y[i] = 1;
                linear_term[i + l] = prob.y[i];
                y[i + l] = -1;
            }
            ;
            let s = new libsvm.Solver_NU();
            s.Solve(2 * l, new libsvm.SVR_Q(prob, param), linear_term, y, alpha2, C, C, param.eps, si, param.shrinking);
            svm.info("epsilon = " + (-si.r) + "\n");
            for (i = 0; i < l; i++)
                alpha[i] = alpha2[i] - alpha2[i + l];
        };
        svm.svm_train_one = function (prob, param, Cp, Cn) {
            let alpha = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(prob.l);
            let si = new libsvm.Solver.SolutionInfo();
            switch ((param.svm_type)) {
                case libsvm.svm_parameter.C_SVC:
                    svm.solve_c_svc(prob, param, alpha, si, Cp, Cn);
                    break;
                case libsvm.svm_parameter.NU_SVC:
                    svm.solve_nu_svc(prob, param, alpha, si);
                    break;
                case libsvm.svm_parameter.ONE_CLASS:
                    svm.solve_one_class(prob, param, alpha, si);
                    break;
                case libsvm.svm_parameter.EPSILON_SVR:
                    svm.solve_epsilon_svr(prob, param, alpha, si);
                    break;
                case libsvm.svm_parameter.NU_SVR:
                    svm.solve_nu_svr(prob, param, alpha, si);
                    break;
            }
            svm.info("obj = " + si.obj + ", rho = " + si.rho + "\n");
            let nSV = 0;
            let nBSV = 0;
            for (let i = 0; i < prob.l; i++) {
                if (Math.abs(alpha[i]) > 0) {
                    ++nSV;
                    if (prob.y[i] > 0) {
                        if (Math.abs(alpha[i]) >= si.upper_bound_p)
                            ++nBSV;
                    }
                    else {
                        if (Math.abs(alpha[i]) >= si.upper_bound_n)
                            ++nBSV;
                    }
                }
            }
            ;
            svm.info("nSV = " + nSV + ", nBSV = " + nBSV + "\n");
            let f = new svm.decision_function();
            f.alpha = alpha;
            f.rho = si.rho;
            return f;
        };
        svm.sigmoid_train = function (l, dec_values, labels, probAB) {
            let A;
            let B;
            let prior1 = 0;
            let prior0 = 0;
            let i;
            for (i = 0; i < l; i++)
                if (labels[i] > 0)
                    prior1 += 1;
                else
                    prior0 += 1;
            ;
            let max_iter = 100;
            let min_step = 1.0E-10;
            let sigma = 1.0E-12;
            let eps = 1.0E-5;
            let hiTarget = (prior1 + 1.0) / (prior1 + 2.0);
            let loTarget = 1 / (prior0 + 2.0);
            let t = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            let fApB;
            let p;
            let q;
            let h11;
            let h22;
            let h21;
            let g1;
            let g2;
            let det;
            let dA;
            let dB;
            let gd;
            let stepsize;
            let newA;
            let newB;
            let newf;
            let d1;
            let d2;
            let iter;
            A = 0.0;
            B = Math.log((prior0 + 1.0) / (prior1 + 1.0));
            let fval = 0.0;
            for (i = 0; i < l; i++) {
                if (labels[i] > 0)
                    t[i] = hiTarget;
                else
                    t[i] = loTarget;
                fApB = dec_values[i] * A + B;
                if (fApB >= 0)
                    fval += t[i] * fApB + Math.log(1 + Math.exp(-fApB));
                else
                    fval += (t[i] - 1) * fApB + Math.log(1 + Math.exp(fApB));
            }
            ;
            for (iter = 0; iter < max_iter; iter++) {
                h11 = sigma;
                h22 = sigma;
                h21 = 0.0;
                g1 = 0.0;
                g2 = 0.0;
                for (i = 0; i < l; i++) {
                    fApB = dec_values[i] * A + B;
                    if (fApB >= 0) {
                        p = Math.exp(-fApB) / (1.0 + Math.exp(-fApB));
                        q = 1.0 / (1.0 + Math.exp(-fApB));
                    }
                    else {
                        p = 1.0 / (1.0 + Math.exp(fApB));
                        q = Math.exp(fApB) / (1.0 + Math.exp(fApB));
                    }
                    d2 = p * q;
                    h11 += dec_values[i] * dec_values[i] * d2;
                    h22 += d2;
                    h21 += dec_values[i] * d2;
                    d1 = t[i] - p;
                    g1 += dec_values[i] * d1;
                    g2 += d1;
                }
                ;
                if (Math.abs(g1) < eps && Math.abs(g2) < eps)
                    break;
                det = h11 * h22 - h21 * h21;
                dA = -(h22 * g1 - h21 * g2) / det;
                dB = -(-h21 * g1 + h11 * g2) / det;
                gd = g1 * dA + g2 * dB;
                stepsize = 1;
                while ((stepsize >= min_step)) {
                    newA = A + stepsize * dA;
                    newB = B + stepsize * dB;
                    newf = 0.0;
                    for (i = 0; i < l; i++) {
                        fApB = dec_values[i] * newA + newB;
                        if (fApB >= 0)
                            newf += t[i] * fApB + Math.log(1 + Math.exp(-fApB));
                        else
                            newf += (t[i] - 1) * fApB + Math.log(1 + Math.exp(fApB));
                    }
                    ;
                    if (newf < fval + 1.0E-4 * stepsize * gd) {
                        A = newA;
                        B = newB;
                        fval = newf;
                        break;
                    }
                    else
                        stepsize = stepsize / 2.0;
                }
                ;
                if (stepsize < min_step) {
                    svm.info("Line search fails in two-class probability estimates\n");
                    break;
                }
            }
            ;
            if (iter >= max_iter)
                svm.info("Reaching maximal iterations in two-class probability estimates\n");
            probAB[0] = A;
            probAB[1] = B;
        };
        svm.sigmoid_predict = function (decision_value, A, B) {
            let fApB = decision_value * A + B;
            if (fApB >= 0)
                return Math.exp(-fApB) / (1.0 + Math.exp(-fApB));
            else
                return 1.0 / (1 + Math.exp(fApB));
        };
        svm.multiclass_probability = function (k, r, p) {
            let t;
            let j;
            let iter = 0;
            let max_iter = Math.max(100, k);
            let Q = (function (dims) {
                let allocate = function (dims) {
                    if (dims.length == 0) {
                        return 0;
                    }
                    else {
                        let array = [];
                        for (let i = 0; i < dims[0]; i++) {
                            array.push(allocate(dims.slice(1)));
                        }
                        return array;
                    }
                }; return allocate(dims);
            })([k, k]);
            let Qp = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(k);
            let pQp;
            let eps = 0.005 / k;
            for (t = 0; t < k; t++) {
                p[t] = 1.0 / k;
                Q[t][t] = 0;
                for (j = 0; j < t; j++) {
                    Q[t][t] += r[j][t] * r[j][t];
                    Q[t][j] = Q[j][t];
                }
                ;
                for (j = t + 1; j < k; j++) {
                    Q[t][t] += r[j][t] * r[j][t];
                    Q[t][j] = -r[j][t] * r[t][j];
                }
                ;
            }
            ;
            for (iter = 0; iter < max_iter; iter++) {
                pQp = 0;
                for (t = 0; t < k; t++) {
                    Qp[t] = 0;
                    for (j = 0; j < k; j++)
                        Qp[t] += Q[t][j] * p[j];
                    pQp += p[t] * Qp[t];
                }
                ;
                let max_error = 0;
                for (t = 0; t < k; t++) {
                    let error = Math.abs(Qp[t] - pQp);
                    if (error > max_error)
                        max_error = error;
                }
                ;
                if (max_error < eps)
                    break;
                for (t = 0; t < k; t++) {
                    let diff = (-Qp[t] + pQp) / Q[t][t];
                    p[t] += diff;
                    pQp = (pQp + diff * (diff * Q[t][t] + 2 * Qp[t])) / (1 + diff) / (1 + diff);
                    for (j = 0; j < k; j++) {
                        Qp[j] = (Qp[j] + diff * Q[t][j]) / (1 + diff);
                        p[j] /= (1 + diff);
                    }
                    ;
                }
                ;
            }
            ;
            if (iter >= max_iter)
                svm.info("Exceeds max_iter in multiclass_prob\n");
        };
        svm.svm_binary_svc_probability = function (prob, param, Cp, Cn, probAB) {
            let i;
            let nr_fold = 5;
            let perm = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(prob.l);
            let dec_values = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(prob.l);
            for (i = 0; i < prob.l; i++)
                perm[i] = i;
            for (i = 0; i < prob.l; i++) {
                let j = i + svm.rand_$LI$().nextInt(prob.l - i);
                do {
                    let tmp = perm[i];
                    perm[i] = perm[j];
                    perm[j] = tmp;
                } while ((false));
            }
            ;
            for (i = 0; i < nr_fold; i++) {
                let begin = (i * prob.l / nr_fold | 0);
                let end = ((i + 1) * prob.l / nr_fold | 0);
                let j = void 0;
                let k = void 0;
                let subprob = new libsvm.svm_problem();
                subprob.l = prob.l - (end - begin);
                subprob.x = new Array(subprob.l);
                subprob.y = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(subprob.l);
                k = 0;
                for (j = 0; j < begin; j++) {
                    subprob.x[k] = prob.x[perm[j]];
                    subprob.y[k] = prob.y[perm[j]];
                    ++k;
                }
                ;
                for (j = end; j < prob.l; j++) {
                    subprob.x[k] = prob.x[perm[j]];
                    subprob.y[k] = prob.y[perm[j]];
                    ++k;
                }
                ;
                let p_count = 0;
                let n_count = 0;
                for (j = 0; j < k; j++)
                    if (subprob.y[j] > 0)
                        p_count++;
                    else
                        n_count++;
                ;
                if (p_count === 0 && n_count === 0)
                    for (j = begin; j < end; j++)
                        dec_values[perm[j]] = 0;
                else if (p_count > 0 && n_count === 0)
                    for (j = begin; j < end; j++)
                        dec_values[perm[j]] = 1;
                else if (p_count === 0 && n_count > 0)
                    for (j = begin; j < end; j++)
                        dec_values[perm[j]] = -1;
                else {
                    let subparam = (function (o) {
                        if (o.clone != undefined) {
                            return o.clone();
                        }
                        else {
                            let clone = Object.create(o);
                            for (let p in o) {
                                if (o.hasOwnProperty(p))
                                    clone[p] = o[p];
                            }
                            return clone;
                        }
                    })(param);
                    subparam.probability = 0;
                    subparam.C = 1.0;
                    subparam.nr_weight = 2;
                    subparam.weight_label = [0, 0];
                    subparam.weight = [0, 0];
                    subparam.weight_label[0] = +1;
                    subparam.weight_label[1] = -1;
                    subparam.weight[0] = Cp;
                    subparam.weight[1] = Cn;
                    let submodel = svm.svm_train(subprob, subparam);
                    for (j = begin; j < end; j++) {
                        let dec_value = [0];
                        svm.svm_predict_values(submodel, prob.x[perm[j]], dec_value);
                        dec_values[perm[j]] = dec_value[0];
                        dec_values[perm[j]] *= submodel.label[0];
                    }
                    ;
                }
            }
            ;
            svm.sigmoid_train(prob.l, dec_values, prob.y, probAB);
        };
        svm.svm_svr_probability = function (prob, param) {
            let i;
            let nr_fold = 5;
            let ymv = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(prob.l);
            let mae = 0;
            let newparam = (function (o) {
                if (o.clone != undefined) {
                    return o.clone();
                }
                else {
                    let clone = Object.create(o);
                    for (let p in o) {
                        if (o.hasOwnProperty(p))
                            clone[p] = o[p];
                    }
                    return clone;
                }
            })(param);
            newparam.probability = 0;
            svm.svm_cross_validation(prob, newparam, nr_fold, ymv);
            for (i = 0; i < prob.l; i++) {
                ymv[i] = prob.y[i] - ymv[i];
                mae += Math.abs(ymv[i]);
            }
            ;
            mae /= prob.l;
            let std = Math.sqrt(2 * mae * mae);
            let count = 0;
            mae = 0;
            for (i = 0; i < prob.l; i++)
                if (Math.abs(ymv[i]) > 5 * std)
                    count = count + 1;
                else
                    mae += Math.abs(ymv[i]);
            ;
            mae /= (prob.l - count);
            svm.info("Prob. model for test data: target value = predicted value + z,\nz: Laplace distribution e^(-|z|/sigma)/(2sigma),sigma=" + mae + "\n");
            return mae;
        };
        svm.svm_group_classes = function (prob, nr_class_ret, label_ret, start_ret, count_ret, perm) {
            let l = prob.l;
            let max_nr_class = 16;
            let nr_class = 0;
            let label = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(max_nr_class);
            let count = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(max_nr_class);
            let data_label = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            let i;
            for (i = 0; i < l; i++) {
                let this_label = ((prob.y[i]) | 0);
                let j = void 0;
                for (j = 0; j < nr_class; j++) {
                    if (this_label === label[j]) {
                        ++count[j];
                        break;
                    }
                }
                ;
                data_label[i] = j;
                if (j === nr_class) {
                    if (nr_class === max_nr_class) {
                        max_nr_class *= 2;
                        let new_data = (function (s) {
                            let a = []; while (s-- > 0)
                                a.push(0); return a;
                        })(max_nr_class);
                        svm.arraycopy(label, 0, new_data, 0, label.length);
                        label = new_data;
                        new_data = (function (s) {
                            let a = []; while (s-- > 0)
                                a.push(0); return a;
                        })(max_nr_class);
                        svm.arraycopy(count, 0, new_data, 0, count.length);
                        count = new_data;
                    }
                    label[nr_class] = this_label;
                    count[nr_class] = 1;
                    ++nr_class;
                }
            }
            ;
            if (nr_class === 2 && label[0] === -1 && label[1] === +1) {
                do {
                    let tmp = label[0];
                    label[0] = label[1];
                    label[1] = tmp;
                } while ((false));
                do {
                    let tmp = count[0];
                    count[0] = count[1];
                    count[1] = tmp;
                } while ((false));
                for (i = 0; i < l; i++) {
                    if (data_label[i] === 0)
                        data_label[i] = 1;
                    else
                        data_label[i] = 0;
                }
                ;
            }
            let start = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(nr_class);
            start[0] = 0;
            for (i = 1; i < nr_class; i++)
                start[i] = start[i - 1] + count[i - 1];
            for (i = 0; i < l; i++) {
                perm[start[data_label[i]]] = i;
                ++start[data_label[i]];
            }
            ;
            start[0] = 0;
            for (i = 1; i < nr_class; i++)
                start[i] = start[i - 1] + count[i - 1];
            nr_class_ret[0] = nr_class;
            label_ret[0] = label;
            start_ret[0] = start;
            count_ret[0] = count;
        };
        svm.svm_train = function (prob, param) {
            let model = new libsvm.svm_model();
            model.param = param;
            if (param.svm_type === libsvm.svm_parameter.ONE_CLASS || param.svm_type === libsvm.svm_parameter.EPSILON_SVR || param.svm_type === libsvm.svm_parameter.NU_SVR) {
                model.nr_class = 2;
                model.label = null;
                model.nSV = null;
                model.probA = null;
                model.probB = null;
                model.sv_coef = new Array(1);
                if (param.probability === 1 && (param.svm_type === libsvm.svm_parameter.EPSILON_SVR || param.svm_type === libsvm.svm_parameter.NU_SVR)) {
                    model.probA = [0];
                    model.probA[0] = svm.svm_svr_probability(prob, param);
                }
                let f = svm.svm_train_one(prob, param, 0, 0);
                model.rho = [0];
                model.rho[0] = f.rho;
                let nSV = 0;
                let i = void 0;
                for (i = 0; i < prob.l; i++)
                    if (Math.abs(f.alpha[i]) > 0)
                        ++nSV;
                ;
                model.l = nSV;
                model.SV = new Array(nSV);
                model.sv_coef[0] = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nSV);
                model.sv_indices = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nSV);
                let j = 0;
                for (i = 0; i < prob.l; i++)
                    if (Math.abs(f.alpha[i]) > 0) {
                        model.SV[j] = prob.x[i];
                        model.sv_coef[0][j] = f.alpha[i];
                        model.sv_indices[j] = i + 1;
                        ++j;
                    }
                ;
            }
            else {
                let l = prob.l;
                let tmp_nr_class = [0];
                let tmp_label = new Array(1);
                let tmp_start = new Array(1);
                let tmp_count = new Array(1);
                let perm = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                svm.svm_group_classes(prob, tmp_nr_class, tmp_label, tmp_start, tmp_count, perm);
                let nr_class = tmp_nr_class[0];
                let label = tmp_label[0];
                let start = tmp_start[0];
                let count = tmp_count[0];
                if (nr_class === 1)
                    svm.info("WARNING: training data in only one class. See README for details.\n");
                let x = new Array(l);
                let i = void 0;
                for (i = 0; i < l; i++)
                    x[i] = prob.x[perm[i]];
                let weighted_C = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                for (i = 0; i < nr_class; i++)
                    weighted_C[i] = param.C;
                for (i = 0; i < param.nr_weight; i++) {
                    let j = void 0;
                    for (j = 0; j < nr_class; j++)
                        if (param.weight_label[i] === label[j])
                            break;
                    ;
                    if (j === nr_class)
                        svm.error("WARNING: class label " + param.weight_label[i] + " specified in weight is not found\n");
                    else
                        weighted_C[j] *= param.weight[i];
                }
                ;
                let nonzero = new Array(l);
                for (i = 0; i < l; i++)
                    nonzero[i] = false;
                let f = new Array((nr_class * (nr_class - 1) / 2 | 0));
                let probA = null;
                let probB = null;
                if (param.probability === 1) {
                    probA = (function (s) {
                        let a = []; while (s-- > 0)
                            a.push(0); return a;
                    })((nr_class * (nr_class - 1) / 2 | 0));
                    probB = (function (s) {
                        let a = []; while (s-- > 0)
                            a.push(0); return a;
                    })((nr_class * (nr_class - 1) / 2 | 0));
                }
                let p = 0;
                for (i = 0; i < nr_class; i++)
                    for (let j = i + 1; j < nr_class; j++) {
                        let sub_prob = new libsvm.svm_problem();
                        let si = start[i];
                        let sj = start[j];
                        let ci = count[i];
                        let cj = count[j];
                        sub_prob.l = ci + cj;
                        sub_prob.x = new Array(sub_prob.l);
                        sub_prob.y = (function (s) {
                            let a = []; while (s-- > 0)
                                a.push(0); return a;
                        })(sub_prob.l);
                        let k = void 0;
                        for (k = 0; k < ci; k++) {
                            sub_prob.x[k] = x[si + k];
                            sub_prob.y[k] = +1;
                        }
                        ;
                        for (k = 0; k < cj; k++) {
                            sub_prob.x[ci + k] = x[sj + k];
                            sub_prob.y[ci + k] = -1;
                        }
                        ;
                        if (param.probability === 1) {
                            let probAB = [0, 0];
                            svm.svm_binary_svc_probability(sub_prob, param, weighted_C[i], weighted_C[j], probAB);
                            probA[p] = probAB[0];
                            probB[p] = probAB[1];
                        }
                        f[p] = svm.svm_train_one(sub_prob, param, weighted_C[i], weighted_C[j]);
                        for (k = 0; k < ci; k++)
                            if (!nonzero[si + k] && Math.abs(f[p].alpha[k]) > 0)
                                nonzero[si + k] = true;
                        ;
                        for (k = 0; k < cj; k++)
                            if (!nonzero[sj + k] && Math.abs(f[p].alpha[ci + k]) > 0)
                                nonzero[sj + k] = true;
                        ;
                        ++p;
                    }
                ;
                ;
                model.nr_class = nr_class;
                model.label = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                for (i = 0; i < nr_class; i++)
                    model.label[i] = label[i];
                model.rho = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })((nr_class * (nr_class - 1) / 2 | 0));
                for (i = 0; i < (nr_class * (nr_class - 1) / 2 | 0); i++)
                    model.rho[i] = f[i].rho;
                if (param.probability === 1) {
                    model.probA = (function (s) {
                        let a = []; while (s-- > 0)
                            a.push(0); return a;
                    })((nr_class * (nr_class - 1) / 2 | 0));
                    model.probB = (function (s) {
                        let a = []; while (s-- > 0)
                            a.push(0); return a;
                    })((nr_class * (nr_class - 1) / 2 | 0));
                    for (i = 0; i < (nr_class * (nr_class - 1) / 2 | 0); i++) {
                        model.probA[i] = probA[i];
                        model.probB[i] = probB[i];
                    }
                    ;
                }
                else {
                    model.probA = null;
                    model.probB = null;
                }
                let nnz = 0;
                let nz_count = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                model.nSV = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                for (i = 0; i < nr_class; i++) {
                    let nSV = 0;
                    for (let j = 0; j < count[i]; j++)
                        if (nonzero[start[i] + j]) {
                            ++nSV;
                            ++nnz;
                        }
                    ;
                    model.nSV[i] = nSV;
                    nz_count[i] = nSV;
                }
                ;
                svm.info("Total nSV = " + nnz + "\n");
                model.l = nnz;
                model.SV = new Array(nnz);
                model.sv_indices = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nnz);
                p = 0;
                for (i = 0; i < l; i++)
                    if (nonzero[i]) {
                        model.SV[p] = x[i];
                        model.sv_indices[p++] = perm[i] + 1;
                    }
                ;
                let nz_start = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                nz_start[0] = 0;
                for (i = 1; i < nr_class; i++)
                    nz_start[i] = nz_start[i - 1] + nz_count[i - 1];
                model.sv_coef = new Array(nr_class - 1);
                for (i = 0; i < nr_class - 1; i++)
                    model.sv_coef[i] = (function (s) {
                        let a = []; while (s-- > 0)
                            a.push(0); return a;
                    })(nnz);
                p = 0;
                for (i = 0; i < nr_class; i++)
                    for (let j = i + 1; j < nr_class; j++) {
                        let si = start[i];
                        let sj = start[j];
                        let ci = count[i];
                        let cj = count[j];
                        let q = nz_start[i];
                        let k = void 0;
                        for (k = 0; k < ci; k++)
                            if (nonzero[si + k])
                                model.sv_coef[j - 1][q++] = f[p].alpha[k];
                        ;
                        q = nz_start[j];
                        for (k = 0; k < cj; k++)
                            if (nonzero[sj + k])
                                model.sv_coef[i][q++] = f[p].alpha[ci + k];
                        ;
                        ++p;
                    }
                ;
                ;
            }
            return model;
        };
        svm.svm_cross_validation = function (prob, param, nr_fold, target) {
            let i;
            let fold_start = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(nr_fold + 1);
            let l = prob.l;
            let perm = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(l);
            if ((param.svm_type === libsvm.svm_parameter.C_SVC || param.svm_type === libsvm.svm_parameter.NU_SVC) && nr_fold < l) {
                let tmp_nr_class = [0];
                let tmp_label = new Array(1);
                let tmp_start = new Array(1);
                let tmp_count = new Array(1);
                svm.svm_group_classes(prob, tmp_nr_class, tmp_label, tmp_start, tmp_count, perm);
                let nr_class = tmp_nr_class[0];
                let start = tmp_start[0];
                let count = tmp_count[0];
                let fold_count = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_fold);
                let c = void 0;
                let index = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                for (i = 0; i < l; i++)
                    index[i] = perm[i];
                for (c = 0; c < nr_class; c++)
                    for (i = 0; i < count[c]; i++) {
                        let j = i + svm.rand_$LI$().nextInt(count[c] - i);
                        do {
                            let tmp = index[start[c] + j];
                            index[start[c] + j] = index[start[c] + i];
                            index[start[c] + i] = tmp;
                        } while ((false));
                    }
                ;
                ;
                for (i = 0; i < nr_fold; i++) {
                    fold_count[i] = 0;
                    for (c = 0; c < nr_class; c++)
                        fold_count[i] += ((i + 1) * count[c] / nr_fold | 0) - (i * count[c] / nr_fold | 0);
                }
                ;
                fold_start[0] = 0;
                for (i = 1; i <= nr_fold; i++)
                    fold_start[i] = fold_start[i - 1] + fold_count[i - 1];
                for (c = 0; c < nr_class; c++)
                    for (i = 0; i < nr_fold; i++) {
                        let begin = start[c] + (i * count[c] / nr_fold | 0);
                        let end = start[c] + ((i + 1) * count[c] / nr_fold | 0);
                        for (let j = begin; j < end; j++) {
                            perm[fold_start[i]] = index[j];
                            fold_start[i]++;
                        }
                        ;
                    }
                ;
                ;
                fold_start[0] = 0;
                for (i = 1; i <= nr_fold; i++)
                    fold_start[i] = fold_start[i - 1] + fold_count[i - 1];
            }
            else {
                for (i = 0; i < l; i++)
                    perm[i] = i;
                for (i = 0; i < l; i++) {
                    let j = i + svm.rand_$LI$().nextInt(l - i);
                    do {
                        let tmp = perm[i];
                        perm[i] = perm[j];
                        perm[j] = tmp;
                    } while ((false));
                }
                ;
                for (i = 0; i <= nr_fold; i++)
                    fold_start[i] = (i * l / nr_fold | 0);
            }
            for (i = 0; i < nr_fold; i++) {
                let begin = fold_start[i];
                let end = fold_start[i + 1];
                let j = void 0;
                let k = void 0;
                let subprob = new libsvm.svm_problem();
                subprob.l = l - (end - begin);
                subprob.x = new Array(subprob.l);
                subprob.y = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(subprob.l);
                k = 0;
                for (j = 0; j < begin; j++) {
                    subprob.x[k] = prob.x[perm[j]];
                    subprob.y[k] = prob.y[perm[j]];
                    ++k;
                }
                ;
                for (j = end; j < l; j++) {
                    subprob.x[k] = prob.x[perm[j]];
                    subprob.y[k] = prob.y[perm[j]];
                    ++k;
                }
                ;
                let submodel = svm.svm_train(subprob, param);
                if (param.probability === 1 && (param.svm_type === libsvm.svm_parameter.C_SVC || param.svm_type === libsvm.svm_parameter.NU_SVC)) {
                    let prob_estimates = (function (s) {
                        let a = []; while (s-- > 0)
                            a.push(0); return a;
                    })(svm.svm_get_nr_class(submodel));
                    for (j = begin; j < end; j++)
                        target[perm[j]] = svm.svm_predict_probability(submodel, prob.x[perm[j]], prob_estimates);
                }
                else
                    for (j = begin; j < end; j++)
                        target[perm[j]] = svm.svm_predict(submodel, prob.x[perm[j]]);
            }
            ;
        };
        svm.svm_get_svm_type = function (model) {
            return model.param.svm_type;
        };
        svm.svm_get_nr_class = function (model) {
            return model.nr_class;
        };
        svm.svm_get_labels = function (model, label) {
            if (model.label != null)
                for (let i = 0; i < model.nr_class; i++)
                    label[i] = model.label[i];
        };
        svm.svm_get_sv_indices = function (model, indices) {
            if (model.sv_indices != null)
                for (let i = 0; i < model.l; i++)
                    indices[i] = model.sv_indices[i];
        };
        svm.svm_get_nr_sv = function (model) {
            return model.l;
        };
        svm.svm_get_svr_probability = function (model) {
            if ((model.param.svm_type === libsvm.svm_parameter.EPSILON_SVR || model.param.svm_type === libsvm.svm_parameter.NU_SVR) && model.probA != null)
                return model.probA[0];
            else {
                svm.error("Model doesn\'t contain information for SVR probability inference\n");
                return 0;
            }
        };
        svm.svm_predict_values = function (model, x, dec_values) {
            let i;
            if (model.param.svm_type === libsvm.svm_parameter.ONE_CLASS || model.param.svm_type === libsvm.svm_parameter.EPSILON_SVR || model.param.svm_type === libsvm.svm_parameter.NU_SVR) {
                let sv_coef = model.sv_coef[0];
                let sum = 0;
                for (i = 0; i < model.l; i++)
                    sum += sv_coef[i] * libsvm.Kernel.k_function(x, model.SV[i], model.param);
                sum -= model.rho[0];
                dec_values[0] = sum;
                if (model.param.svm_type === libsvm.svm_parameter.ONE_CLASS)
                    return (sum > 0) ? 1 : -1;
                else
                    return sum;
            }
            else {
                let nr_class = model.nr_class;
                let l = model.l;
                let kvalue = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                for (i = 0; i < l; i++)
                    kvalue[i] = libsvm.Kernel.k_function(x, model.SV[i], model.param);
                let start = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                start[0] = 0;
                for (i = 1; i < nr_class; i++)
                    start[i] = start[i - 1] + model.nSV[i - 1];
                let vote = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(nr_class);
                for (i = 0; i < nr_class; i++)
                    vote[i] = 0;
                let p = 0;
                for (i = 0; i < nr_class; i++)
                    for (let j = i + 1; j < nr_class; j++) {
                        let sum = 0;
                        let si = start[i];
                        let sj = start[j];
                        let ci = model.nSV[i];
                        let cj = model.nSV[j];
                        let k = void 0;
                        let coef1 = model.sv_coef[j - 1];
                        let coef2 = model.sv_coef[i];
                        for (k = 0; k < ci; k++)
                            sum += coef1[si + k] * kvalue[si + k];
                        for (k = 0; k < cj; k++)
                            sum += coef2[sj + k] * kvalue[sj + k];
                        sum -= model.rho[p];
                        dec_values[p] = sum;
                        if (dec_values[p] > 0)
                            ++vote[i];
                        else
                            ++vote[j];
                        p++;
                    }
                ;
                ;
                let vote_max_idx = 0;
                for (i = 1; i < nr_class; i++)
                    if (vote[i] > vote[vote_max_idx])
                        vote_max_idx = i;
                ;
                return model.label[vote_max_idx];
            }
        };
        svm.svm_predict = function (model, x) {
            let nr_class = model.nr_class;
            let dec_values;
            if (model.param.svm_type === libsvm.svm_parameter.ONE_CLASS || model.param.svm_type === libsvm.svm_parameter.EPSILON_SVR || model.param.svm_type === libsvm.svm_parameter.NU_SVR)
                dec_values = [0];
            else
                dec_values = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })((nr_class * (nr_class - 1) / 2 | 0));
            let pred_result = svm.svm_predict_values(model, x, dec_values);
            return pred_result;
        };
        svm.svm_predict_probability = function (model, x, prob_estimates) {
            if ((model.param.svm_type === libsvm.svm_parameter.C_SVC || model.param.svm_type === libsvm.svm_parameter.NU_SVC) && model.probA != null && model.probB != null) {
                let i = void 0;
                let nr_class = model.nr_class;
                let dec_values = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })((nr_class * (nr_class - 1) / 2 | 0));
                svm.svm_predict_values(model, x, dec_values);
                let min_prob = 1.0E-7;
                let pairwise_prob = (function (dims) {
                    let allocate = function (dims) {
                        if (dims.length == 0) {
                            return 0;
                        }
                        else {
                            let array = [];
                            for (let i_1 = 0; i_1 < dims[0]; i_1++) {
                                array.push(allocate(dims.slice(1)));
                            }
                            return array;
                        }
                    }; return allocate(dims);
                })([nr_class, nr_class]);
                let k = 0;
                for (i = 0; i < nr_class; i++)
                    for (let j = i + 1; j < nr_class; j++) {
                        pairwise_prob[i][j] = Math.min(Math.max(svm.sigmoid_predict(dec_values[k], model.probA[k], model.probB[k]), min_prob), 1 - min_prob);
                        pairwise_prob[j][i] = 1 - pairwise_prob[i][j];
                        k++;
                    }
                ;
                ;
                if (nr_class === 2) {
                    prob_estimates[0] = pairwise_prob[0][1];
                    prob_estimates[1] = pairwise_prob[1][0];
                }
                else
                    svm.multiclass_probability(nr_class, pairwise_prob, prob_estimates);
                let prob_max_idx = 0;
                for (i = 1; i < nr_class; i++)
                    if (prob_estimates[i] > prob_estimates[prob_max_idx])
                        prob_max_idx = i;
                ;
                return model.label[prob_max_idx];
            }
            else
                return svm.svm_predict(model, x);
        };
        svm.svm_type_table_$LI$ = function () {
            if (svm.svm_type_table == null)
                svm.svm_type_table = ["c_svc", "nu_svc", "one_class", "epsilon_svr", "nu_svr"]; return svm.svm_type_table;
        };
        ;
        svm.kernel_type_table_$LI$ = function () {
            if (svm.kernel_type_table == null)
                svm.kernel_type_table = ["linear", "polynomial", "rbf", "sigmoid", "precomputed"]; return svm.kernel_type_table;
        };
        ;
        svm.svm_check_parameter = function (prob, param) {
            let svm_type = param.svm_type;
            if (svm_type !== libsvm.svm_parameter.C_SVC && svm_type !== libsvm.svm_parameter.NU_SVC && svm_type !== libsvm.svm_parameter.ONE_CLASS && svm_type !== libsvm.svm_parameter.EPSILON_SVR && svm_type !== libsvm.svm_parameter.NU_SVR)
                return "unknown svm type";
            let kernel_type = param.kernel_type;
            if (kernel_type !== libsvm.svm_parameter.LINEAR && kernel_type !== libsvm.svm_parameter.POLY && kernel_type !== libsvm.svm_parameter.RBF && kernel_type !== libsvm.svm_parameter.SIGMOID && kernel_type !== libsvm.svm_parameter.PRECOMPUTED)
                return "unknown kernel type";
            if (param.gamma < 0)
                return "gamma < 0";
            if (param.degree < 0)
                return "degree of polynomial kernel < 0";
            if (param.cache_size <= 0)
                return "cache_size <= 0";
            if (param.eps <= 0)
                return "eps <= 0";
            if (svm_type === libsvm.svm_parameter.C_SVC || svm_type === libsvm.svm_parameter.EPSILON_SVR || svm_type === libsvm.svm_parameter.NU_SVR)
                if (param.C <= 0)
                    return "C <= 0";
            if (svm_type === libsvm.svm_parameter.NU_SVC || svm_type === libsvm.svm_parameter.ONE_CLASS || svm_type === libsvm.svm_parameter.NU_SVR)
                if (param.nu <= 0 || param.nu > 1)
                    return "nu <= 0 or nu > 1";
            if (svm_type === libsvm.svm_parameter.EPSILON_SVR)
                if (param.p < 0)
                    return "p < 0";
            if (param.shrinking !== 0 && param.shrinking !== 1)
                return "shrinking != 0 and shrinking != 1";
            if (param.probability !== 0 && param.probability !== 1)
                return "probability != 0 and probability != 1";
            if (param.probability === 1 && svm_type === libsvm.svm_parameter.ONE_CLASS)
                return "one-class SVM probability output not supported yet";
            if (svm_type === libsvm.svm_parameter.NU_SVC) {
                let l = prob.l;
                let max_nr_class = 16;
                let nr_class = 0;
                let label = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(max_nr_class);
                let count = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(max_nr_class);
                let i = void 0;
                for (i = 0; i < l; i++) {
                    let this_label = (prob.y[i] | 0);
                    let j = void 0;
                    for (j = 0; j < nr_class; j++)
                        if (this_label === label[j]) {
                            ++count[j];
                            break;
                        }
                    ;
                    if (j === nr_class) {
                        if (nr_class === max_nr_class) {
                            max_nr_class *= 2;
                            let new_data = (function (s) {
                                let a = []; while (s-- > 0)
                                    a.push(0); return a;
                            })(max_nr_class);
                            svm.arraycopy(label, 0, new_data, 0, label.length);
                            label = new_data;
                            new_data = (function (s) {
                                let a = []; while (s-- > 0)
                                    a.push(0); return a;
                            })(max_nr_class);
                            svm.arraycopy(count, 0, new_data, 0, count.length);
                            count = new_data;
                        }
                        label[nr_class] = this_label;
                        count[nr_class] = 1;
                        ++nr_class;
                    }
                }
                ;
                for (i = 0; i < nr_class; i++) {
                    let n1 = count[i];
                    for (let j = i + 1; j < nr_class; j++) {
                        let n2 = count[j];
                        if (param.nu * (n1 + n2) / 2 > Math.min(n1, n2))
                            return "specified nu is infeasible";
                    }
                    ;
                }
                ;
            }
            return null;
        };
        svm.svm_check_probability_model = function (model) {
            if (((model.param.svm_type === libsvm.svm_parameter.C_SVC || model.param.svm_type === libsvm.svm_parameter.NU_SVC) && model.probA != null && model.probB != null) || ((model.param.svm_type === libsvm.svm_parameter.EPSILON_SVR || model.param.svm_type === libsvm.svm_parameter.NU_SVR) && model.probA != null))
                return 1;
            else
                return 0;
        };
        return svm;
    }());
    svm.LIBSVM_VERSION = 322;
    libsvm.svm = svm;
    svm["__class"] = "libsvm.svm";
    (function (svm) {
        let decision_function = (function () {
            function decision_function() {
                this.alpha = null;
                this.rho = 0;
            }
            return decision_function;
        }());
        svm.decision_function = decision_function;
        decision_function["__class"] = "libsvm.svm.decision_function";
    })(svm = libsvm.svm || (libsvm.svm = {}));
    let Kernel = (function (_super) {
        __extends(Kernel, _super);
        function Kernel(l, x_, param) {
            let _this = _super.call(this) || this;
            _this.x = null;
            _this.x_square = null;
            _this.kernel_type = 0;
            _this.degree = 0;
            _this.gamma = 0;
            _this.coef0 = 0;
            _this.kernel_type = param.kernel_type;
            _this.degree = param.degree;
            _this.gamma = param.gamma;
            _this.coef0 = param.coef0;
            _this.x = x_.slice(0);
            if (_this.kernel_type === libsvm.svm_parameter.RBF) {
                _this.x_square = (function (s) {
                    let a = []; while (s-- > 0)
                        a.push(0); return a;
                })(l);
                for (let i = 0; i < l; i++)
                    _this.x_square[i] = Kernel.dot(_this.x[i], _this.x[i]);
            }
            else
                _this.x_square = null;
            return _this;
        }
        Kernel.prototype.swap_index = function (i, j) {
            do {
                let tmp = this.x[i];
                this.x[i] = this.x[j];
                this.x[j] = tmp;
            } while ((false));
            if (this.x_square != null)
                do {
                    let tmp = this.x_square[i];
                    this.x_square[i] = this.x_square[j];
                    this.x_square[j] = tmp;
                } while ((false));
        };
        /*private*/ Kernel.tanh = function (x) {
            let x2 = 2.0 * x;
            let exp_x2 = Math.exp(x2);
            return (exp_x2 - 1.0) / (exp_x2 + 1.0);
        };
        /*private*/ Kernel.powi = function (base, times) {
            let tmp = base;
            let ret = 1.0;
            for (let t = times; t > 0; t /= 2) {
                if (t % 2 === 1)
                    ret *= tmp;
                tmp = tmp * tmp;
            }
            ;
            return ret;
        };
        Kernel.prototype.kernel_function = function (i, j) {
            switch ((this.kernel_type)) {
                case libsvm.svm_parameter.LINEAR:
                    return Kernel.dot(this.x[i], this.x[j]);
                case libsvm.svm_parameter.POLY:
                    return Kernel.powi(this.gamma * Kernel.dot(this.x[i], this.x[j]) + this.coef0, this.degree);
                case libsvm.svm_parameter.RBF:
                    return Math.exp(-this.gamma * (this.x_square[i] + this.x_square[j] - 2 * Kernel.dot(this.x[i], this.x[j])));
                case libsvm.svm_parameter.SIGMOID:
                    return Kernel.tanh(this.gamma * Kernel.dot(this.x[i], this.x[j]) + this.coef0);
                case libsvm.svm_parameter.PRECOMPUTED:
                    return this.x[i][((this.x[j][0].value) | 0)].value;
                default:
                    return 0;
            }
        };
        Kernel.dot = function (x, y) {
            let sum = 0;
            let xlen = x.length;
            let ylen = y.length;
            let i = 0;
            let j = 0;
            while ((i < xlen && j < ylen)) {
                if (x[i].index === y[j].index)
                    sum += x[i++].value * y[j++].value;
                else {
                    if (x[i].index > y[j].index)
                        ++j;
                    else
                        ++i;
                }
            }
            ;
            return sum;
        };
        Kernel.k_function = function (x, y, param) {
            switch ((param.kernel_type)) {
                case libsvm.svm_parameter.LINEAR:
                    return Kernel.dot(x, y);
                case libsvm.svm_parameter.POLY:
                    return Kernel.powi(param.gamma * Kernel.dot(x, y) + param.coef0, param.degree);
                case libsvm.svm_parameter.RBF:
                    {
                        let sum = 0;
                        let xlen = x.length;
                        let ylen = y.length;
                        let i = 0;
                        let j = 0;
                        while ((i < xlen && j < ylen)) {
                            if (x[i].index === y[j].index) {
                                let d = x[i++].value - y[j++].value;
                                sum += d * d;
                            }
                            else if (x[i].index > y[j].index) {
                                sum += y[j].value * y[j].value;
                                ++j;
                            }
                            else {
                                sum += x[i].value * x[i].value;
                                ++i;
                            }
                        }
                        ;
                        while ((i < xlen)) {
                            sum += x[i].value * x[i].value;
                            ++i;
                        }
                        ;
                        while ((j < ylen)) {
                            sum += y[j].value * y[j].value;
                            ++j;
                        }
                        ;
                        return Math.exp(-param.gamma * sum);
                    }
                    ;
                case libsvm.svm_parameter.SIGMOID:
                    return Kernel.tanh(param.gamma * Kernel.dot(x, y) + param.coef0);
                case libsvm.svm_parameter.PRECOMPUTED:
                    return x[((y[0].value) | 0)].value;
                default:
                    return 0;
            }
        };
        return Kernel;
    }(libsvm.QMatrix));
    libsvm.Kernel = Kernel;
    Kernel["__class"] = "libsvm.Kernel";
    let Solver_NU = (function (_super) {
        __extends(Solver_NU, _super);
        function Solver_NU() {
            let _this = _super.call(this) || this;
            _this.si = null;
            return _this;
        }
        Solver_NU.prototype.Solve = function (l, Q, p, y, alpha, Cp, Cn, eps, si, shrinking) {
            this.si = si;
            _super.prototype.Solve.call(this, l, Q, p, y, alpha, Cp, Cn, eps, si, shrinking);
        };
        Solver_NU.prototype.select_working_set = function (working_set) {
            let Gmaxp = -libsvm.Solver.INF_$LI$();
            let Gmaxp2 = -libsvm.Solver.INF_$LI$();
            let Gmaxp_idx = -1;
            let Gmaxn = -libsvm.Solver.INF_$LI$();
            let Gmaxn2 = -libsvm.Solver.INF_$LI$();
            let Gmaxn_idx = -1;
            let Gmin_idx = -1;
            let obj_diff_min = libsvm.Solver.INF_$LI$();
            for (let t = 0; t < this.active_size; t++)
                if (this.y[t] === +1) {
                    if (!this.is_upper_bound(t))
                        if (-this.G[t] >= Gmaxp) {
                            Gmaxp = -this.G[t];
                            Gmaxp_idx = t;
                        }
                }
                else {
                    if (!this.is_lower_bound(t))
                        if (this.G[t] >= Gmaxn) {
                            Gmaxn = this.G[t];
                            Gmaxn_idx = t;
                        }
                }
            ;
            let ip = Gmaxp_idx;
            let __in = Gmaxn_idx;
            let Q_ip = null;
            let Q_in = null;
            if (ip !== -1)
                Q_ip = this.Q.get_Q(ip, this.active_size);
            if (__in !== -1)
                Q_in = this.Q.get_Q(__in, this.active_size);
            for (let j = 0; j < this.active_size; j++) {
                if (this.y[j] === +1) {
                    if (!this.is_lower_bound(j)) {
                        let grad_diff = Gmaxp + this.G[j];
                        if (this.G[j] >= Gmaxp2)
                            Gmaxp2 = this.G[j];
                        if (grad_diff > 0) {
                            let obj_diff = void 0;
                            let quad_coef = this.QD[ip] + this.QD[j] - 2 * Q_ip[j];
                            if (quad_coef > 0)
                                obj_diff = -(grad_diff * grad_diff) / quad_coef;
                            else
                                obj_diff = -(grad_diff * grad_diff) / 1.0E-12;
                            if (obj_diff <= obj_diff_min) {
                                Gmin_idx = j;
                                obj_diff_min = obj_diff;
                            }
                        }
                    }
                }
                else {
                    if (!this.is_upper_bound(j)) {
                        let grad_diff = Gmaxn - this.G[j];
                        if (-this.G[j] >= Gmaxn2)
                            Gmaxn2 = -this.G[j];
                        if (grad_diff > 0) {
                            let obj_diff = void 0;
                            let quad_coef = this.QD[__in] + this.QD[j] - 2 * Q_in[j];
                            if (quad_coef > 0)
                                obj_diff = -(grad_diff * grad_diff) / quad_coef;
                            else
                                obj_diff = -(grad_diff * grad_diff) / 1.0E-12;
                            if (obj_diff <= obj_diff_min) {
                                Gmin_idx = j;
                                obj_diff_min = obj_diff;
                            }
                        }
                    }
                }
            }
            ;
            if (Math.max(Gmaxp + Gmaxp2, Gmaxn + Gmaxn2) < this.eps || Gmin_idx === -1)
                return 1;
            if (this.y[Gmin_idx] === +1)
                working_set[0] = Gmaxp_idx;
            else
                working_set[0] = Gmaxn_idx;
            working_set[1] = Gmin_idx;
            return 0;
        };
        Solver_NU.prototype.be_shrunk$int$double$double$double$double = function (i, Gmax1, Gmax2, Gmax3, Gmax4) {
            if (this.is_upper_bound(i)) {
                if (this.y[i] === +1)
                    return (-this.G[i] > Gmax1);
                else
                    return (-this.G[i] > Gmax4);
            }
            else if (this.is_lower_bound(i)) {
                if (this.y[i] === +1)
                    return (this.G[i] > Gmax2);
                else
                    return (this.G[i] > Gmax3);
            }
            else
                return (false);
        };
        Solver_NU.prototype.be_shrunk = function (i, Gmax1, Gmax2, Gmax3, Gmax4) {
            if (((typeof i === 'number') || i === null) && ((typeof Gmax1 === 'number') || Gmax1 === null) && ((typeof Gmax2 === 'number') || Gmax2 === null) && ((typeof Gmax3 === 'number') || Gmax3 === null) && ((typeof Gmax4 === 'number') || Gmax4 === null)) {
                return this.be_shrunk$int$double$double$double$double(i, Gmax1, Gmax2, Gmax3, Gmax4);
            }
            else if (((typeof i === 'number') || i === null) && ((typeof Gmax1 === 'number') || Gmax1 === null) && ((typeof Gmax2 === 'number') || Gmax2 === null) && Gmax3 === undefined && Gmax4 === undefined) {
                return this.be_shrunk$int$double$double(i, Gmax1, Gmax2);
            }
            else
                throw new Error('invalid overload');
        };
        Solver_NU.prototype.do_shrinking = function () {
            let Gmax1 = -libsvm.Solver.INF_$LI$();
            let Gmax2 = -libsvm.Solver.INF_$LI$();
            let Gmax3 = -libsvm.Solver.INF_$LI$();
            let Gmax4 = -libsvm.Solver.INF_$LI$();
            let i;
            for (i = 0; i < this.active_size; i++) {
                if (!this.is_upper_bound(i)) {
                    if (this.y[i] === +1) {
                        if (-this.G[i] > Gmax1)
                            Gmax1 = -this.G[i];
                    }
                    else if (-this.G[i] > Gmax4)
                        Gmax4 = -this.G[i];
                }
                if (!this.is_lower_bound(i)) {
                    if (this.y[i] === +1) {
                        if (this.G[i] > Gmax2)
                            Gmax2 = this.G[i];
                    }
                    else if (this.G[i] > Gmax3)
                        Gmax3 = this.G[i];
                }
            }
            ;
            if (this.unshrink === false && Math.max(Gmax1 + Gmax2, Gmax3 + Gmax4) <= this.eps * 10) {
                this.unshrink = true;
                this.reconstruct_gradient();
                this.active_size = this.l;
            }
            for (i = 0; i < this.active_size; i++)
                if (this.be_shrunk$int$double$double$double$double(i, Gmax1, Gmax2, Gmax3, Gmax4)) {
                    this.active_size--;
                    while ((this.active_size > i)) {
                        if (!this.be_shrunk$int$double$double$double$double(this.active_size, Gmax1, Gmax2, Gmax3, Gmax4)) {
                            this.swap_index(i, this.active_size);
                            break;
                        }
                        this.active_size--;
                    }
                    ;
                }
            ;
        };
        Solver_NU.prototype.calculate_rho = function () {
            let nr_free1 = 0;
            let nr_free2 = 0;
            let ub1 = libsvm.Solver.INF_$LI$();
            let ub2 = libsvm.Solver.INF_$LI$();
            let lb1 = -libsvm.Solver.INF_$LI$();
            let lb2 = -libsvm.Solver.INF_$LI$();
            let sum_free1 = 0;
            let sum_free2 = 0;
            for (let i = 0; i < this.active_size; i++) {
                if (this.y[i] === +1) {
                    if (this.is_lower_bound(i))
                        ub1 = Math.min(ub1, this.G[i]);
                    else if (this.is_upper_bound(i))
                        lb1 = Math.max(lb1, this.G[i]);
                    else {
                        ++nr_free1;
                        sum_free1 += this.G[i];
                    }
                }
                else {
                    if (this.is_lower_bound(i))
                        ub2 = Math.min(ub2, this.G[i]);
                    else if (this.is_upper_bound(i))
                        lb2 = Math.max(lb2, this.G[i]);
                    else {
                        ++nr_free2;
                        sum_free2 += this.G[i];
                    }
                }
            }
            ;
            let r1;
            let r2;
            if (nr_free1 > 0)
                r1 = sum_free1 / nr_free1;
            else
                r1 = (ub1 + lb1) / 2;
            if (nr_free2 > 0)
                r2 = sum_free2 / nr_free2;
            else
                r2 = (ub2 + lb2) / 2;
            this.si.r = (r1 + r2) / 2;
            return (r1 - r2) / 2;
        };
        return Solver_NU;
    }(libsvm.Solver));
    libsvm.Solver_NU = Solver_NU;
    Solver_NU["__class"] = "libsvm.Solver_NU";
    let SVC_Q = (function (_super) {
        __extends(SVC_Q, _super);
        function SVC_Q(prob, param, y_) {
            let _this = _super.call(this, prob.l, prob.x, param) || this;
            _this.y = null;
            _this.cache = null;
            _this.QD = null;
            _this.y = y_.slice(0);
            _this.cache = new libsvm.Cache(prob.l, Math.floor((param.cache_size * (1 << 20))));
            _this.QD = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(prob.l);
            for (let i = 0; i < prob.l; i++)
                _this.QD[i] = _this.kernel_function(i, i);
            return _this;
        }
        SVC_Q.prototype.get_Q = function (i, len) {
            let data = new Array(1);
            let start;
            let j;
            if ((start = this.cache.get_data(i, data, len)) < len) {
                for (j = start; j < len; j++)
                    data[0][j] = (this.y[i] * this.y[j] * this.kernel_function(i, j));
            }
            return data[0];
        };
        SVC_Q.prototype.get_QD = function () {
            return this.QD;
        };
        SVC_Q.prototype.swap_index = function (i, j) {
            this.cache.swap_index(i, j);
            _super.prototype.swap_index.call(this, i, j);
            do {
                let tmp = this.y[i];
                this.y[i] = this.y[j];
                this.y[j] = tmp;
            } while ((false));
            do {
                let tmp = this.QD[i];
                this.QD[i] = this.QD[j];
                this.QD[j] = tmp;
            } while ((false));
        };
        return SVC_Q;
    }(libsvm.Kernel));
    libsvm.SVC_Q = SVC_Q;
    SVC_Q["__class"] = "libsvm.SVC_Q";
    let ONE_CLASS_Q = (function (_super) {
        __extends(ONE_CLASS_Q, _super);
        function ONE_CLASS_Q(prob, param) {
            let _this = _super.call(this, prob.l, prob.x, param) || this;
            _this.cache = null;
            _this.QD = null;
            _this.cache = new libsvm.Cache(prob.l, Math.floor((param.cache_size * (1 << 20))));
            _this.QD = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(prob.l);
            for (let i = 0; i < prob.l; i++)
                _this.QD[i] = _this.kernel_function(i, i);
            return _this;
        }
        ONE_CLASS_Q.prototype.get_Q = function (i, len) {
            let data = new Array(1);
            let start;
            let j;
            if ((start = this.cache.get_data(i, data, len)) < len) {
                for (j = start; j < len; j++)
                    data[0][j] = this.kernel_function(i, j);
            }
            return data[0];
        };
        ONE_CLASS_Q.prototype.get_QD = function () {
            return this.QD;
        };
        ONE_CLASS_Q.prototype.swap_index = function (i, j) {
            this.cache.swap_index(i, j);
            _super.prototype.swap_index.call(this, i, j);
            do {
                let tmp = this.QD[i];
                this.QD[i] = this.QD[j];
                this.QD[j] = tmp;
            } while ((false));
        };
        return ONE_CLASS_Q;
    }(libsvm.Kernel));
    libsvm.ONE_CLASS_Q = ONE_CLASS_Q;
    ONE_CLASS_Q["__class"] = "libsvm.ONE_CLASS_Q";
    let SVR_Q = (function (_super) {
        __extends(SVR_Q, _super);
        function SVR_Q(prob, param) {
            let _this = _super.call(this, prob.l, prob.x, param) || this;
            _this.l = 0;
            _this.cache = null;
            _this.sign = null;
            _this.index = null;
            _this.next_buffer = 0;
            _this.buffer = null;
            _this.QD = null;
            _this.l = prob.l;
            _this.cache = new libsvm.Cache(_this.l, Math.floor((param.cache_size * (1 << 20))));
            _this.QD = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * _this.l);
            _this.sign = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * _this.l);
            _this.index = (function (s) {
                let a = []; while (s-- > 0)
                    a.push(0); return a;
            })(2 * _this.l);
            for (let k = 0; k < _this.l; k++) {
                _this.sign[k] = 1;
                _this.sign[k + _this.l] = -1;
                _this.index[k] = k;
                _this.index[k + _this.l] = k;
                _this.QD[k] = _this.kernel_function(k, k);
                _this.QD[k + _this.l] = _this.QD[k];
            }
            ;
            _this.buffer = (function (dims) {
                let allocate = function (dims) {
                    if (dims.length == 0) {
                        return 0;
                    }
                    else {
                        let array = [];
                        for (let i = 0; i < dims[0]; i++) {
                            array.push(allocate(dims.slice(1)));
                        }
                        return array;
                    }
                }; return allocate(dims);
            })([2, 2 * _this.l]);
            _this.next_buffer = 0;
            return _this;
        }
        SVR_Q.prototype.swap_index = function (i, j) {
            do {
                let tmp = this.sign[i];
                this.sign[i] = this.sign[j];
                this.sign[j] = tmp;
            } while ((false));
            do {
                let tmp = this.index[i];
                this.index[i] = this.index[j];
                this.index[j] = tmp;
            } while ((false));
            do {
                let tmp = this.QD[i];
                this.QD[i] = this.QD[j];
                this.QD[j] = tmp;
            } while ((false));
        };
        SVR_Q.prototype.get_Q = function (i, len) {
            let data = new Array(1);
            let j;
            let real_i = this.index[i];
            if (this.cache.get_data(real_i, data, this.l) < this.l) {
                for (j = 0; j < this.l; j++)
                    data[0][j] = this.kernel_function(real_i, j);
            }
            let buf = this.buffer[this.next_buffer];
            this.next_buffer = 1 - this.next_buffer;
            let si = this.sign[i];
            for (j = 0; j < len; j++)
                buf[j] = si * this.sign[j] * data[0][this.index[j]];
            return buf;
        };
        SVR_Q.prototype.get_QD = function () {
            return this.QD;
        };
        return SVR_Q;
    }(libsvm.Kernel));
    libsvm.SVR_Q = SVR_Q;
    SVR_Q["__class"] = "libsvm.SVR_Q";
})(libsvm || (libsvm = {}));
libsvm.svm.kernel_type_table_$LI$();
libsvm.svm.svm_type_table_$LI$();
libsvm.svm.rand_$LI$();
libsvm.Solver.INF_$LI$();
