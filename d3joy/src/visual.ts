module powerbi.extensibility.visual {
    export class Visual implements IVisual {

        private svgRoot: d3.Selection<SVGElementInstance>;
        private ellipse: d3.Selection<SVGElementInstance>;
        private text: d3.Selection<SVGElementInstance>;
        private padding: number = 20;

        constructor(options: VisualConstructorOptions) {

            this.svgRoot = d3.select(options.element).append("svg");

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

        public update(options: VisualUpdateOptions) {

            this.svgRoot
                .attr("width", options.viewport.width)
                .attr("height", options.viewport.height);

            var plot = {
                xOffset: this.padding,
                yOffset: this.padding,
                width: options.viewport.width - (this.padding * 2),
                height: options.viewport.height - (this.padding * 2),
            };

            this.ellipse
                .attr("cx", plot.xOffset + (plot.width * 0.5))
                .attr("cy", plot.yOffset + (plot.height * 0.5))
                .attr("rx", (plot.width * 0.5))
                .attr("ry", (plot.height * 0.5))

            var fontSizeForWidth: number = plot.width * .20;
            var fontSizeForHeight: number = plot.height * .35;
            var fontSize: number = d3.min([fontSizeForWidth, fontSizeForHeight]);

            this.text
                .attr("x", plot.xOffset + (plot.width / 2))
                .attr("y", plot.yOffset + (plot.height / 2))
                .attr("width", plot.width)
                .attr("height", plot.height)
                .attr("font-size", fontSize);

        }
    }
}