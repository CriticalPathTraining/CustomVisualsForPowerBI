var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA;
            (function (PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA) {
                var Visual = (function () {
                    function Visual(options) {
                        this.padding = 20;
                        this.svg = d3.select(options.element).append("svg")
                            .attr("x", 0)
                            .attr("y", 0);
                        this.ellipse = this.svg.append("ellipse")
                            .style("fill", "rgba(255, 255, 0, 0.5)")
                            .style("stroke", "rgba(0, 0, 0, 1.0)")
                            .style("stroke-width", "4");
                        this.text = this.svg.append("text")
                            .text("Hello Custom Visuals")
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "central")
                            .style("fill", "rgba(255, 0, 0, 1.0)")
                            .style("stroke", "rgba(0, 0, 0, 1.0)")
                            .style("stroke-width", "2");
                    }
                    Visual.prototype.update = function (options) {
                        var viewport = {
                            width: options.viewport.width - this.padding,
                            height: options.viewport.height - this.padding
                        };
                        this.svg
                            .attr("width", options.viewport.width)
                            .attr("height", options.viewport.height);
                        var plot = {
                            xOffset: this.padding,
                            yOffset: this.padding,
                            width: options.viewport.width - (this.padding * 2),
                            height: options.viewport.height - (this.padding * 2),
                        };
                        this.ellipse
                            .attr("cx", plot.xOffset + (plot.width / 2))
                            .attr("cy", plot.yOffset + (plot.height / 2))
                            .attr("rx", plot.width * 0.5)
                            .attr("ry", plot.height * 0.5);
                        var fontSizeForWidth = plot.width * .08;
                        var fontSizeForHeight = plot.height * .25;
                        var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);
                        this.text
                            .attr("x", plot.xOffset + (plot.width / 2))
                            .attr("y", plot.yOffset + (plot.height / 1.75))
                            .attr("width", plot.width)
                            .attr("height", plot.height)
                            .attr("font-size", fontSize);
                    };
                    return Visual;
                }());
                PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA.Visual = Visual;
            })(PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA = visual.PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA || (visual.PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA_DEBUG = {
                name: 'PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA_DEBUG',
                displayName: 'MyFirstProject',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.1.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_B6D2EE92_5ECF_4BB5_B1F3_3F62E93221CA.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map