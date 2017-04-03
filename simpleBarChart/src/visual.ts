module powerbi.extensibility.visual {

  export interface BarchartDataPoint {
    Category: string;
    Value: number;
  }

  export interface BarchartViewModel {
    IsNotValid: boolean;
    DataPoints?: BarchartDataPoint[];
    Format?: string;
    SortBySize?: boolean;
    FontSize?: number;
    BarColor?: Fill;
  }

  export class SimpleBarchart implements IVisual {

    private svg: d3.Selection<SVGElement>;
    private svgGroupMain: d3.Selection<SVGElement>;
    private viewModel: BarchartViewModel;

    constructor(options: VisualConstructorOptions) {
      this.svg = d3.select(options.element).append('svg');
      this.svgGroupMain = this.svg.append('g');
    }

    public update(options: VisualUpdateOptions) {

      // get rid of what we did last time
      this.svgGroupMain.selectAll("g").remove();

      // set height and width of root SVG element using viewport passed by Power BI host
      this.svg.attr({
        height: options.viewport.height,
        width: options.viewport.width
      });
      
      var viewModel: BarchartViewModel = this.viewModel = this.createViewModel(options.dataViews[0]);
      if (viewModel.IsNotValid) {
        // handle case where categorical DataView is not valid
        this.svgGroupMain.append("g").append("text")
          .text("Please add fields to create a valid dataset")
          .attr("dominant-baseline", "hanging")
          .attr("font-size", 14)
          .style("fill", "red");
        return;
      }

      var xAxisOffset: number = viewModel.FontSize * 6;
      var yAxisOffset: number = viewModel.FontSize * 2;
      var paddingSVG: number = 12;

      // create plot variable to assist with rendering barchart into plot area
      var plot = {
        xOffset: paddingSVG + xAxisOffset,
        yOffset: paddingSVG,
        width: options.viewport.width - (paddingSVG * 2) - xAxisOffset,
        height: options.viewport.height - (paddingSVG * 2) - yAxisOffset,
      };


      // offset x and y coordinates for SVG group used to create bars 
      this.svgGroupMain.attr({
        height: plot.height,
        width: plot.width,
        transform: 'translate(' + plot.xOffset + ',' + plot.yOffset + ')'
      });

      // convert data from categorical DataView into dataset used with D3 data binding
      var barchartDataPoints: BarchartDataPoint[] = viewModel.DataPoints;

      // setup D3 ordinal scale object to map input category names in dataset to output range of x coordinate
      var xScale = d3.scale.ordinal()
        .domain(barchartDataPoints.map(function (d) { return d.Category; }))
        .rangeRoundBands([0, plot.width], 0.1);

      // determine maximum value for the bars in the barchart
      var yMax = d3.max(barchartDataPoints, function (d) { return +d.Value * 1.05 });

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
        .tickSize(0)
        .tickPadding(12)
        .orient('bottom');

      // draw x axis
      this.svgGroupMain
        .append('g')
        .attr('class', 'x axis')
        .style('fill', 'black')
        .attr('transform', 'translate(0,' + (plot.height) + ')')
        .call(xAxis);

      // get format string for measure
      var valueFormatterFactory = powerbi.extensibility.utils.formatting.valueFormatter;
      var valueFormatter = valueFormatterFactory.create({
        format: viewModel.Format,
        formatSingleValues: true
      });

      // draw y axis
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5)
        .tickSize(0)
        .tickPadding(12)
        .tickFormat(function (d) { return valueFormatter.format(d) });

      this.svgGroupMain
        .append('g')
        .attr('class', 'y axis')
        .style('fill', 'black') // you can get from metadata
        .call(yAxis);

      // draw bar
      var svgGroupBars = this.svgGroupMain
        .append('g')
        .selectAll('.bar')
        .data(barchartDataPoints);

      svgGroupBars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', viewModel.BarColor.solid.color)
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

      $(".axis text").css({ "font-size": viewModel.FontSize });

    }

    public createViewModel(dataView: DataView): BarchartViewModel {

      // handle case where categorical DataView is not valid
      if (typeof dataView === "undefined" ||
          typeof dataView.categorical === "undefined" ||
          typeof dataView.categorical.categories === "undefined" ||
          typeof dataView.categorical.values === "undefined") {
        return { IsNotValid: true };
      }

      var categoricalDataView: DataViewCategorical = dataView.categorical;
      var categoryColumn: DataViewCategoricalColumn = categoricalDataView.categories[0];
      var categoryNames: PrimitiveValue[] = categoricalDataView.categories[0].values;
      var categoryValues: PrimitiveValue[] = categoricalDataView.values[0].values;

      var barchartDataPoints: BarchartDataPoint[] = [];

      for (var i = 0; i < categoryValues.length; i++) {
        // get category name and category value
        var category: string = <string>categoryNames[i];
        var categoryValue: number = <number>categoryValues[i];
        // add new data point to barchartDataPoints collection
        barchartDataPoints.push({
          Category: category,
          Value: categoryValue
        });
      }

      // get formatting code for the field that is the measure
      var format: string = categoricalDataView.values[0].source.format;

      // get persistent property values
      var propertyGroups: DataViewObjects = dataView.metadata.objects;
      var propertyGroupName: string = "barchartProperties";
      var sortBySize: boolean = this.getValue<boolean>(propertyGroups, propertyGroupName, "sortBySize", false);
      var barColor: Fill = this.getValue<Fill>(propertyGroups, propertyGroupName, "barColor", { "solid": { "color": "teal" } });
      var fontSize: number = this.getValue<number>(propertyGroups, propertyGroupName, "fontSize", 18)

      // sort dataset rows by measure value if required
      if (sortBySize) {
        barchartDataPoints.sort((x, y) => { return y.Value - x.Value; })
      }

      // return view model to update method
      return {
        IsNotValid: false,
        DataPoints: barchartDataPoints,
        Format: format,
        SortBySize: sortBySize,
        BarColor: barColor,
        FontSize: fontSize
      };

    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {

      let objectName = options.objectName;
      let objectEnumeration: VisualObjectInstance[] = [];

      switch (objectName) {
        case 'barchartProperties':
          objectEnumeration.push({
            objectName: objectName,
            properties: {
              sortBySize: this.viewModel.SortBySize,
              barColor: this.viewModel.BarColor,
              fontSize: this.viewModel.FontSize,
            },
            validValues: {
              fontSize: { numberRange: { min: 7, max: 36 } }
            },
            selector: null
          });
          break;
      };

      return objectEnumeration;
    }

    public getValue<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T): T {
      if (objects) {
        let object = objects[objectName];
        if (object) {
          let property: T = <T>object[propertyName];
          if (property !== undefined) {
            return property;
          }
        }
      }
      return defaultValue;
    }

  }
}