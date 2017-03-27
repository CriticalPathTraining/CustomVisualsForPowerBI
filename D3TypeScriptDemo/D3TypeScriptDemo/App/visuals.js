var myApp;
(function (myApp) {
    var Viz01 = (function () {
        function Viz01() {
            this.name = "Visual 1: Hello jQuery";
        }
        Viz01.prototype.load = function (container) {
            this.container = $(container);
            this.message = $("<div>")
                .text("Hello jQuery")
                .css({
                "display": "table-cell",
                "text-align": "center",
                "vertical-align": "middle",
                "text-wrap": "none",
                "background-color": "yellow"
            });
            this.container.append(this.message);
        };
        Viz01.prototype.update = function (viewport) {
            var paddingX = 2;
            var paddingY = 2;
            var fontSizeMultiplierX = viewport.width * 0.15;
            var fontSizeMultiplierY = viewport.height * 0.4;
            var fontSizeMultiplier = Math.min.apply(Math, [fontSizeMultiplierX, fontSizeMultiplierY]);
            this.message.css({
                "width": viewport.width - paddingX,
                "height": viewport.height - paddingY,
                "font-size": fontSizeMultiplier
            });
        };
        return Viz01;
    }());
    myApp.Viz01 = Viz01;
    var Viz02 = (function () {
        function Viz02() {
            this.name = "Visual 2: Hello D3";
            this.padding = 20;
        }
        Viz02.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.ellipse = this.svgRoot.append("ellipse")
                .style("fill", "rgba(255, 255, 0, 0.5)")
                .style("stroke", "rgba(0, 0, 0, 1.0)")
                .style("stroke-width", "4");
            this.text = this.svgRoot.append("text")
                .text("Hello D3")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("fill", "rgba(255, 0, 0, 1.0)")
                .style("stroke", "rgba(0, 0, 0, 1.0)")
                .style("stroke-width", "2");
        };
        Viz02.prototype.update = function (viewport) {
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding,
                yOffset: this.padding,
                width: viewport.width - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            this.ellipse
                .attr("cx", plot.xOffset + (plot.width * 0.5))
                .attr("cy", plot.yOffset + (plot.height * 0.5))
                .attr("rx", (plot.width * 0.5))
                .attr("ry", (plot.height * 0.5));
            var fontSizeForWidth = plot.width * .20;
            var fontSizeForHeight = plot.height * .35;
            var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);
            this.text
                .attr("x", plot.xOffset + (plot.width * 0.5))
                .attr("y", plot.yOffset + (plot.height * 0.5))
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("font-size", fontSize);
        };
        return Viz02;
    }());
    myApp.Viz02 = Viz02;
    var Viz03 = (function () {
        function Viz03() {
            this.name = "Visual 3 - Simple Bar Chart";
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
            this.padding = 12;
        }
        Viz03.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.bars = this.svgRoot
                .selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect");
        };
        Viz03.prototype.update = function (viewport) {
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding,
                yOffset: this.padding,
                width: viewport.width - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            var barWidth = (plot.width / datasetSize) * 0.92;
            this.bars
                .attr("x", function (d, i) {
                return plot.xOffset + (i * (xScaleFactor));
            })
                .attr("y", function (d, i) {
                return plot.yOffset + plot.height - (Number(d) * yScaleFactor);
            })
                .attr("width", function (d, i) {
                return barWidth;
            })
                .attr("height", function (d, i) {
                return (Number(d) * yScaleFactor);
            })
                .attr("fill", "teal");
        };
        return Viz03;
    }());
    myApp.Viz03 = Viz03;
    var Viz04 = (function () {
        function Viz04() {
            this.name = "Visual 4 - Bar Chart Labels";
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
            this.padding = 12;
        }
        Viz04.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.bars = this.svgRoot
                .selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect");
            this.labels = d3.select("svg").selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text");
        };
        Viz04.prototype.update = function (viewport) {
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding,
                yOffset: this.padding,
                width: viewport.width - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            var barWidth = (plot.width / datasetSize) * 0.92;
            this.bars
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - (Number(d) * yScaleFactor); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (Number(d) * yScaleFactor); })
                .attr("fill", "teal");
            var yTextOffset = (d3.min(this.dataset) * yScaleFactor) * 0.2;
            var textSize = (barWidth * 0.3) + "px";
            this.labels.text(function (d, i) { return "$" + d; })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
        };
        return Viz04;
    }());
    myApp.Viz04 = Viz04;
    var Viz05 = (function () {
        function Viz05() {
            this.name = "Visual 5 - Adding a Y Axis";
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
            this.padding = 12;
            this.xAxisOffset = 50;
        }
        Viz05.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            this.bars = this.svgRoot.append("g")
                .selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect");
            this.labels = this.svgRoot
                .selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text");
            this.axisGroup = this.svgRoot.append("g");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
        };
        Viz05.prototype.update = function (viewport) {
            var _this = this;
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var yDomainStart = d3.max(this.dataset) * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var barXStart = (plot.width / datasetSize) * 0.05;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.bars
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal");
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            this.labels
                .text(function (d, i) { return "$" + d; })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz05;
    }());
    myApp.Viz05 = Viz05;
    var Viz06 = (function () {
        function Viz06() {
            this.name = "Visual 6 - Bar Hover Events";
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
            this.padding = 12;
            this.xAxisOffset = 50;
        }
        Viz06.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            this.bars = this.svgRoot.append("g")
                .selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect");
            this.labels = this.svgRoot
                .selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text");
            this.axisGroup = this.svgRoot.append("g");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
        };
        Viz06.prototype.update = function (viewport) {
            var _this = this;
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var yDomainStart = d3.max(this.dataset) * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var barXStart = (plot.width / datasetSize) * 0.05;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.bars
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal")
                .on("mouseover", function () { d3.select(this).attr("fill", "black"); })
                .on("mouseout", function () { d3.select(this).attr("fill", "teal"); });
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            this.labels
                .text(function (d, i) { return "$" + d; })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz06;
    }());
    myApp.Viz06 = Viz06;
    var Viz07 = (function () {
        function Viz07() {
            this.name = "Visual 7 - Animated Transitions";
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
            this.padding = 12;
            this.xAxisOffset = 50;
        }
        Viz07.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            this.bars = this.svgRoot.append("g")
                .selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect");
            this.labels = this.svgRoot
                .selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text");
            this.axisGroup = this.svgRoot.append("g");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
        };
        Viz07.prototype.update = function (viewport) {
            var _this = this;
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var yDomainStart = d3.max(this.dataset) * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var barXStart = (plot.width / datasetSize) * 0.05;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.bars
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal")
                .on("mouseover", function () { d3.select(this).attr("fill", "black"); })
                .on("mouseout", function () { d3.select(this).attr("fill", "teal"); })
                .on("click", function (d, i) {
                // get reference to current bar
                var currentBar = d3.select(this);
                // determine current bar Y position and height
                var currentY = parseInt(currentBar.attr("y"));
                var currentHeight = parseInt(currentBar.attr("height"));
                // transition bar to height of zero
                currentBar.transition().duration(1000)
                    .attr("y", currentY + (currentHeight))
                    .attr("height", 0)
                    .each("end", function () {
                    // transition bar back to previoys height
                    currentBar.transition().duration(500).delay(100)
                        .attr("y", currentY)
                        .attr("height", currentHeight);
                });
            });
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            this.labels
                .text(function (d, i) { return "$" + d; })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz07;
    }());
    myApp.Viz07 = Viz07;
    var Viz08 = (function () {
        function Viz08() {
            this.name = "Visual 8 - Async Data Load";
            this.padding = 12;
            this.xAxisOffset = 50;
        }
        Viz08.prototype.load = function (container) {
            var _this = this;
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            d3.csv("Data/data1.csv", function (data) {
                _this.dataset = data.map(function (x) { return Number(x.Data); });
                _this.bars = _this.svgRoot.append("g")
                    .selectAll("rect")
                    .data(_this.dataset)
                    .enter()
                    .append("rect");
                _this.labels = _this.svgRoot
                    .selectAll("text")
                    .data(_this.dataset)
                    .enter()
                    .append("text");
                _this.axisGroup = _this.svgRoot.append("g");
                _this.yScale = d3.scale.linear();
                _this.yAxis = d3.svg.axis();
                // trigger update process from host app
                myApp.updateUI();
            });
            console.log("here 2");
        };
        Viz08.prototype.update = function (viewport) {
            var _this = this;
            if (this.dataset === undefined) {
                return;
            }
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var yDomainStart = d3.max(this.dataset) * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var barXStart = (plot.width / datasetSize) * 0.05;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.bars
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal")
                .on("mouseover", function () { d3.select(this).attr("fill", "black"); })
                .on("mouseout", function () { d3.select(this).attr("fill", "teal"); })
                .on("click", function (d, i) {
                // get reference to current bar
                var currentBar = d3.select(this);
                // determine current bar Y position and height
                var currentY = parseInt(currentBar.attr("y"));
                var currentHeight = parseInt(currentBar.attr("height"));
                // transition bar to height of zero
                currentBar.transition().duration(1000)
                    .attr("y", currentY + (currentHeight))
                    .attr("height", 0)
                    .each("end", function () {
                    // transition bar back to previoys height
                    currentBar.transition().duration(500).delay(100)
                        .attr("y", currentY)
                        .attr("height", currentHeight);
                });
            });
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            this.labels
                .text(function (d, i) { return "$" + d; })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz08;
    }());
    myApp.Viz08 = Viz08;
    var Viz09 = (function () {
        function Viz09() {
            this.name = "Visual 9 - Scatter Chart";
            this.dataset = [
                [1, 440], [2, 350], [3, 290], [4, 240], [5, 430], [6, 240], [7, 270], [8, 340], [9, 420]
            ];
            this.padding = 12;
            this.xAxisOffset = 50;
            this.yAxisOffset = 50;
        }
        Viz09.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            this.yAxisGroup = this.svgRoot.append("g");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
            this.xAxisGroup = this.svgRoot.append("g");
            this.xScale = d3.scale.linear();
            this.xAxis = d3.svg.axis();
            this.dots = this.svgRoot.selectAll("circle")
                .data(this.dataset)
                .enter()
                .append("circle")
                .attr("r", 10)
                .style("fill", "red");
        };
        Viz09.prototype.update = function (viewport) {
            var _this = this;
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - this.yAxisOffset - (this.padding * 2),
            };
            var maxValueY = d3.max(this.dataset, function (value) { return value[1]; });
            var yDomainStart = maxValueY * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            var maxValueX = d3.max(this.dataset, function (value) { return value[0]; });
            var xDomainStart = 0;
            var xDomainStop = maxValueX * 1.05;
            var xRangeStart = 0;
            var xRangeStop = plot.width;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            this.xScale
                .domain([xDomainStart, xDomainStop])
                .range([xRangeStart, xRangeStop]);
            var datasetSize = this.dataset.length;
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.dots
                .attr("cx", function (d) {
                return (_this.xScale(d[0]) + _this.xAxisOffset);
            })
                .attr("cy", function (d) {
                return _this.yScale(d[1]);
            });
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.yAxisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
            this.xAxis.scale(this.xScale).orient('bottom').ticks(10);
            var transform = "translate(" + (this.padding + this.yAxisOffset) + "," + (plot.height + this.padding) + ")";
            this.xAxisGroup.attr("class", "axis").call(this.xAxis).attr({ 'transform': transform });
        };
        return Viz09;
    }());
    myApp.Viz09 = Viz09;
    var Viz10 = (function () {
        function Viz10() {
            this.name = "Visual 10 - Line Chart";
            this.dataset = [[0, 0], [0.5, 4], [1.0, 8], [1.6, 16], [2.1, 14], [3.0, 21]];
            this.padding = 12;
            this.xAxisOffset = 50;
            this.yAxisOffset = 50;
        }
        Viz10.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            this.yAxisGroup = this.svgRoot.append("g");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
            this.xAxisGroup = this.svgRoot.append("g");
            this.xScale = d3.scale.linear();
            this.xAxis = d3.svg.axis();
            this.line = d3.svg.line();
            this.path = this.svgRoot.append("path")
                .datum(this.dataset)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5);
        };
        Viz10.prototype.update = function (viewport) {
            var _this = this;
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - this.yAxisOffset - (this.padding * 2),
            };
            var maxValueY = d3.max(this.dataset, function (value) { return value[1]; });
            var yDomainStart = maxValueY * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            var maxValueX = d3.max(this.dataset, function (value) { return value[0]; });
            var xDomainStart = 0;
            var xDomainStop = maxValueX * 1.05;
            var xRangeStart = 0;
            var xRangeStop = plot.width;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            this.xScale
                .domain([xDomainStart, xDomainStop])
                .range([xRangeStart, xRangeStop]);
            var datasetSize = this.dataset.length;
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.yAxisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
            this.xAxis.scale(this.xScale).orient('bottom').ticks(10);
            var transform = "translate(" + (this.padding + this.yAxisOffset) + "," + (plot.height + this.padding) + ")";
            this.xAxisGroup.attr("class", "axis").call(this.xAxis).attr({ 'transform': transform });
            this.line
                .x(function (d, i) { return _this.padding + _this.xAxisOffset + _this.xScale(d[0]); })
                .y(function (d, i) { return _this.padding + _this.yScale(d[1]); });
            this.path.attr("d", this.line);
        };
        return Viz10;
    }());
    myApp.Viz10 = Viz10;
    var Viz11 = (function () {
        function Viz11() {
            this.name = "Visual 11 - Area Chart";
            this.dataset = [[0, 0], [0.5, 4], [1.0, 8], [1.6, 16], [2.1, 14], [3.0, 21]];
            this.padding = 12;
            this.xAxisOffset = 50;
            this.yAxisOffset = 50;
        }
        Viz11.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.plotArea = this.svgRoot.append("rect")
                .attr("fill", "lightyellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            this.yAxisGroup = this.svgRoot.append("g");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
            this.xAxisGroup = this.svgRoot.append("g");
            this.xScale = d3.scale.linear();
            this.xAxis = d3.svg.axis();
            this.area = d3.svg.area();
            this.path = this.svgRoot.append("path")
                .datum(this.dataset)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5);
        };
        Viz11.prototype.update = function (viewport) {
            var _this = this;
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding + this.xAxisOffset,
                yOffset: this.padding,
                width: viewport.width - this.xAxisOffset - (this.padding * 2),
                height: viewport.height - this.yAxisOffset - (this.padding * 2),
            };
            var maxValueY = d3.max(this.dataset, function (value) { return value[1]; });
            var yDomainStart = maxValueY * 1.05;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = plot.height;
            var maxValueX = d3.max(this.dataset, function (value) { return value[0]; });
            var xDomainStart = 0;
            var xDomainStop = maxValueX * 1.05;
            var xRangeStart = 0;
            var xRangeStop = plot.width;
            this.yScale
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            this.xScale
                .domain([xDomainStart, xDomainStop])
                .range([xRangeStart, xRangeStop]);
            var datasetSize = this.dataset.length;
            this.plotArea
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height);
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
            this.yAxisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
            this.xAxis.scale(this.xScale).orient('bottom').ticks(10);
            var transform = "translate(" + (this.padding + this.yAxisOffset) + "," + (plot.height + this.padding) + ")";
            this.xAxisGroup.attr("class", "axis").call(this.xAxis).attr({ 'transform': transform });
            this.area
                .x(function (d, i) { return _this.padding + _this.xAxisOffset + _this.xScale(d[0]); })
                .y0(function (d, i) { return _this.padding + plot.height; })
                .y1(function (d, i) { return _this.padding + _this.yScale(d[1]); });
            this.path
                .attr("d", this.area)
                .classed("area", true);
        };
        return Viz11;
    }());
    myApp.Viz11 = Viz11;
    var Viz12 = (function () {
        function Viz12() {
            this.name = "Visual 12 - Doughnut Chart";
            this.dataset = [21, 26, 16, 32];
            this.padding = 12;
        }
        Viz12.prototype.load = function (container) {
            this.svgRoot = d3.select(container).append("svg");
            this.arc = d3.svg.arc();
            this.pie = d3.layout.pie();
            this.arcSelection = this.svgRoot.selectAll("arc")
                .data(this.pie(this.dataset))
                .enter()
                .append("g")
                .attr("class", "arc");
            this.arcSelectionPath = this.arcSelection.append("path");
        };
        Viz12.prototype.update = function (viewport) {
            this.svgRoot
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.padding,
                yOffset: this.padding,
                width: viewport.width - (this.padding * 2),
                height: viewport.height - (this.padding * 2),
            };
            var outerRadius = d3.min([plot.width / 2, plot.height / 2]);
            var innerRadius = outerRadius / 3;
            this.arc
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            this.arcSelection
                .attr("transform", "translate(" + (outerRadius + this.padding) + ", " + (outerRadius + this.padding) + ")");
            var color = ["red", "green", "blue", "purple", "Yellow"];
            this.arcSelectionPath
                .attr("fill", function (d, i) { return color[i]; })
                .attr("d", this.arc);
        };
        return Viz12;
    }());
    myApp.Viz12 = Viz12;
})(myApp || (myApp = {}));
