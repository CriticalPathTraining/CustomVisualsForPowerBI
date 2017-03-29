
module powerbi.extensibility.visual.PBI_CV_7F014526_F58E_4837_B13F_7989F98B67DE  {

  export interface BarchartDataPoint {
    Category: string;
    Value: number;
    Opacity: number;
    selectionId: ISelectionId;
  }

  export class SmartieBarchart implements IVisual {

    private svg: d3.Selection<SVGElement>;
    private svgGroupMain: d3.Selection<SVGElement>;
    private dataView: DataView;
    
    private paddingSVG: number = 12;
    private xAxisOffset: number = 50;
    private yAxisOffset: number = 24;

    private selectionManager: ISelectionManager;
    private host: IVisualHost;
    private tooltipServiceWrapper: ITooltipServiceWrapper;
    private locale: string;


    constructor(options: VisualConstructorOptions) {

      this.svg = d3.select(options.element).append('svg');
      this.svgGroupMain = this.svg.append('g');

      this.host = options.host;
      this.selectionManager = options.host.createSelectionManager();
      this.tooltipServiceWrapper = createTooltipServiceWrapper(this.host.tooltipService, options.element);
      this.locale = options.host.locale;

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
        .attr('x', function (d) { return xScale(d.Category); })
        .attr('width', xScale.rangeBand())
        .attr('y', function (d) { return yScale(d.Value); })
        .attr('height', function (d) { return plot.height - yScale(d.Value); })
        .attr('fill-opacity', function (d) { return d.Opacity });

      this.tooltipServiceWrapper.addTooltip(this.svgGroupMain.selectAll('.bar'),
        (tooltipEvent: TooltipEventArgs<number>) => this.getTooltipData(tooltipEvent.data),
        (tooltipEvent: TooltipEventArgs<number>) => null);


      let selectionManager = this.selectionManager;

      //This must be an anonymous function instead of a lambda because
      //d3 uses 'this' as the reference to the element that was clicked.
      svgGroupBars.on('click', function (d) {
        selectionManager.select(d.selectionId)
          .then((ids: ISelectionId[]) => {
            svgGroupBars.attr({'fill-opacity': ids.length > 0 ? 0.5 : 0.75 });
            d3.select(this).attr({ 'fill-opacity': 1.0});
        });
        (<Event>d3.event).stopPropagation();
      });

      svgGroupBars
        .exit()
        .remove();

    }

    public dataviewConverter(categoricalDataView: DataViewCategorical): BarchartDataPoint[] {

      var categoryColumn = categoricalDataView.categories[0];
      var categoryNames = categoricalDataView.categories[0].values;
      var categoryValues = categoricalDataView.values[0].values;
      var categoryHighlightedValues = categoricalDataView.values[0].highlights;

      var barchartData: BarchartDataPoint[] = [];

      for (var i = 0; i < categoryValues.length; i++) {


        var category: string = <string>categoryNames[i];
        var categoryValue: number = <number>categoryValues[i];
       
        var HighlightedValueIsNull: boolean = (categoryHighlightedValues != null) && (categoryHighlightedValues[i] == null) ;
        var opacity: number = (HighlightedValueIsNull ? 0.5 : 1.0);

        barchartData.push({
          Category: category,
          Value: categoryValue,
          Opacity: opacity,
          selectionId: this.host.createSelectionIdBuilder()
                                .withCategory(categoryColumn, i)
                                .createSelectionId()
        });
        
      }

      // sort dataset by specific column if that is required
      barchartData.sort( (x, y) => { return y.Value - x.Value; })

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

    private getTooltipData(value: any): VisualTooltipDataItem[] {

      console.log(JSON.stringify(value));

      return [{
        displayName: value.Category,
        value: value.Value.toString(),
        color: "yellow",
        header: "Most Excellent Tooltip"
      }];
    }
  }
}