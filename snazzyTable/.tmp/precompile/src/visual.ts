module powerbi.extensibility.visual.PBI_CV_B9C6C6C7_9583_4BF9_B2E0_9CE157681851  {

  export class SnazzyTable implements IVisual {

    private rootElement: JQuery;
    private dataView: DataView;
    private host: IVisualHost;

    constructor(options: VisualConstructorOptions) {
      this.rootElement = $(options.element);
    }

    public update(options: VisualUpdateOptions) {
      this.rootElement.empty();

      var dataView: DataView = this.dataView = options.dataViews[0];
      if (dataView != null && dataView.table != null) {

        var table: DataViewTable = dataView.table;
        var columns: DataViewMetadataColumn[] = table.columns;
        var rows: DataViewTableRow[] = table.rows;

        var snazzyTable: JQuery = $("<table>", { id: "snazzyTable" });
        var headerRow: JQuery = $("<tr>");
        for (var headerIndex: number = 0; headerIndex < columns.length; headerIndex++) {
          headerRow.append($("<th>").text(columns[headerIndex].displayName));
        }
        snazzyTable.append(headerRow);

        var valueFormatterFactory = powerbi.extensibility.utils.formatting.valueFormatter;

        for (var rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
          var tableRow: JQuery = $("<tr>");
          for (var columnIndex: number = 0; columnIndex < columns.length; columnIndex++) {

            var valueFormat: string = columns[columnIndex].format;
            var valueFormatter: powerbi.extensibility.utils.formatting.IValueFormatter =
              valueFormatterFactory.create({ format: valueFormat });
            var value: PrimitiveValue = rows[rowIndex][columnIndex].valueOf();
            var tableCell: JQuery = $("<td>").text(valueFormatter.format(value));
            if (columns[columnIndex].type.numeric || columns[columnIndex].type.integer) {
              tableCell.css({ "text-align": "right" });
            }
            if (this.getValue<boolean>(columns[columnIndex].objects, "columnFormatting", "fontBold", false)) {
              tableCell.css({ "font-weight": "bold" });
            }
            tableRow.append(tableCell);
          }
          snazzyTable.append(tableRow);
        }

        var snazzyTableContainer: JQuery = $("<div>", { id: "snazzyTableContainer" });
        snazzyTableContainer.css({
          "width": options.viewport.width,
          "height": options.viewport.height
        });
        snazzyTableContainer.append(snazzyTable);
        this.rootElement.append(snazzyTableContainer);

      }
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
      let objectName = options.objectName;
      let objectEnumeration: VisualObjectInstance[] = [];

      var metadataColumns: DataViewMetadataColumn[] = this.dataView.metadata.columns;

      switch (objectName) {
        case 'columnFormatting':
          for (var i = 0; i < metadataColumns.length; i++) {
            var currentColumn: DataViewMetadataColumn = metadataColumns[i];
            objectEnumeration.push({
              objectName: objectName,
              displayName: currentColumn.displayName,
              properties: {
                fontBold: this.getValue<boolean>(currentColumn.objects, objectName, "fontBold", false)
              },
              selector: { metadata: currentColumn.queryName }
            });

          };
          break;
      }
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