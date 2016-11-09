
module powerbi.extensibility.visual {

    export class Visual implements IVisual {
      
         private target: HTMLElement;
    private jqTarget: JQuery

        constructor(options: VisualConstructorOptions) {
          this.target = options.element;
          this.jqTarget = $(this.target);
          this.jqTarget.css({ "background-color": "green" });
        }

        public update(options: VisualUpdateOptions) {
          var table = $("<table>");

          table.append($("<tr>")
            .append($("<td>").text("Width"))
            .append($("<td>").text(options.viewport.width)));

          table.append($("<tr>")
            .append($("<td>").text("Height"))
            .append($("<td>").text(options.viewport.height)));

          table.append($("<tr>")
            .append($("<td>").text("Update Type"))
            .append($("<td>").text(options.type.toString())));


          table.append($("<tr>")
            .append($("<td>").text("View Mode"))
            .append($("<td>").text(options.viewMode.toString())));

          table.append($("<tr>")
            .append($("<td>").text("View Mode"))
            .append($("<td>").text(options.dataViews.length)));

          table.append($("<tr>")
            .append($("<td>").text("Data View"))
            .append($("<td>").text(JSON.stringify(options.dataViews))));


          if (options.dataViews.length > 0) {

            //table.append($("<tr>")
            //  .append($("<td>").text("Categories"))
            //  .append($("<td>").text(JSON.stringify(options.dataViews[0].categorical.categories[0].values))));


            //table.append($("<tr>")
            //  .append($("<td>").text("Values"))
            //  .append($("<td>").text(JSON.stringify(options.dataViews[0].categorical.values[0].values))));

          }

          this.jqTarget.empty().append(table);        }

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }

}