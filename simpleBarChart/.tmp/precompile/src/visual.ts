module powerbi.extensibility.visual.PBI_CV_0B9C9FBA_15A2_4A94_8AE4_8F778869B190  {

  export interface BarchartDataPoint {
    Category: string;
    Value: number;
  }

  export class SimpleBarchart implements IVisual {

    private svg: d3.Selection<SVGElement>;
    private svgGroupMain: d3.Selection<SVGElement>;
    private dataView: DataView;
    private enableAxis: boolean;

    
    private paddingSVG: number = 12;
    private xAxisOffset: number = 50;
    private yAxisOffset: number = 24;

    constructor(options: VisualConstructorOptions) {
      this.svg = d3.select(options.element).append('svg');
      this.svgGroupMain = this.svg.append('g');
      this.enableAxis = false;
    }

    public update(options: VisualUpdateOptions) {

      // inspect dataview
      this.dataView = options.dataViews[0];

      // esnure categorical dataview exists
      var categoricalDataView = options.dataViews[0].categorical;
      if (typeof categoricalDataView === "undefined" ||
          typeof categoricalDataView.categories === "undefined" ||
          typeof categoricalDataView.values === "undefined") {
        // handle case where categorical DataView is not valid
        this.svgGroupMain.selectAll("g").remove();
        return;
      }

      // set height and width of root SVG element using viewport passed by Power BI host
      this.svg.attr({
        height: options.viewport.height,
        width: options.viewport.width
      });

      // create plot variable to assist with rendering barchart into plot area
      var plot = {
        xOffset: this.paddingSVG + this.xAxisOffset,
        yOffset: this.paddingSVG,
        width: options.viewport.width - (this.paddingSVG * 2) - this.xAxisOffset,
        height: options.viewport.height - (this.paddingSVG * 2) - this.yAxisOffset,
      };

      // offset x and y coordinates for SVG group used to create bars 
      this.svgGroupMain.attr({
        height: plot.height,
        width: plot.width,
        transform: 'translate(' + plot.xOffset + ',' + plot.yOffset + ')'
      });

      // convert data from categorical DataView into dataset used with D3 data binding
      var barchartData: BarchartDataPoint[] = this.dataviewConverter(categoricalDataView);

      // setup D3 ordinal scale object to map input category names in dataset to output range of x coordinate
      var xScale = d3.scale.ordinal()
        .domain(barchartData.map(function (d) { return d.Category; }))
        .rangeRoundBands([0, plot.width], 0.1);

      // determine maximum value for the bars in the barchart
      var yMax = d3.max(barchartData, function (d) { return +d.Value * 1.05 });

      // setup D3 linear scale object to map input data values to output range of y coordinate
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

      // draw x axis
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
        .tickFormat(function (d) { return formatValue(d) });

      this.svgGroupMain
        .append('g')
        .attr('class', 'y axis')
        .style('fill', 'black') // you can get from metadata
        .call(yAxis);

      // draw bar
      var svgGroupBars = this.svgGroupMain
        .append('g')
        .selectAll('.bar')
        .data(barchartData);

      svgGroupBars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', this.getFill(this.dataView).solid.color)
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

    }

    public dataviewConverter(cat: DataViewCategorical): BarchartDataPoint[] {

      var barchartData: BarchartDataPoint[] = [];

      for (var i = 0; i < cat.categories[0].values.length; i++) {
        barchartData.push({ Category: cat.categories[0].values[i].toString(), Value: +cat.values[0].values[i] });
      }

      // sort dataset by specific column if that is required
      // barchartData.sort( (x, y) => { return y.Value - x.Value; })

      return barchartData;

    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {

      let objectName = options.objectName;
      let objectEnumeration: VisualObjectInstance[] = [];

      switch (objectName) {
        case 'colorSelector':
          objectEnumeration.push({
            objectName: objectName,
            properties: {
              fill: this.getFill(this.dataView)
            },
            selector: null
          });
          break;
      };

      return objectEnumeration;
    }

    private getFill(dataView: DataView): Fill {

      if (dataView) {
        var objects = dataView.metadata.objects;
        if (objects) {
          var object = objects['colorSelector'];
          if (object) {
            var fill = <Fill>object['fill'];
            if (fill)
              console.log(JSON.stringify(fill));
            return fill;
          }
        }
      }
      return { solid: { color: "teal" } };
    }
 
   }
}