
module myApp {

  export interface IViewPort {
    width: number;
    height: number;
  }

  export interface ICustomVisual {
    name: string;
    load(container: HTMLElement): void;
    update(viewport: IViewPort): void;
  }

  export class Viz01 implements ICustomVisual {

    public name: string = "Visual 1: Hello jQuery";
    private container: JQuery;
    private message: JQuery;

    load(container: HTMLElement) {

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
    }

    public update(viewport: IViewPort) {

      let paddingX: number = 2;
      let paddingY: number = 2;
      let fontSizeMultiplierX: number = viewport.width * 0.15;
      let fontSizeMultiplierY: number = viewport.height * 0.4;
      let fontSizeMultiplier: number = Math.min(...[fontSizeMultiplierX, fontSizeMultiplierY]);

      this.message.css({
        "width": viewport.width - paddingX,
        "height": viewport.height - paddingY,
        "font-size": fontSizeMultiplier
      });

    }
  }

  export class Viz02 implements ICustomVisual {

    public name = "Visual 2: Hello D3";

    private svgRoot: d3.Selection<SVGElementInstance>;
    private ellipse: d3.Selection<SVGElementInstance>;
    private text: d3.Selection<SVGElementInstance>;
    private padding: number = 20;

    load(container: HTMLElement) {

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
    }

    public update(viewport: IViewPort) {

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
        .attr("ry", (plot.height * 0.5))

      var fontSizeForWidth = plot.width * .20;
      var fontSizeForHeight = plot.height * .35;
      var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);

