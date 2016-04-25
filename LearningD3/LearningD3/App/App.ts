module charting {
    export class chart {

        private dataset = [
            [1, 440], [2, 350], [3, 290], [4, 240], [5, 210], [6, 240], [7, 270], [8, 340], [9, 420]
        ];

        private svg: d3.Selection<any>;
        private svgGroup: d3.Selection<any>;

        private xOffset: number = 20;
        private yOffset: number = 20;
        private padding: number = 20;

        private xDomainStart: number = 1;
        private xDomainStop: number = 10;
        private xRangeStart: number = 0;
        private xRangeStop: number = 600;
        private xScale: d3.scale.Linear<number, number>;

        private yDomainStart: number = 500;
        private yDomainStop: number = 150;
        private yRangeStart: number = 0;
        private yRangeStop: number = 400;
        private yScale: d3.scale.Linear<number, number>;

        constructor(container: any) {
            this.init(container);

            this.xScale = d3.scale.linear()
                .domain([this.xDomainStart, this.xDomainStop])
                .range([this.xRangeStart, this.xRangeStop]);


            this.yScale = d3.scale.linear()
                .domain([this.yDomainStart, this.yDomainStop])
                .range([this.yRangeStart, this.yRangeStop]);

        }

        private init(container) {
            this.svg = d3.select(container).append("svg");
            this.svgGroup = this.svg.append("g");
        }

        public draw() {
            this.drawChartBackground();
            this.drawXAxis();
            this.drawYAxis();
            this.drawDataPoints();
        }

        private drawChartBackground() {
            this.svg.append("rect")
                .attr("x", this.xOffset)
                .attr("y", this.yOffset)
                .attr("width", this.xRangeStop)
                .attr("height", this.yRangeStop)
                .style("fill", "#FFC")
                .style("stroke", "#AAA");
        }


        private drawXAxis() {
            var xAxis = d3.svg.axis().scale(this.xScale).orient('bottom').ticks(5);
            var transform = "translate(" + this.xOffset + "," + (this.yOffset + this.yRangeStop) + ")";
            this.svg.append("g").attr("class", "axis").call(xAxis).attr({ 'transform': transform });
        }

        private drawYAxis() {
            var yAxis = d3.svg.axis().scale(this.yScale).orient('left').ticks(5);
            var transform = "translate(" + this.yOffset + "," + this.yOffset + ")";
            this.svg.append("g").attr("class", "axis").call(yAxis).attr({ 'transform': transform });
        }

        public drawFirstDataPoint() {


            let cx: number = this.xScale(this.dataset[0][0]) + this.xOffset;
            let cy: number = this.yScale(this.dataset[0][1]) + this.yOffset;

            this.svg.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", 10)
                .style("fill", "red");
        }

        public drawDataPoints() {

            let xScale: d3.scale.Linear<number, number> = this.xScale;
            let yScale: d3.scale.Linear<number, number> = this.yScale;

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
        }
    }
}

$(function () {

    var chart = new charting.chart('#viz');
    chart.draw();

});