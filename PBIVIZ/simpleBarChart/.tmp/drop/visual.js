var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96;
            (function (PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96) {
                var Visual = (function () {
                    function Visual(options) {
                        this.margin = { top: 20, right: 20, bottom: 200, left: 70 };
                        console.log("constructor");
                        this.svg = d3.select(options.element).append('svg');
                        this.g = this.svg.append('g');
                        this.myVisualProp = false;
                    }
                    Visual.prototype.update = function (options) {
                        console.log("update execuring...");
                        var categorical = options.dataViews[0].categorical;
                        console.log(JSON.stringify(categorical));
                        if (typeof categorical.categories === "undefined" || typeof categorical.values === "undefined") {
                            console.log("abc");
                            this.g.selectAll("g").remove();
                            console.log("xyz");
                            return;
                        }
                        //this.myVisualProp = options.dataViews[0].metadata.objects["myCustomObj"]["myprop"];
                        // "this" changes inside nested functions
                        // create outerThis variable to use inside nested functions
                        var outerThis = this;
                        // get height and width from viewport
                        this.svg.attr({
                            height: options.viewport.height,
                            width: options.viewport.width });
                        var gHeight = options.viewport.height - outerThis.margin.top - outerThis.margin.bottom;
                        var gWidth = options.viewport.width - outerThis.margin.right - outerThis.margin.left;
                        this.g.attr({ height: gHeight, width: gWidth });
                        this.g.attr('transform', 'translate(' + outerThis.margin.left + ',' + outerThis.margin.top + ')');
                        // convert data format
                        var dataResult = Visual.converter(options.dataViews[0].categorical);
                        // setup d3 scale
                        var xScale = d3.scale.ordinal()
                            .domain(dataResult.map(function (d) { return d.Category; }))
                            .rangeRoundBands([0, gWidth], 0.1);
                        var yMax = d3.max(dataResult, function (d) { return d.Value + 10; });
                        var yScale = d3.scale.linear()
                            .domain([0, yMax])
                            .range([gHeight, 0]);
                        // remove exsisting axis and bar
                        this.svg.selectAll('.axis').remove();
                        this.svg.selectAll('.bar').remove();
                        // draw x axis
                        var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient('bottom');
                        this.g
                            .append('g')
                            .attr('class', 'x axis')
                            .style('fill', 'black') // you can get from metadata
                            .attr('transform', 'translate(0,' + (gHeight - 1) + ')')
                            .call(xAxis)
                            .selectAll('text') // rotate text
                            .style('text-anchor', 'end')
                            .attr('dx', '-.8em')
                            .attr('dy', '-.6em')
                            .attr('transform', 'rotate(-90)');
                        // draw y axis
                        var formatValue = d3.format(".2s");
                        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient('left')
                            .tickFormat(function (d) { return formatValue(d); });
                        this.g
                            .append('g')
                            .attr('class', 'y axis')
                            .style('fill', 'black') // you can get from metadata
                            .call(yAxis);
                        // draw bar
                        var shapes = this.g
                            .append('g')
                            .selectAll('.bar')
                            .data(dataResult);
                        shapes.enter()
                            .append('rect')
                            .attr('class', 'bar')
                            .attr('fill', 'green')
                            .attr('stroke', 'black')
                            .attr('x', function (d) {
                            return xScale(d.Category);
                        })
                            .attr('width', xScale.rangeBand())
                            .attr('y', function (d) {
                            return yScale(d.Value);
                        })
                            .attr('height', function (d) {
                            return gHeight - yScale(d.Value);
                        });
                        shapes
                            .exit()
                            .remove();
                    };
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        console.log("enumerateObjectInstances");
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'enableAxis':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        show: true,
                                    },
                                    selector: null
                                });
                                break;
                        }
                        ;
                        return objectEnumeration;
                    };
                    Visual.prototype.destroy = function () { };
                    Visual.converter = function (cat) {
                        var resultData = [];
                        for (var i = 0; i < cat.categories[0].values.length; i++) {
                            resultData.push({ Category: cat.categories[0].values[i], Value: cat.values[0].values[i] });
                        }
                        resultData.sort(function (x, y) { return y.Value - x.Value; });
                        return resultData;
                    };
                    return Visual;
                }());
                PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96.Visual = Visual;
            })(PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96 = visual.PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96 || (visual.PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96_DEBUG = {
                name: 'PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96_DEBUG',
                displayName: 'Simple Bar Chart',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.1.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map