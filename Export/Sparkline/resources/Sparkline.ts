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
module powerbi.visuals {
    import SelectionManager = utility.SelectionManager;
    export interface SparklineModel {
        color: string;
        size: number;
        data: number[];
        animate: boolean;
        delay: number;
        duration: number;
        selector: SelectionId;
        toolTipInfo: TooltipDataItem[];
    }
    export class Sparkline implements IVisual {
        
        private root: D3.Selection;
        private timer: number; 
        private svg: D3.Selection;
        private dataView: DataView;
        private static DefaultFontColor = '#4682b4';
        private static DefaultSize = 1;
        private static DefaultAnimate = false;
        private static DefaultDuration = 1000;
        private static DefaulDelay = 3000;
        private selectionManager: SelectionManager;
       
       // Advertise visual capabilities        
       public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'Category',
                },
                {
                    name: 'Value',
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Value',
                },
            ]
            ,
            dataViewMappings: [{
                conditions: [
                    {
                        'Category': { max: 1 }, 'Value': { max: 1 }
                    },
                ],                
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { bottom: {count: 100} }
                    },
                    values: {
                        group: 
                        {
                            by: "Series",
                            select: [{ bind: { to: 'Value' } }]
                        }
                    },
                },
            }],            
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        fill: {
                            type: { fill: { solid: { color: true } } },
                            displayName: 'Color'                       
                        }
                        ,
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
                            displayName: data.createDisplayNameGetter('Visual_Show')
                         },                        
                        delay: {
                            type: { numeric: true},
                            displayName: 'Delay'
                        }
                        ,
                        duration: {
                            type: { numeric: true },
                            displayName: 'Duration'
                        }
                    }
                }               
            }

        };
       // Converter to convert Power BI model to an custom visual model 
       public static converter(dataView: DataView): SparklineModel {
            if (!dataView) {return;}
            if (!Sparkline.isDataViewValid(dataView)) {return;}
            
            var categoryValuesLen = 0;
            var dataViewCategorical = dataView.categorical;
           
            var categories = dataViewCategorical.categories[0]; // get to categories
            var values = dataViewCategorical.values && dataViewCategorical.values[0].values; // get to measures
            var categoryValues = categories && categories.values;
            var categoryValuesLen = categoryValues && categoryValues.length;
            var tooltipString: string = "";
            var formatter = valueFormatter.create({  format:dataViewCategorical.values[0].source.format, value: 0});
            for (var i=0; i < values.length; i++) {tooltipString += formatter.format(values[i]) + " "} // beautify tooltip values
          
             var viewModel: SparklineModel = {
                color: Sparkline.getFill(dataView).solid.color,
                size: Sparkline.getSize(dataView),
                data: values,
                animate: Sparkline.getAnimate(dataView),
                duration: Sparkline.getDuration(dataView),
                delay: Sparkline.getDelay(dataView),
                selector: SelectionId.createNull(),
                toolTipInfo: [{
                   displayName: dataViewCategorical.values[0].source.displayName,
                   value: tooltipString
                }]             
            };            
            return viewModel;
        }
        // validates data view to ensure we have one group and one measure
        private static isDataViewValid (dataView: DataView): boolean
        {
            if (dataView && dataView.categorical && dataView.categorical.categories && dataView.metadata 
                && dataView.categorical.categories[0] && dataView.categorical.values
                )
                {
                return true;
                }
                return false;
        }
        

        public init(options: VisualInitOptions): void {
            this.selectionManager = new SelectionManager({ hostServices: options.host });
            this.root = d3.select(options.element.get(0));
            
            this.svg = this.root
                .append('svg')
                .classed('sparkline', true)
                .attr('height', options.viewport.height)
                .attr('width', options.viewport.width);
        }
        
        // Update method where the visual draw actually happens
        public update(options: VisualUpdateOptions) {
            this.svg.selectAll("path").remove(); // clear existing line
            if (!options.dataViews || !options.dataViews[0]) return;
            var dataView = this.dataView = options.dataViews[0];
            var viewport = options.viewport;
            var viewModel: SparklineModel = Sparkline.converter(dataView);
            if (!viewModel) return;
            if (viewport.height < 0 || viewport.width < 0) return;
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
		var x = d3.scale.linear().domain([0, data.length-1]).range([0, viewport.width]); 
		// Y scale will fit values from min to max calibrated to the graph higth
		var y = d3.scale.linear().domain([Math.min.apply(Math, data), Math.max.apply(Math, data)]).range([0, viewport.height]);
		// create a line
		var line = d3.svg.line()
            .interpolate("basis") // smooth line
			// assign the X function to plot on X axis
			.x(function(d,i) {
				// enable the next line when debugging to output X coordinate
				// console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using xScale.');
				return x(i);
			})
			.y(function(d) {
				// enable the next line when debugging to output X coordinate
				// console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using yScale.");
				return viewport.height-y(d); // values are plotted from the top so reverse the scale
			})
            
   		    // display the line by appending an svg:path element with the data line we created above
			var path = this.svg.append("svg:path")
                .attr("d", line(data))
                .attr('stroke-width', function(d) { return viewModel.size })
                .attr('stroke', function(d) { return viewModel.color});
  
            // the animation function
 			function redrawWithAnimation() {
                var totalLength = path.node().getTotalLength();
                graph.selectAll("path")
					.data([data]) // set the new data
                    .attr("d", line)
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)                   
                    .transition()
                        .duration(viewModel.duration)
                        .ease("linear")
                        .attr("stroke-dashoffset", 0);
			}  
                             
            if (viewModel.animate)
            {
    			this.timer = setInterval(function() {
    			   	   redrawWithAnimation();
    			}, viewModel.delay);                
            }
            TooltipManager.addTooltip(this.svg, (tooltipEvent: TooltipEvent) => viewModel.toolTipInfo);
    }
    private stopAnimation()  {
           if (this.timer) 
           {
               clearInterval (this.timer);
               this.timer = null;
           }           
   }
      // Begin helper methods to extract properties         
       private static getFill(dataView: DataView): Fill {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var general = objects['general'];
                    if (general) {
                        var fill = <Fill>general['fill'];
                        if (fill)
                            return fill;
                    }
                }
            }
            return { solid: { color: Sparkline.DefaultFontColor } };
        }

        private static getSize(dataView: DataView): number {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var general = objects['general'];
                    if (general) {
                        var size = <number>general['size'];
                        if (size)
                            return size;
                    }
                }
            }
            return Sparkline.DefaultSize;
        }
   
       private static getAnimate(dataView: DataView): boolean {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var labels = objects['labels'];
                    if (labels) {
                        var animate = <boolean>labels['show'];
                        if (animate)
                            return animate;
                    }
                }
            }
            return Sparkline.DefaultAnimate;
        }
       private static getDuration(dataView: DataView): number {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var labels = objects['labels'];
                    if (labels) {
                        var duration = <number>labels['duration'];
                        if (duration)
                            return duration;
                    }
                }
            }
            return Sparkline.DefaultDuration;
        }
       private static getDelay(dataView: DataView): number {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var labels = objects['labels'];
                    if (labels) {
                        var delay = <number>labels['delay'];
                        if (delay)
                            return delay;
                    }
                }
            }
            return Sparkline.DefaulDelay;
        }        
// End helper methods to extract properties 

// Enumerate properties; note that a property won't display unless it's enumerated
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];
            var dataView = this.dataView;
            switch (options.objectName) {
                case 'general':
                    var general: VisualObjectInstance = {
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
                    var labels: VisualObjectInstance = {
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
        }
        
        public destroy(): void {
            this.svg = null;
            this.root = null;
            this.timer = null;
        }
    }
}