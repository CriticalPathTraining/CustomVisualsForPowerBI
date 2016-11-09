module powerbi.extensibility.visual {

    export class Visual implements IVisual {

        constructor(options: VisualConstructorOptions) {
            // one-time initializaion code
        }

        public update(options: VisualUpdateOptions) {
            // called when viewport or data changes
        }

        public destroy(): void {
            // add cleanup code here
        }
    }
}


