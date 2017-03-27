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
                        this.svg = d3.select(options.element).append('svg');
                        this.svgGroupMain = this.svg.append('g');
                        this.enableAxis = false;
                    }
                    Visual.prototype.update = function (options) {
                        // ensure that categorical dataview contains categories and measurable values 
                        var categorical = options.dataViews[0].categorical;
                        if (typeof categorical.categories === "undefined" || typeof categorical.values === "undefined") {
                            // remove all existing SVG elements 
                            this.svgGroupMain.selectAll("g").remove();
                            return;
                        }
                        this.dataView = options.dataViews[0];
                        // get height and width from viewport
                        this.svg.attr({
                            height: options.viewport.height,
                            width: options.viewport.width
                        });
                        var paddingSVG = 12;
                        var xAxisOffset = 50;
                        var yAxisOffset = 24;
                        var plot = {
                            xOffset: paddingSVG + xAxisOffset,
                            yOffset: paddingSVG,
                            width: options.viewport.width - (paddingSVG * 2) - xAxisOffset,
                            height: options.viewport.height - (paddingSVG * 2) - yAxisOffset,
                        };
                        this.svgGroupMain.attr({
                            height: plot.height,
                            width: plot.width,
                            transform: 'translate(' + plot.xOffset + ',' + plot.yOffset + ')'
                        });
                        // convert data format
                        var dataResult = Visual.converter(options.dataViews[0].categorical);
                        // setup d3 scale
                        var xScale = d3.scale.ordinal()
                            .domain(dataResult.map(function (d) { return d.Category; }))
                            .rangeRoundBands([0, plot.width], 0.1);
                        var yMax = d3.max(dataResult, function (d) { return d.Value * 1.05; });
                        var yScale = d3.scale.linear()
                            .domain([0, yMax])
                            .range([plot.height, 0]);
                        // remove existing SVG elements from previous update
                        this.svg.selectAll('.axis').remove();
                        this.svg.selectAll('.bar').remove();
                        // draw x axis
                        var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient('bottom');
                        this.svgGroupMain
                            .append('g')
                            .attr('class', 'x axis')
                            .style('fill', 'black')
                            .attr('transform', 'translate(0,' + (plot.height) + ')')
                            .call(xAxis);
                        // draw y axis
                        var formatValue = d3.format(".2s");
                        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient('left')
                            .tickFormat(function (d) { return formatValue(d); });
                        this.svgGroupMain
                            .append('g')
                            .attr('class', 'y axis')
                            .style('fill', 'black') // you can get from metadata
                            .call(yAxis);
                        // draw bar
                        var svgGroupBars = this.svgGroupMain
                            .append('g')
                            .selectAll('.bar')
                            .data(dataResult);
                        svgGroupBars.enter()
                            .append('rect')
                            .attr('class', 'bar')
                            .attr('fill', Visual.getFill(this.dataView).solid.color)
                            .attr('stroke', 'black')
                            .attr('x', function (d) {
                            return xScale(d.Category);
                        })
                            .attr('width', xScale.rangeBand())
                            .attr('y', function (d) {
                            return yScale(d.Value);
                        })
                            .attr('height', function (d) {
                            return plot.height - yScale(d.Value);
                        });
                        svgGroupBars
                            .exit()
                            .remove();
                    };
                    Visual.getFill = function (dataView) {
                        if (dataView) {
                            var objects = dataView.metadata.objects;
                            if (objects) {
                                var object = objects['colorSelector'];
                                if (object) {
                                    var fill = object['fill'];
                                    if (fill)
                                        console.log(JSON.stringify(fill));
                                    return fill;
                                }
                            }
                        }
                        return { solid: { color: "teal" } };
                    };
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'colorSelector':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        fill: Visual.getFill(this.dataView)
                                    },
                                    selector: null
                                });
                                break;
                        }
                        ;
                        return objectEnumeration;
                    };
                    Visual.converter = function (cat) {
                        var resultData = [];
                        for (var i = 0; i < cat.categories[0].values.length; i++) {
                            resultData.push({ Category: cat.categories[0].values[i], Value: cat.values[0].values[i] });
                        }
                        resultData.sort(function (x, y) { return y.Value - x.Value; });
                        return resultData;
                    };
                    Visual.prototype.destroy = function () { };
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
            plugins.PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96 = {
                name: 'PBI_CV_8DD8014C_2A2B_4017_9C8E_8FD194F9DF96',
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