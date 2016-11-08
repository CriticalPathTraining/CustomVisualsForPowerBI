var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var visuals;
(function (visuals) {
    var Viz01 = (function () {
        function Viz01() {
        }
        Viz01.prototype.create = function (container) {
            this.container = $(container);
            this.init();
        };
        Viz01.prototype.init = function () {
            var _this = this;
            this.message = $("<div>")
                .text("Hello World")
                .css({
                "display": "table-cell",
                "text-align": "center",
                "vertical-align": "middle",
                "text-wrap": "none"
            });
            this.container.append(this.message);
            this.update();
            $(window).resize(function () { return _this.update(); });
        };
        Viz01.prototype.update = function () {
            var viewport = {
                width: $(window).width() - 0,
                height: $(window).height() - $("#toolbar").height() - 20
            };
            this.message.css({
                "top": "10px",
                "left": "10",
                "width": viewport.width,
                "height": viewport.height,
                "font-size": (viewport.width * 0.175)
            });
        };
        return Viz01;
    }());
    visuals.Viz01 = Viz01;
    var Viz02 = (function () {
        function Viz02() {
            this.paddingContainer = 12;
            this.paddingSVG = 20;
        }
        Viz02.prototype.create = function (container) {
            this.init(container);
        };
        Viz02.prototype.init = function (container) {
            var _this = this;
            this.svg = d3.select(container).append("svg")
                .attr("x", 0)
                .attr("y", 0);
            this.ellipse = this.svg.append("ellipse")
                .style("fill", "rgba(255, 255, 0, 0.5)")
                .style("stroke", "rgba(0, 0, 0, 1.0)")
                .style("stroke-width", "4");
            this.text = this.svg.append("text")
                .text("Hello D3")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("fill", "rgba(255, 0, 0, 1.0)")
                .style("stroke", "rgba(0, 0, 0, 1.0)")
                .style("stroke-width", "2");
            this.update();
            $(window).resize(function () { return _this.update(); });
        };
        Viz02.prototype.update = function () {
            var viewport = {
                width: $(window).width() - this.paddingContainer,
                height: $(window).height() - $("#toolbar").height() - this.paddingContainer - 8
            };
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var plot = {
                xOffset: this.paddingSVG,
                yOffset: this.paddingSVG,
                width: viewport.width - (this.paddingSVG * 2),
                height: viewport.height - (this.paddingSVG * 2),
            };
            this.ellipse
                .attr("cx", plot.xOffset + (plot.width / 2))
                .attr("cy", plot.yOffset + (plot.height / 2))
                .attr("rx", plot.width * 0.5)
                .attr("ry", plot.height * 0.5);
            var fontSizeForWidth = plot.width * .20;
            var fontSizeForHeight = plot.height * .35;
            var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);
            this.text
                .attr("x", plot.xOffset + (plot.width / 2))
                .attr("y", plot.yOffset + (plot.height / 2))
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("font-size", fontSize);
        };
        return Viz02;
    }());
    visuals.Viz02 = Viz02;
    var CustomVisualBase = (function () {
        function CustomVisualBase() {
            this.containerPaddingX = 4;
            this.containerPaddingY = 8;
        }
        CustomVisualBase.prototype.create = function (container) {
            var _this = this;
            this.container = d3.select(container);
            var viewport = {
                width: $(window).width() - this.containerPaddingX,
                height: $(window).height() - $("#toolbar").height() - this.containerPaddingY
            };
            this.init(viewport);
            this.update(viewport);
            $(window).resize(function () {
                var viewport = {
                    width: $(window).width() - _this.containerPaddingX,
                    height: $(window).height() - $("#toolbar").height() - _this.containerPaddingY
                };
                _this.update(viewport);
            });
        };
        CustomVisualBase.prototype.init = function (viewport) {
            // override this method in derived class
        };
        CustomVisualBase.prototype.update = function (viewport) {
            // override this method in derived class      
        };
        CustomVisualBase.prototype.refresh = function () {
            var viewport = {
                width: $(window).width() - this.containerPaddingX,
                height: $(window).height() - $("#toolbar").height() - this.containerPaddingY
            };
            this.update(viewport);
        };
        return CustomVisualBase;
    }());
    visuals.CustomVisualBase = CustomVisualBase;
    var Viz03 = (function (_super) {
        __extends(Viz03, _super);
        function Viz03() {
            _super.apply(this, arguments);
        }
        Viz03.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
            this.ellipse = this.svg.append("ellipse")
                .style("fill", "yellow")
                .style("stroke", "black")
                .style("stroke-width", "4");
            this.text = this.svg.append("text")
                .text("Hello Custom Visuals")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("fill", "blue")
                .style("stroke", "black")
                .style("stroke-width", "2");
        };
        Viz03.prototype.update = function (viewport) {
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var paddingSVG = 20;
            var plot = {
                xOffset: paddingSVG,
                yOffset: paddingSVG,
                width: viewport.width - (paddingSVG * 2),
                height: viewport.height - (paddingSVG * 2)
            };
            this.ellipse
                .attr("cx", plot.xOffset + (plot.width / 2))
                .attr("cy", plot.yOffset + (plot.height / 2))
                .attr("rx", plot.width * 0.5)
                .attr("ry", plot.height * 0.5);
            var fontSizeForWidth = plot.width * .10;
            var fontSizeForHeight = plot.height * .35;
            var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);
            this.text
                .attr("x", plot.xOffset + (plot.width / 2))
                .attr("y", plot.yOffset + (plot.height / 2))
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("font-size", fontSize);
        };
        return Viz03;
    }(CustomVisualBase));
    visuals.Viz03 = Viz03;
    var Viz04 = (function (_super) {
        __extends(Viz04, _super);
        function Viz04() {
            _super.apply(this, arguments);
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
            this.padding = 12;
        }
        Viz04.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
        };
        Viz04.prototype.update = function (viewport) {
            d3.selectAll("svg > *").remove();
            this.svg
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
            var barWidth = (plot.width / datasetSize) * 0.95;
            d3.select("svg").selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect")
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
        return Viz04;
    }(CustomVisualBase));
    visuals.Viz04 = Viz04;
    var Viz05 = (function (_super) {
        __extends(Viz05, _super);
        function Viz05() {
            _super.apply(this, arguments);
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
        }
        Viz05.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
        };
        Viz05.prototype.update = function (viewport) {
            d3.selectAll("svg > *").remove();
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var paddingSVG = 12;
            var plot = {
                xOffset: paddingSVG,
                yOffset: paddingSVG,
                width: viewport.width - (paddingSVG * 2),
                height: viewport.height - (paddingSVG * 2),
            };
            var datasetSize = this.dataset.length;
            var xScaleFactor = plot.width / datasetSize;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            var barWidth = (plot.width / datasetSize) * 0.95;
            d3.select("svg").selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect")
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - (Number(d) * yScaleFactor); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (Number(d) * yScaleFactor); })
                .attr("fill", "teal");
            var yTextOffset = (d3.min(this.dataset) * yScaleFactor) * 0.12;
            var textSize = (barWidth * 0.3) + "px";
            d3.select("svg").selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text")
                .text(function (d, i) { return "$" + d; })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
        };
        return Viz05;
    }(CustomVisualBase));
    visuals.Viz05 = Viz05;
    var Viz06 = (function (_super) {
        __extends(Viz06, _super);
        function Viz06() {
            _super.apply(this, arguments);
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
        }
        Viz06.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
        };
        Viz06.prototype.update = function (viewport) {
            var _this = this;
            d3.selectAll("svg > *").remove();
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var paddingSVG = 12;
            var xAxisOffset = 50;
            var plot = {
                xOffset: paddingSVG + xAxisOffset,
                yOffset: paddingSVG,
                width: viewport.width - (paddingSVG * 2) - xAxisOffset,
                height: viewport.height - (paddingSVG * 2),
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
            var barXStart = (plot.width / datasetSize) * 0.04;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            var g1 = this.svg.append("g");
            g1.append("rect")
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
            var g2 = this.svg.append("g");
            g2.selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect")
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal");
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            var g3 = this.svg.append("g");
            g3.selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text")
                .text(function (d, i) {
                return "$" + d;
            })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (paddingSVG + xAxisOffset) + "," + paddingSVG + ")";
            var g4 = this.svg.append("g");
            g4.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz06;
    }(CustomVisualBase));
    visuals.Viz06 = Viz06;
    var Viz07 = (function (_super) {
        __extends(Viz07, _super);
        function Viz07() {
            _super.apply(this, arguments);
            this.dataset = [440, 290, 340, 330, 400, 512, 368];
        }
        Viz07.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
        };
        Viz07.prototype.update = function (viewport) {
            var _this = this;
            d3.selectAll("svg > *").remove();
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var paddingSVG = 12;
            var xAxisOffset = 50;
            var plot = {
                xOffset: paddingSVG + xAxisOffset,
                yOffset: paddingSVG,
                width: viewport.width - (paddingSVG * 2) - xAxisOffset,
                height: viewport.height - (paddingSVG * 2),
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
            var barXStart = (plot.width / datasetSize) * 0.04;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            var g1 = this.svg.append("g");
            g1.append("rect")
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
            var g2 = this.svg.append("g");
            g2.selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect")
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal")
                .on("mouseover", function () { d3.select(this).attr("fill", "red"); })
                .on("mouseout", function () { d3.select(this).attr("fill", "teal"); });
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            var g3 = this.svg.append("g");
            g3.selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text")
                .text(function (d, i) {
                return "$" + d;
            })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (paddingSVG + xAxisOffset) + "," + paddingSVG + ")";
            var g4 = this.svg.append("g");
            g4.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz07;
    }(CustomVisualBase));
    visuals.Viz07 = Viz07;
    var Viz08 = (function (_super) {
        __extends(Viz08, _super);
        function Viz08() {
            _super.apply(this, arguments);
        }
        Viz08.prototype.init = function (viewport) {
            var _this = this;
            d3.csv("Data/data1.csv", function (data) {
                console.log(JSON.stringify(data));
                _this.dataset = data.map(function (x) { return Number(x.Data); });
                _this.refresh();
            });
            this.svg = this.container.append("svg");
            this.yScale = d3.scale.linear();
            this.yAxis = d3.svg.axis();
        };
        Viz08.prototype.update = function (viewport) {
            var _this = this;
            if (typeof this.dataset === "undefined") {
                return;
            }
            d3.selectAll("svg > *").remove();
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var paddingSVG = 12;
            var xAxisOffset = 50;
            var plot = {
                xOffset: paddingSVG + xAxisOffset,
                yOffset: paddingSVG,
                width: viewport.width - (paddingSVG * 2) - xAxisOffset,
                height: viewport.height - (paddingSVG * 2),
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
            var barXStart = (plot.width / datasetSize) * 0.04;
            var barWidth = (plot.width / datasetSize) * 0.92;
            var yScaleFactor = plot.height / d3.max(this.dataset);
            var g1 = this.svg.append("g");
            g1.append("rect")
                .attr("x", plot.xOffset)
                .attr("y", plot.yOffset)
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
            var g2 = this.svg.append("g");
            g2.selectAll("rect")
                .data(this.dataset)
                .enter()
                .append("rect")
                .attr("x", function (d, i) { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
                .attr("y", function (d, i) { return plot.yOffset + _this.yScale(Number(d)); })
                .attr("width", function (d, i) { return barWidth; })
                .attr("height", function (d, i) { return (plot.height - _this.yScale(Number(d))); })
                .attr("fill", "teal")
                .on("mouseover", function () { d3.select(this).attr("fill", "red"); })
                .on("mouseout", function () { d3.select(this).attr("fill", "teal"); });
            var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
            var textSize = (barWidth * 0.3) + "px";
            var g3 = this.svg.append("g");
            g3.selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text")
                .text(function (d, i) {
                return "$" + d;
            })
                .attr("x", function (d, i) { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
                .attr("y", function (d, i) { return plot.yOffset + plot.height - yTextOffset; })
                .attr("fill", "white")
                .attr("font-size", textSize)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
            this.yAxis.scale(this.yScale).orient('left').ticks(10);
            var transform = "translate(" + (paddingSVG + xAxisOffset) + "," + paddingSVG + ")";
            var g4 = this.svg.append("g");
            g4.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
        };
        return Viz08;
    }(CustomVisualBase));
    visuals.Viz08 = Viz08;
    var Viz09 = (function (_super) {
        __extends(Viz09, _super);
        function Viz09() {
            _super.apply(this, arguments);
        }
        Viz09.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
        };
        Viz09.prototype.update = function (viewport) {
        };
        return Viz09;
    }(CustomVisualBase));
    visuals.Viz09 = Viz09;
    var Viz10 = (function (_super) {
        __extends(Viz10, _super);
        function Viz10() {
            _super.apply(this, arguments);
            this.dataset = [
                [1, 440], [2, 350], [3, 290], [4, 240], [5, 510], [6, 240], [7, 270], [8, 340], [9, 420]
            ];
        }
        Viz10.prototype.init = function (viewport) {
            this.svg = this.container.append("svg");
            this.svgGroup = this.svg.append("g");
        };
        Viz10.prototype.update = function (viewport) {
            d3.selectAll("svg > *").remove();
            this.svg
                .attr("width", viewport.width)
                .attr("height", viewport.height);
            var xOffset = 20;
            var yOffset = 20;
            var padding = 20;
            var xMax = d3.max(this.dataset.map(function (x) { return x[0]; }));
            var yMax = d3.max(this.dataset.map(function (x) { return x[1]; }));
            var xDomainStart = 1;
            var xDomainStop = xMax;
            var xRangeStart = 0;
            var xRangeStop = viewport.width;
            var yDomainStart = yMax;
            var yDomainStop = 0;
            var yRangeStart = 0;
            var yRangeStop = viewport.height;
            var xScale = d3.scale.linear()
                .domain([xDomainStart, xDomainStop])
                .range([xRangeStart, xRangeStop]);
            var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5);
            var transform = "translate(" + xOffset + "," + (yOffset + yRangeStop) + ")";
            this.svg.append("g").attr("class", "axis").call(xAxis).attr({ 'transform': transform });
            var yScale = d3.scale.linear()
                .domain([yDomainStart, yDomainStop])
                .range([yRangeStart, yRangeStop]);
            var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5);
            var transform = "translate(" + yOffset + "," + yOffset + ")";
            this.svg.append("g").attr("class", "axis").call(yAxis).attr({ 'transform': transform });
            this.svg.append("rect")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .attr("width", xRangeStop)
                .attr("height", yRangeStop)
                .style("fill", "#FFC")
                .style("stroke", "#AAA");
            var group = this.svg.append("g");
            group.selectAll("circle")
                .data(this.dataset)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(d[0]); })
                .attr("cy", function (d) { return yScale(d[1]); })
                .attr("r", 10)
                .style("fill", "red");
            group.selectAll("text")
                .data(this.dataset)
                .enter()
                .append("text")
                .text(function (d) { return "[" + d[0] + "," + d[1] + "]"; })
                .attr("x", function (d) { return (xScale(d[0]) + 15); })
                .attr("y", function (d) { return (yScale(d[1]) + 6); })
                .attr("font-family", "arial")
                .attr("font-size", "18px")
                .attr("fill", "blue");
        };
        return Viz10;
    }(CustomVisualBase));
    visuals.Viz10 = Viz10;
})(visuals || (visuals = {}));
//# sourceMappingURL=visuals.js.map