      this.text
        .attr("x", plot.xOffset + (plot.width * 0.5))
        .attr("y", plot.yOffset + (plot.height * 0.5))
        .attr("width", plot.width)
        .attr("height", plot.height)
        .attr("font-size", fontSize);
    }

  }

  export class Viz03 implements ICustomVisual {

    name = "Visual 3 - Simple Bar Chart";

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private bars: d3.Selection<number>;
    private padding: number = 12;

    load(container: HTMLElement) {
      this.svgRoot = d3.select(container).append("svg");
      this.bars = this.svgRoot
        .selectAll("rect")
        .data(this.dataset)
        .enter()
        .append("rect");
    }

    update(viewport: IViewPort) {

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
        .attr("x", (d, i) => {
          return plot.xOffset + (i * (xScaleFactor));
        })
        .attr("y", (d, i) => {
          return plot.yOffset + plot.height - (Number(d) * yScaleFactor);
        })
        .attr("width", (d, i) => {
          return barWidth;
        })
        .attr("height", (d, i) => {
          return (Number(d) * yScaleFactor);
        })
        .attr("fill", "teal");
    }

  }

  export class Viz04 implements ICustomVisual {

    name = "Visual 4 - Bar Chart Labels";

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private bars: d3.Selection<number>;
    private labels: d3.Selection<number>;
    private padding: number = 12;

    load(container: HTMLElement) {
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
    }

    update(viewport: IViewPort) {

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
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - (Number(d) * yScaleFactor); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (Number(d) * yScaleFactor); })
        .attr("fill", "teal");

      var yTextOffset = (d3.min(this.dataset) * yScaleFactor) * 0.2;
      var textSize = (barWidth * 0.3) + "px";

      this.labels.text((d, i) => { return "$" + d; })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");

    }
  }

  export class Viz05 implements ICustomVisual {

    name = "Visual 5 - Adding a Y Axis";

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private axisGroup: d3.Selection<SVGElementInstance>;
    private bars: d3.Selection<number>;
    private labels: d3.Selection<number>;
    private padding: number = 12;
    private xAxisOffset: number = 50;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    load(container: HTMLElement) {

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
    }

    update(viewport: IViewPort) {

      this.svgRoot
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var plot = {
        xOffset: this.padding + this.xAxisOffset,
        yOffset: this.padding,
        width: viewport.width - this.xAxisOffset - (this.padding * 2),
        height: viewport.height - (this.padding * 2),
      };

      var yDomainStart: number = d3.max(this.dataset) * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      this.yScale
        .domain([yDomainStart, yDomainStop])
        .range([yRangeStart, yRangeStop]);

      var datasetSize = this.dataset.length;
      var xScaleFactor = plot.width / datasetSize;
      var barXStart = (plot.width / datasetSize) * 0.05
      var barWidth = (plot.width / datasetSize) * 0.92;
      var yScaleFactor = plot.height / d3.max(this.dataset);

      this.plotArea
        .attr("x", plot.xOffset)
        .attr("y", plot.yOffset)
        .attr("width", plot.width)
        .attr("height", plot.height);

      this.bars
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal");

      var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      this.labels
        .text((d, i) => { return "$" + d; })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
      this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });


    }
  }

  export class Viz06 implements ICustomVisual {

    name = "Visual 6 - Bar Hover Events";

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private axisGroup: d3.Selection<SVGElementInstance>;
    private bars: d3.Selection<number>;
    private labels: d3.Selection<number>;
    private padding: number = 12;
    private xAxisOffset: number = 50;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    load(container: HTMLElement) {

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
    }

    update(viewport: IViewPort) {

      this.svgRoot
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var plot = {
        xOffset: this.padding + this.xAxisOffset,
        yOffset: this.padding,
        width: viewport.width - this.xAxisOffset - (this.padding * 2),
        height: viewport.height - (this.padding * 2),
      };

      var yDomainStart: number = d3.max(this.dataset) * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      this.yScale
        .domain([yDomainStart, yDomainStop])
        .range([yRangeStart, yRangeStop]);

      var datasetSize = this.dataset.length;
      var xScaleFactor = plot.width / datasetSize;
      var barXStart = (plot.width / datasetSize) * 0.05
      var barWidth = (plot.width / datasetSize) * 0.92;
      var yScaleFactor = plot.height / d3.max(this.dataset);

      this.plotArea
        .attr("x", plot.xOffset)
        .attr("y", plot.yOffset)
        .attr("width", plot.width)
        .attr("height", plot.height);

      this.bars
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal")
        .on("mouseover", function () { d3.select(this).attr("fill", "black") })
        .on("mouseout", function () { d3.select(this).attr("fill", "teal") });

      var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      this.labels
        .text((d, i) => { return "$" + d; })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
      this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });

    }
  }

  export class Viz07 implements ICustomVisual {

    name = "Visual 7 - Animated Transitions";

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private axisGroup: d3.Selection<SVGElementInstance>;
    private bars: d3.Selection<number>;
    private labels: d3.Selection<number>;
    private padding: number = 12;
    private xAxisOffset: number = 50;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    load(container: HTMLElement) {

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
    }

    update(viewport: IViewPort) {

      this.svgRoot
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var plot = {
        xOffset: this.padding + this.xAxisOffset,
        yOffset: this.padding,
        width: viewport.width - this.xAxisOffset - (this.padding * 2),
        height: viewport.height - (this.padding * 2),
      };

      var yDomainStart: number = d3.max(this.dataset) * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      this.yScale
        .domain([yDomainStart, yDomainStop])
        .range([yRangeStart, yRangeStop]);

      var datasetSize = this.dataset.length;
      var xScaleFactor = plot.width / datasetSize;
      var barXStart = (plot.width / datasetSize) * 0.05
      var barWidth = (plot.width / datasetSize) * 0.92;
      var yScaleFactor = plot.height / d3.max(this.dataset);

      this.plotArea
        .attr("x", plot.xOffset)
        .attr("y", plot.yOffset)
        .attr("width", plot.width)
        .attr("height", plot.height);

      this.bars
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal")
        .on("mouseover", function () { d3.select(this).attr("fill", "black") })
        .on("mouseout", function () { d3.select(this).attr("fill", "teal") })
        .on("click", function (d, i) {
          // get reference to current bar
          var currentBar = d3.select(this);
          // determine current bar Y position and height
          var currentY: number = parseInt(currentBar.attr("y"));
          var currentHeight: number = parseInt(currentBar.attr("height"));
          // transition bar to height of zero
          currentBar.transition().duration(1000)
            .attr("y", currentY + (currentHeight))
            .attr("height", 0)
            .each("end", () => {
              // transition bar back to previoys height
              currentBar.transition().duration(500).delay(100)
                .attr("y", currentY)
                .attr("height", currentHeight);
            });
        });

      var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      this.labels
        .text((d, i) => { return "$" + d; })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
      this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });

    }
  }

  export class Viz08 implements ICustomVisual {

    name = "Visual 8 - Async Data Load";

    private dataset: Array<number>;

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private axisGroup: d3.Selection<SVGElementInstance>;
    private bars: d3.Selection<number>;
    private labels: d3.Selection<number>;
    private padding: number = 12;
    private xAxisOffset: number = 50;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    load(container: HTMLElement) {

      this.svgRoot = d3.select(container).append("svg");

      this.plotArea = this.svgRoot.append("rect")
        .attr("fill", "lightyellow")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      d3.csv("Data/data1.csv", (data) => {

        this.dataset = data.map(function (x: any) { return Number(x.Data); });

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

        // trigger update process from host app
        updateUI();
      });


      console.log("here 2");
    }

    update(viewport: IViewPort) {

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

      var yDomainStart: number = d3.max(this.dataset) * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      this.yScale
        .domain([yDomainStart, yDomainStop])
        .range([yRangeStart, yRangeStop]);

      var datasetSize = this.dataset.length;
      var xScaleFactor = plot.width / datasetSize;
      var barXStart = (plot.width / datasetSize) * 0.05
      var barWidth = (plot.width / datasetSize) * 0.92;
      var yScaleFactor = plot.height / d3.max(this.dataset);

      this.plotArea
        .attr("x", plot.xOffset)
        .attr("y", plot.yOffset)
        .attr("width", plot.width)
        .attr("height", plot.height);

      this.bars
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal")
        .on("mouseover", function () { d3.select(this).attr("fill", "black") })
        .on("mouseout", function () { d3.select(this).attr("fill", "teal") })
        .on("click", function (d, i) {
          // get reference to current bar
          var currentBar = d3.select(this);
          // determine current bar Y position and height
          var currentY: number = parseInt(currentBar.attr("y"));
          var currentHeight: number = parseInt(currentBar.attr("height"));
          // transition bar to height of zero
          currentBar.transition().duration(1000)
            .attr("y", currentY + (currentHeight))
            .attr("height", 0)
            .each("end", () => {
              // transition bar back to previoys height
              currentBar.transition().duration(500).delay(100)
                .attr("y", currentY)
                .attr("height", currentHeight);
            });
        });

      var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      this.labels
        .text((d, i) => { return "$" + d; })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
      this.axisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });

    }
  }

  export class Viz09 implements ICustomVisual {

    name = "Visual 9 - Scatter Chart";

    private dataset: number[][] = [
      [1, 440], [2, 350], [3, 290], [4, 240], [5, 430], [6, 240], [7, 270], [8, 340], [9, 420]
    ];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private dots: d3.Selection<number[]>;
    private padding: number = 12;

    private yAxisGroup: d3.Selection<SVGElementInstance>;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;
    private xAxisOffset: number = 50;

    private xAxisGroup: d3.Selection<SVGElementInstance>;
    private xScale: d3.scale.Linear<number, number>;
    private xAxis: d3.svg.Axis;
    private yAxisOffset: number = 50;

    load(container: HTMLElement) {

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

    }

    update(viewport: IViewPort) {

      this.svgRoot
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var plot = {
        xOffset: this.padding + this.xAxisOffset,
        yOffset: this.padding,
        width: viewport.width - this.xAxisOffset - (this.padding * 2),
        height: viewport.height - this.yAxisOffset - (this.padding * 2),
      };

      var maxValueY: number = d3.max(this.dataset, (value) => { return value[1]; });
      var yDomainStart: number = maxValueY * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      var maxValueX: number = d3.max(this.dataset, (value) => { return value[0]; });
      var xDomainStart: number = 0;
      var xDomainStop: number = maxValueX * 1.05;
      var xRangeStart: number = 0;
      var xRangeStop: number = plot.width;

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
        .attr("cx", (d) => {
          return (this.xScale(d[0]) + this.xAxisOffset);
        })
        .attr("cy", (d) => {
          return this.yScale(d[1]);
        });

      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (this.padding + this.xAxisOffset) + "," + this.padding + ")";
      this.yAxisGroup.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });

      this.xAxis.scale(this.xScale).orient('bottom').ticks(10);
      var transform = "translate(" + (this.padding + this.yAxisOffset) + "," + (plot.height + this.padding) + ")";
      this.xAxisGroup.attr("class", "axis").call(this.xAxis).attr({ 'transform': transform });

    }
  }

  export class Viz10 implements ICustomVisual {

    name = "Visual 10 - Line Chart";

    dataset: [number, number][] = [[0, 0], [0.5, 4], [1.0, 8], [1.6, 16], [2.1, 14], [3.0, 21]];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private line: d3.svg.Line<[number][number][]>;
    private path: d3.Selection<[number][]>;
    private padding: number = 12;

    private yAxisGroup: d3.Selection<SVGElementInstance>;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;
    private xAxisOffset: number = 50;

    private xAxisGroup: d3.Selection<SVGElementInstance>;
    private xScale: d3.scale.Linear<number, number>;
    private xAxis: d3.svg.Axis;
    private yAxisOffset: number = 50;


    load(container: HTMLElement) {

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


    }

    update(viewport: IViewPort) {


      this.svgRoot
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var plot = {
        xOffset: this.padding + this.xAxisOffset,
        yOffset: this.padding,
        width: viewport.width - this.xAxisOffset - (this.padding * 2),
        height: viewport.height - this.yAxisOffset - (this.padding * 2),
      };

      var maxValueY: number = d3.max(this.dataset, (value) => { return value[1]; });
      var yDomainStart: number = maxValueY * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      var maxValueX: number = d3.max(this.dataset, (value) => { return value[0]; });
      var xDomainStart: number = 0;
      var xDomainStop: number = maxValueX * 1.05;
      var xRangeStart: number = 0;
      var xRangeStop: number = plot.width;

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
        .x((d, i) => { return this.padding + this.xAxisOffset + this.xScale(d[0]); })
        .y((d, i) => { return this.padding + this.yScale(d[1]); });

      this.path.attr("d", this.line);

    }

  }

  export class Viz11 implements ICustomVisual {

    name = "Visual 11 - Area Chart";

    dataset: [number, number][] = [[0, 0], [0.5, 4], [1.0, 8], [1.6, 16], [2.1, 14], [3.0, 21]];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;
    private area: d3.svg.Area<[number][number][]>;
    private path: d3.Selection<[number][]>;
    private padding: number = 12;

    private yAxisGroup: d3.Selection<SVGElementInstance>;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;
    private xAxisOffset: number = 50;

    private xAxisGroup: d3.Selection<SVGElementInstance>;
    private xScale: d3.scale.Linear<number, number>;
    private xAxis: d3.svg.Axis;
    private yAxisOffset: number = 50;


    load(container: HTMLElement) {

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


    }

    update(viewport: IViewPort) {


      this.svgRoot
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var plot = {
        xOffset: this.padding + this.xAxisOffset,
        yOffset: this.padding,
        width: viewport.width - this.xAxisOffset - (this.padding * 2),
        height: viewport.height - this.yAxisOffset - (this.padding * 2),
      };

      var maxValueY: number = d3.max(this.dataset, (value) => { return value[1]; });
      var yDomainStart: number = maxValueY * 1.05;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = plot.height;

      var maxValueX: number = d3.max(this.dataset, (value) => { return value[0]; });
      var xDomainStart: number = 0;
      var xDomainStop: number = maxValueX * 1.05;
      var xRangeStart: number = 0;
      var xRangeStop: number = plot.width;

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
        .x((d, i) => { return this.padding + this.xAxisOffset + this.xScale(d[0]); })
        .y0((d, i) => { return this.padding + plot.height })
        .y1((d, i) => { return this.padding + this.yScale(d[1]); });

      this.path
        .attr("d", this.area)
        .classed("area", true);
    }

  }

  export class Viz12 implements ICustomVisual {

    name = "Visual 12 - Doughnut Chart";

    dataset = [21, 26, 16, 32];

    private svgRoot: d3.Selection<SVGElementInstance>;
    private plotArea: d3.Selection<SVGElementInstance>;

    private arc: d3.svg.Arc<d3.layout.pie.Arc<number>>;
    private pie: d3.layout.Pie<number>;
    private pieDataset: d3.layout.pie.Arc<number>[];
    private arcSelection: d3.Selection<d3.layout.pie.Arc<number>>;
    private arcSelectionPath: d3.Selection<d3.layout.pie.Arc<number>>;

    private padding: number = 12;

    load(container: HTMLElement) {

      this.svgRoot = d3.select(container).append("svg");
      this.arc = d3.svg.arc<d3.layout.pie.Arc<number>>();
      this.pie = d3.layout.pie();

      this.arcSelection = this.svgRoot.selectAll("arc")
        .data(this.pie(this.dataset))
        .enter()
        .append("g")
        .attr("class", "arc");


      this.arcSelectionPath = this.arcSelection.append("path");

    }

    update(viewport: IViewPort) {

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
        .attr("fill", (d, i) => { return color[i]; })
        .attr("d", this.arc);


    }
  }

}