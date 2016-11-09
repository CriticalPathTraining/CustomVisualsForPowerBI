/*
*  Sparkline Visual
*
*  Copyright (c) Prologika, LLC
*  http://www.prologika.com
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.

Description
A sparkline is a small embedded line graph for showing a trend usually over time. Configure the sparkline go group data by a
single category field, such as CalendarYear, and a single measure, such as SalesAmount. You can configure the line color, width, and even animate the graph.

To use the sparkline:
1. Download from the Power BI Visuals Gallery.
2. Import it in Power BI or Power BI Desktop and add it to the report from the Visualizations pane.
3. Add a single grouping field in the Category area and a single measure in the Value area. The sparkline should show a graph.
4. You can change formatting options in the Format of the Visualizations pane, including the line color, width,
   and animation options if you want the graph to animate.

The sparkline implementation is fully described in the book "Applied Power BI" by Teo Lachev.
*/
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var Sparkline1444636326814;
        (function (Sparkline1444636326814) {
            var SelectionManager = visuals.utility.SelectionManager;
            var Sparkline = (function () {
                function Sparkline() {
                }
                // Converter to convert Power BI model to an custom visual model 
                Sparkline.converter = function (dataView) {
                    if (!dataView) {
                        return;
                    }
                    if (!Sparkline.isDataViewValid(dataView)) {
                        return;
                    }
                    var categoryValuesLen = 0;
                    var dataViewCategorical = dataView.categorical;
                    var categories = dataViewCategorical.categories[0]; // get to categories
                    var values = dataViewCategorical.values && dataViewCategorical.values[0].values; // get to measures
                    var categoryValues = categories && categories.values;
                    var categoryValuesLen = categoryValues && categoryValues.length;
                    var tooltipString = "";
                    var formatter = visuals.valueFormatter.create({ format: dataViewCategorical.values[0].source.format, value: 0 });
                    for (var i = 0; i < values.length; i++) {
                        tooltipString += formatter.format(values[i]) + " ";
                    }
                    var viewModel = {
                        color: Sparkline.getFill(dataView).solid.color,
                        size: Sparkline.getSize(dataView),
                        data: values,
                        animate: Sparkline.getAnimate(dataView),
                        duration: Sparkline.getDuration(dataView),
                        delay: Sparkline.getDelay(dataView),
                        selector: visuals.SelectionId.createNull(),
                        toolTipInfo: [{
                            displayName: dataViewCategorical.values[0].source.displayName,
                            value: tooltipString
                        }]
                    };
                    return viewModel;
                };
                // validates data view to ensure we have one group and one measure
                Sparkline.isDataViewValid = function (dataView) {
                    if (dataView && dataView.categorical && dataView.categorical.categories && dataView.metadata && dataView.categorical.categories[0] && dataView.categorical.values) {
                        return true;
                    }
                    return false;
                };
                Sparkline.prototype.init = function (options) {
                    this.selectionManager = new SelectionManager({ hostServices: options.host });
                    this.root = d3.select(options.element.get(0));
                    this.svg = this.root.append('svg').classed('sparkline', true).attr('height', options.viewport.height).attr('width', options.viewport.width);
                };
                // Update method where the visual draw actually happens
                Sparkline.prototype.update = function (options) {
                    this.svg.selectAll("path").remove(); // clear existing line
                    if (!options.dataViews || !options.dataViews[0])
                        return;
                    var dataView = this.dataView = options.dataViews[0];
                    var viewport = options.viewport;
                    var viewModel = Sparkline.converter(dataView);
                    if (!viewModel)
                        return;
                    if (viewport.height < 0 || viewport.width < 0)
                        return;
                    var graph = this.svg;
                    // stop animation if graph is animating for update changes to take effect
                    this.stopAnimation();
                    // resize draw area to fit visualization frame
                    this.svg.attr({
                        'height': viewport.height,
                        'width': viewport.width
                    });
                    var data = viewModel.data;
                    // X scale fits values for all data elements; domain property will scale the graph width
                    var x = d3.scale.linear().domain([0, data.length - 1]).range([0, viewport.width]);
                    // Y scale will fit values from min to max calibrated to the graph higth
                    var y = d3.scale.linear().domain([Math.min.apply(Math, data), Math.max.apply(Math, data)]).range([0, viewport.height]);
                    // create a line
                    var line = d3.svg.line().interpolate("basis").x(function (d, i) {
                        // enable the next line when debugging to output X coordinate
                        // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using xScale.');
                        return x(i);
                    }).y(function (d) {
                        // enable the next line when debugging to output X coordinate
                        // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using yScale.");
                        return viewport.height - y(d); // values are plotted from the top so reverse the scale
                    });
                    // display the line by appending an svg:path element with the data line we created above
                    var path = this.svg.append("svg:path").attr("d", line(data)).attr('stroke-width', function (d) {
                        return viewModel.size;
                    }).attr('stroke', function (d) {
                        return viewModel.color;
                    });
                    // the animation function
                    function redrawWithAnimation() {
                        var totalLength = path.node().getTotalLength();
                        graph.selectAll("path").data([data]).attr("d", line).attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).transition().duration(viewModel.duration).ease("linear").attr("stroke-dashoffset", 0);
                    }
                    if (viewModel.animate) {
                        this.timer = setInterval(function () {
                            redrawWithAnimation();
                        }, viewModel.delay);
                    }
                    visuals.TooltipManager.addTooltip(this.svg, function (tooltipEvent) { return viewModel.toolTipInfo; });
                };
                Sparkline.prototype.stopAnimation = function () {
                    if (this.timer) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                };
                // Begin helper methods to extract properties         
                Sparkline.getFill = function (dataView) {
                    if (dataView) {
                        var objects = dataView.metadata.objects;
                        if (objects) {
                            var general = objects['general'];
                            if (general) {
                                var fill = general['fill'];
                                if (fill)
                                    return fill;
                            }
                        }
                    }
                    return { solid: { color: Sparkline.DefaultFontColor } };
                };
                Sparkline.getSize = function (dataView) {
                    if (dataView) {
                        var objects = dataView.metadata.objects;
                        if (objects) {
                            var general = objects['general'];
                            if (general) {
                                var size = general['size'];
                                if (size)
                                    return size;
                            }
                        }
                    }
                    return Sparkline.DefaultSize;
                };
                Sparkline.getAnimate = function (dataView) {
                    if (dataView) {
                        var objects = dataView.metadata.objects;
                        if (objects) {
                            var labels = objects['labels'];
                            if (labels) {
                                var animate = labels['show'];
                                if (animate)
                                    return animate;
                            }
                        }
                    }
                    return Sparkline.DefaultAnimate;
                };
                Sparkline.getDuration = function (dataView) {
                    if (dataView) {
                        var objects = dataView.metadata.objects;
                        if (objects) {
                            var labels = objects['labels'];
                            if (labels) {
                                var duration = labels['duration'];
                                if (duration)
                                    return duration;
                            }
                        }
                    }
                    return Sparkline.DefaultDuration;
                };
                Sparkline.getDelay = function (dataView) {
                    if (dataView) {
                        var objects = dataView.metadata.objects;
                        if (objects) {
                            var labels = objects['labels'];
                            if (labels) {
                                var delay = labels['delay'];
                                if (delay)
                                    return delay;
                            }
                        }
                    }
                    return Sparkline.DefaulDelay;
                };
                // End helper methods to extract properties 
                // Enumerate properties; note that a property won't display unless it's enumerated
                Sparkline.prototype.enumerateObjectInstances = function (options) {
                    var instances = [];
                    var dataView = this.dataView;
                    switch (options.objectName) {
                        case 'general':
                            var general = {
                                objectName: 'general',
                                displayName: 'General',
                                selector: null,
                                properties: {
                                    fill: Sparkline.getFill(dataView),
                                    size: Sparkline.getSize(dataView),
                                }
                            };
                            instances.push(general);
                            break;
                        case 'labels':
                            var labels = {
                                objectName: 'labels',
                                displayName: 'Animation',
                                selector: null,
                                properties: {
                                    show: Sparkline.getAnimate(dataView),
                                    duration: Sparkline.getDuration(dataView),
                                    delay: Sparkline.getDelay(dataView)
                                }
                            };
                            instances.push(labels);
                            break;
                    }
                    return instances;
                };
                Sparkline.prototype.destroy = function () {
                    this.svg = null;
                    this.root = null;
                    this.timer = null;
                };
                Sparkline.DefaultFontColor = '#4682b4';
                Sparkline.DefaultSize = 1;
                Sparkline.DefaultAnimate = false;
                Sparkline.DefaultDuration = 1000;
                Sparkline.DefaulDelay = 3000;
                // Advertise visual capabilities        
                Sparkline.capabilities = {
                    dataRoles: [
                        {
                            name: 'Category',
                            kind: powerbi.VisualDataRoleKind.Grouping,
                            displayName: 'Category',
                        },
                        {
                            name: 'Value',
                            kind: powerbi.VisualDataRoleKind.Measure,
                            displayName: 'Value',
                        },
                    ],
                    dataViewMappings: [{
                        conditions: [
                            {
                                'Category': { max: 1 },
                                'Value': { max: 1 }
                            },
                        ],
                        categorical: {
                            categories: {
                                for: { in: 'Category' },
                                dataReductionAlgorithm: { bottom: { count: 100 } }
                            },
                            values: {
                                group: {
                                    by: "Series",
                                    select: [{ bind: { to: 'Value' } }]
                                }
                            },
                        },
                    }],
                    objects: {
                        general: {
                            displayName: powerbi.data.createDisplayNameGetter('Visual_General'),
                            properties: {
                                fill: {
                                    type: { fill: { solid: { color: true } } },
                                    displayName: 'Color'
                                },
                                size: {
                                    type: { numeric: true },
                                    displayName: 'Size'
                                },
                            },
                        },
                        labels: {
                            displayName: 'Animation',
                            properties: {
                                show: {
                                    type: { bool: true },
                                    displayName: powerbi.data.createDisplayNameGetter('Visual_Show')
                                },
                                delay: {
                                    type: { numeric: true },
                                    displayName: 'Delay'
                                },
                                duration: {
                                    type: { numeric: true },
                                    displayName: 'Duration'
                                }
                            }
                        }
                    }
                };
                return Sparkline;
            })();
            Sparkline1444636326814.Sparkline = Sparkline;
        })(Sparkline1444636326814 = visuals.Sparkline1444636326814 || (visuals.Sparkline1444636326814 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.Sparkline1444636326814 = {
                name: 'Sparkline1444636326814',
                class: 'Sparkline1444636326814',
                capabilities: powerbi.visuals.Sparkline1444636326814.Sparkline.capabilities,
                custom: true,
                create: function () { return new powerbi.visuals.Sparkline1444636326814.Sparkline(); }
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
