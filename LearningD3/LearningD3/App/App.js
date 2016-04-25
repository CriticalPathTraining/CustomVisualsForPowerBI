var charting;
(function (charting) {
    var chart = (function () {
        function chart(container) {
            this.dataset = [
                [1, 440], [2, 350], [3, 290], [4, 240], [5, 210], [6, 240], [7, 270], [8, 340], [9, 420]
            ];
            this.xOffset = 20;
            this.yOffset = 20;
            this.padding = 20;
            this.xDomainStart = 1;
            this.xDomainStop = 10;
            this.xRangeStart = 0;
            this.xRangeStop = 600;
            this.yDomainStart = 500;
            this.yDomainStop = 150;
            this.yRangeStart = 0;
            this.yRangeStop = 400;
            this.init(container);
            this.xScale = d3.scale.linear()
                .domain([this.xDomainStart, this.xDomainStop])
                .range([this.xRangeStart, this.xRangeStop]);
            this.yScale = d3.scale.linear()
                .domain([this.yDomainStart, this.yDomainStop])
                .range([this.yRangeStart, this.yRangeStop]);
        }
        chart.prototype.init = function (container) {
            this.svg = d3.select(container).append("svg");
            this.svgGroup = this.svg.append("g");
        };
        chart.prototype.draw = function () {
            this.drawChartBackground();
            this.drawXAxis();
            this.drawYAxis();
            this.drawDataPoints();
        };
        chart.prototype.drawChartBackground = function () {
            this.svg.append("rect")
                .attr("x", this.xOffset)
                .attr("y", this.yOffset)
                .attr("width", this.xRangeStop)
                .attr("height", this.yRangeStop)
                .style("fill", "#FFC")
                .style("stroke", "#AAA");
        };
        chart.prototype.drawXAxis = function () {
            var xAxis = d3.svg.axis().scale(this.xScale).orient('bottom').ticks(5);
            var transform = "translate(" + this.xOffset + "," + (this.yOffset + this.yRangeStop) + ")";
            this.svg.append("g").attr("class", "axis").call(xAxis).attr({ 'transform': transform });
        };
        chart.prototype.drawYAxis = function () {
            var yAxis = d3.svg.axis().scale(this.yScale).orient('left').ticks(5);
            var transform = "translate(" + this.yOffset + "," + this.yOffset + ")";
            this.svg.append("g").attr("class", "axis").call(yAxis).attr({ 'transform': transform });
        };
        chart.prototype.drawFirstDataPoint = function () {
            var cx = this.xScale(this.dataset[0][0]) + this.xOffset;
            var cy = this.yScale(this.dataset[0][1]) + this.yOffset;
            this.svg.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", 10)
                .style("fill", "red");
        };
        chart.prototype.drawDataPoints = function () {
            var xScale = this.xScale;
            var yScale = this.yScale;
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
        return chart;
    }());
    charting.chart = chart;
})(charting || (charting = {}));
$(function () {
    var chart = new charting.chart('#viz');
    chart.draw();
});
//# sourceMappingURL=App.js.map