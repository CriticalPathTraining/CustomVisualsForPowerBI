var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B;
            (function (PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B) {
                var Visual = (function () {
                    function Visual(options) {
                        this.target = options.element;
                    }
                    Visual.prototype.update = function (options) {
                        console.log('Visual update', options);
                        this.target.innerHTML =
                            "<table id=\"myTable\">\n                <tr><td>Width:</td><td>" + options.viewport.width.toFixed(0) + "</td></tr>\n                <tr><td>Height:</td><td>" + options.viewport.height.toFixed(0) + "</td></tr>\n              </table>";
                    };
                    return Visual;
                }());
                PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B.Visual = Visual;
            })(PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B = visual.PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B || (visual.PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B_DEBUG = {
                name: 'PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B_DEBUG',
                displayName: 'viz01',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.5.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_46875942_DDAD_4AE8_9E1D_5F2E68779F1B.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map