module powerbi.extensibility.visual.PBI_CV_5C3FDC9C_58FC_41F3_BDF9_1D6FB3CB9C9F  {

  export function getValue<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T): T {
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

  export function getCategoricalObjectValue<T>(category: DataViewCategoryColumn, index: number, objectName: string, propertyName: string, defaultValue: T): T {
    let categoryObjects = category.objects;

    if (categoryObjects) {
      let categoryObject: DataViewObject = categoryObjects[index];
      if (categoryObject) {
        let object = categoryObject[objectName];
        if (object) {
          let property: T = <T>object[propertyName];
          if (property !== undefined) {
            return property;
          }
        }
      }
    }
    return defaultValue;
  }

  export class OneBigNumber implements IVisual {

    private rootElement: JQuery;

    private dataView: DataView;

    constructor(options: VisualConstructorOptions) {
      this.rootElement = $(options.element);
    }

    public update(options: VisualUpdateOptions) {

      this.dataView = options.dataViews[0];

      this.rootElement.empty();

      if (this.dataView != null) {
              
        var defaultFontColor: Fill = { "solid": { "color": "darkblue" } };
        var defaultBackgroundColor: Fill = { "solid": { "color": "yellow" } };

        var propertyGroups: DataViewObjects = this.dataView.metadata.objects;
        var propertyGroupName: string = "oneBigNumberProperties";
        var showName: boolean = getValue<boolean>(propertyGroups, propertyGroupName, "showName", true);
        var fontBold: string = getValue<boolean>(propertyGroups, propertyGroupName, "fontBold", true) ? "bold": "normal";
        var fontColor: string = getValue<Fill>(propertyGroups, propertyGroupName, "fontColor", defaultFontColor).solid.color;
        var backgroundColor: string = getValue<Fill>(propertyGroups, propertyGroupName, "backgroundColor", defaultBackgroundColor).solid.color;; 
        var fontType = getValue<string>(this.dataView.metadata.objects, propertyGroupName, "fontType", "boring"); 
        var fontSize = getValue<number>(this.dataView.metadata.objects, propertyGroupName, "fontSize", 18);

        var value: number = <number>this.dataView.single.value;
        var column: DataViewMetadataColumn = this.dataView.metadata.columns[0];
        var valueName: string = column.displayName
        var valueFormat: string = column.format;
       
       var valueFormatterFactory = powerbi.extensibility.utils.formatting.valueFormatter;
       var valueFormatter = valueFormatterFactory.create({
         format: valueFormat,
         formatSingleValues: true
       });

        var valueString: string = valueFormatter.format(value);

        var outputString: string = valueString;
        if (showName) {
          outputString = valueName + ": " + outputString;
        }

        var outputDiv = $("<div>")
          .text(outputString)
          .css({
            "display": "table-cell",
            "text-align": "center",
            "vertical-align": "middle",
            "text-wrap": "none",
            "width": options.viewport.width,
            "height": options.viewport.height,
            "padding": "12px",
            "font-weight": fontBold,
            "color": fontColor,
            "background-color": backgroundColor,
            "font-size": fontSize          
        });
        
        this.rootElement.append(outputDiv);
        
      }
      else {
        this.rootElement.append($("<div>")
          .text("Please add a measure")
          .css({
            "display": "table-cell",
            "text-align": "center",
            "vertical-align": "middle",
            "text-wrap": "none",
            "width": options.viewport.width,
            "height": options.viewport.height,
            "padding": "12px",
            "color": "red"
          }));
      }
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {

      console.log(options.objectName);

      let objectName: string = options.objectName;
      let objectEnumeration: VisualObjectInstance[] = [];

      switch (objectName) {
        case 'oneBigNumberProperties':
          objectEnumeration.push({
            objectName: objectName,
            displayName: objectName,
            properties: {
              showName: getValue<boolean>(this.dataView.metadata.objects, objectName, "showName", true),
              fontBold: getValue<boolean>(this.dataView.metadata.objects, objectName, "fontBold", true),
              fontColor: getValue<Fill>(this.dataView.metadata.objects, objectName, "fontColor", { "solid": { "color": "blue" } }),
              backgroundColor: getValue<Fill>(this.dataView.metadata.objects, objectName, "backgroundColor", { "solid": { "color": "lightyellow" } }),
              fontType: getValue<string>(this.dataView.metadata.objects, objectName, "fontType", "boring"),
              fontSize: getValue<number>(this.dataView.metadata.objects, objectName, "fontSize", 18)
             },
            validValues: {
              fontSize: { numberRange: { min: 10, max: 72 } }
            }
            ,
            selector: null
          });
          break;
      };

      return objectEnumeration;
    }
  }
}