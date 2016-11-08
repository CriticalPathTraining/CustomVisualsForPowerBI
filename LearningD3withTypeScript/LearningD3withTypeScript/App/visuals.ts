
module visuals {

  export class Viz01 {

    public container: JQuery;
    public message: JQuery;

    public create(container: any) {
      this.container = $(container);
      this.init();
    }

    public init() {

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
      $(window).resize(() => this.update());
    }

    public update() {

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

    }
  }

  export class Viz02 {

    private svg: d3.Selection<SVGElementInstance>;
    private ellipse: d3.Selection<SVGElementInstance>;
    private text: d3.Selection<SVGElementInstance>;

    private paddingContainer: number = 12;
    private paddingSVG: number = 20;

    public create(container: any) {
      this.init(container);
    }

    public init(container) {

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
      $(window).resize(() => this.update());
    }

    public update() {

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
        .attr("ry", plot.height * 0.5)

      var fontSizeForWidth = plot.width * .20;
      var fontSizeForHeight = plot.height * .35;
      var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);

      this.text
        .attr("x", plot.xOffset + (plot.width / 2))
        .attr("y", plot.yOffset + (plot.height / 2))
        .attr("width", plot.width)
        .attr("height", plot.height)
        .attr("font-size", fontSize);

    }
  }

  export interface IViewport {
    width: number;
    height: number;
  }

  export class CustomVisualBase {

    protected container: d3.Selection<any>;
    private containerPaddingX: number = 4;
    private containerPaddingY: number = 8;

    public create(container: string) {

      this.container = d3.select(container);

      var viewport: IViewport = {
        width: $(window).width() - this.containerPaddingX,
        height: $(window).height() - $("#toolbar").height() - this.containerPaddingY
      };

      this.init(viewport);
      this.update(viewport);

      $(window).resize(() => {
        var viewport: IViewport = {
          width: $(window).width() - this.containerPaddingX,
          height: $(window).height() - $("#toolbar").height() - this.containerPaddingY
        };
        this.update(viewport);
      });

    }

    public init(viewport: IViewport) {
      // override this method in derived class
    }

    public update(viewport: IViewport) {
      // override this method in derived class      
    }

    protected refresh() {
      var viewport: IViewport = {
        width: $(window).width() - this.containerPaddingX,
        height: $(window).height() - $("#toolbar").height() - this.containerPaddingY
      };
      this.update(viewport);
    }

  }

  export class Viz03 extends CustomVisualBase {

    private svg: d3.Selection<SVGElementInstance>;
    private ellipse: d3.Selection<SVGElementInstance>;
    private text: d3.Selection<SVGElementInstance>;

    public init(viewport: IViewport) {

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

    }

    public update(viewport: IViewport) {

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
        .attr("ry", plot.height * 0.5)

      var fontSizeForWidth = plot.width * .10;
      var fontSizeForHeight = plot.height * .35;
      var fontSize = d3.min([fontSizeForWidth, fontSizeForHeight]);

      this.text
        .attr("x", plot.xOffset + (plot.width / 2))
        .attr("y", plot.yOffset + (plot.height / 2))
        .attr("width", plot.width)
        .attr("height", plot.height)
        .attr("font-size", fontSize);

    }

  }

  export class Viz04 extends CustomVisualBase {

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svg: d3.Selection<SVGElementInstance>;
    private rect: d3.Selection<SVGRectElement>;
    private padding: number = 12;

    public init(viewport: IViewport) {
      this.svg = this.container.append("svg");
    }

    public update(viewport: IViewport) {

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

  export class Viz05 extends CustomVisualBase {

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svg: d3.Selection<SVGElementInstance>;

    public init(viewport: IViewport) {
      this.svg = this.container.append("svg");
    }

    public update(viewport: IViewport) {

      d3.selectAll("svg > *").remove();

      this.svg
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var paddingSVG: number = 12;

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
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - (Number(d) * yScaleFactor); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (Number(d) * yScaleFactor); })
        .attr("fill", "teal");

      var yTextOffset = (d3.min(this.dataset) * yScaleFactor) * 0.12;
      var textSize = (barWidth * 0.3) + "px";

      d3.select("svg").selectAll("text")
        .data(this.dataset)
        .enter()
        .append("text")
        .text((d, i) => { return "$" + d; })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
    }
  }

  export class Viz06 extends CustomVisualBase {

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svg: d3.Selection<SVGElementInstance>;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    public init(viewport: IViewport) {
      this.svg = this.container.append("svg");
      this.yScale = d3.scale.linear();
      this.yAxis = d3.svg.axis();
    }

    public update(viewport: IViewport) {

      d3.selectAll("svg > *").remove();

      this.svg
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var paddingSVG: number = 12;
      var xAxisOffset = 50;

      var plot = {
        xOffset: paddingSVG + xAxisOffset,
        yOffset: paddingSVG,
        width: viewport.width - (paddingSVG * 2) - xAxisOffset,
        height: viewport.height - (paddingSVG * 2),
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
      var barXStart = (plot.width / datasetSize) * 0.04
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
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal");

      var yTextOffset =  this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      var g3 = this.svg.append("g");
      g3.selectAll("text")
        .data(this.dataset)
        .enter()
        .append("text")
        .text((d, i) => { return "$" + d; 
        })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (paddingSVG + xAxisOffset) + "," + paddingSVG + ")";
      var g4 = this.svg.append("g");
      g4.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });


    }

  }

  export class Viz07 extends CustomVisualBase {

    private dataset = [440, 290, 340, 330, 400, 512, 368];

    private svg: d3.Selection<SVGElementInstance>;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    public init(viewport: IViewport) {
      this.svg = this.container.append("svg");
      this.yScale = d3.scale.linear();
      this.yAxis = d3.svg.axis();
    }

    public update(viewport: IViewport) {

      d3.selectAll("svg > *").remove();

      this.svg
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var paddingSVG: number = 12;
      var xAxisOffset = 50;

      var plot = {
        xOffset: paddingSVG + xAxisOffset,
        yOffset: paddingSVG,
        width: viewport.width - (paddingSVG * 2) - xAxisOffset,
        height: viewport.height - (paddingSVG * 2),
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
      var barXStart = (plot.width / datasetSize) * 0.04
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
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal")
        .on("mouseover", function () { d3.select(this).attr("fill", "red") })
        .on("mouseout", function () { d3.select(this).attr("fill", "teal") });

      var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      var g3 = this.svg.append("g");
      g3.selectAll("text")
        .data(this.dataset)
        .enter()
        .append("text")
        .text((d, i) => {
          return "$" + d;
        })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (paddingSVG + xAxisOffset) + "," + paddingSVG + ")";
      var g4 = this.svg.append("g");
      g4.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
    }

  }

  export class Viz08 extends CustomVisualBase {

    private dataset;

    private svg: d3.Selection<SVGElementInstance>;
    private yScale: d3.scale.Linear<number, number>;
    private yAxis: d3.svg.Axis;

    public init(viewport: IViewport) {

      d3.csv("Data/data1.csv", (data) => {
        console.log(JSON.stringify(data));
        this.dataset = data.map(function (x: any) { return Number(x.Data); });
        this.refresh();
      });

      this.svg = this.container.append("svg");
      this.yScale = d3.scale.linear();
      this.yAxis = d3.svg.axis();
    }

    public update(viewport: IViewport) {

      if (typeof this.dataset === "undefined") {
        return;
      }

      d3.selectAll("svg > *").remove();

      this.svg
        .attr("width", viewport.width)
        .attr("height", viewport.height);

      var paddingSVG: number = 12;
      var xAxisOffset = 50;

      var plot = {
        xOffset: paddingSVG + xAxisOffset,
        yOffset: paddingSVG,
        width: viewport.width - (paddingSVG * 2) - xAxisOffset,
        height: viewport.height - (paddingSVG * 2),
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
      var barXStart = (plot.width / datasetSize) * 0.04
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
        .attr("x", (d, i) => { return plot.xOffset + barXStart + (i * (xScaleFactor)); })
        .attr("y", (d, i) => { return plot.yOffset + this.yScale(Number(d)); })
        .attr("width", (d, i) => { return barWidth; })
        .attr("height", (d, i) => { return (plot.height - this.yScale(Number(d))); })
        .attr("fill", "teal")
        .on("mouseover", function () { d3.select(this).attr("fill", "red") })
        .on("mouseout", function () { d3.select(this).attr("fill", "teal") });

      var yTextOffset = this.yScale(d3.min(this.dataset)) * 0.5;
      var textSize = (barWidth * 0.3) + "px";

      var g3 = this.svg.append("g");
      g3.selectAll("text")
        .data(this.dataset)
        .enter()
        .append("text")
        .text((d, i) => {
          return "$" + d;
        })
        .attr("x", (d, i) => { return plot.xOffset + (i * (xScaleFactor)) + (barWidth / 2); })
        .attr("y", (d, i) => { return plot.yOffset + plot.height - yTextOffset; })
        .attr("fill", "white")
        .attr("font-size", textSize)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");


      this.yAxis.scale(this.yScale).orient('left').ticks(10);
      var transform = "translate(" + (paddingSVG + xAxisOffset) + "," + paddingSVG + ")";
      var g4 = this.svg.append("g");
      g4.attr("class", "axis").call(this.yAxis).attr({ 'transform': transform });
    }
  }

  export class Viz09 extends CustomVisualBase {

    private svg: d3.Selection<SVGElementInstance>;

    public init(viewport: IViewport) {
      this.svg = this.container.append("svg");
    }

    public update(viewport: IViewport) {

    }

  }

  export class Viz10 extends CustomVisualBase {


    private dataset = [
      [1, 440], [2, 350], [3, 290], [4, 240], [5, 510], [6, 240], [7, 270], [8, 340], [9, 420]
    ];

    private svg: d3.Selection<SVGElementInstance>;
    private svgGroup: d3.Selection<any>;

    public init(viewport: IViewport) {
      this.svg = this.container.append("svg");
      this.svgGroup = this.svg.append("g");
    }

    public update(viewport: IViewport) {

      d3.selectAll("svg > *").remove();

      this.svg
        .attr("width", viewport.width)
        .attr("height", viewport.height);



      var xOffset: number = 20;
      var yOffset: number = 20;
      var padding: number = 20;

      var xMax = d3.max(this.dataset.map(function (x) { return x[0]; }));
      var yMax = d3.max(this.dataset.map(function (x) { return x[1]; }));

      var xDomainStart: number = 1;
      var xDomainStop: number = xMax

      var xRangeStart: number = 0;
      var xRangeStop: number = viewport.width;

      var yDomainStart: number = yMax;
      var yDomainStop: number = 0;
      var yRangeStart: number = 0;
      var yRangeStop: number = viewport.height;


      var xScale: d3.scale.Linear<number, number> = d3.scale.linear()
        .domain([xDomainStart, xDomainStop])
        .range([xRangeStart, xRangeStop]);

      var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(5);
      var transform = "translate(" + xOffset + "," + (yOffset + yRangeStop) + ")";
      this.svg.append("g").attr("class", "axis").call(xAxis).attr({ 'transform': transform });

      var yScale: d3.scale.Linear<number, number> = d3.scale.linear()
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
    }

  }


}