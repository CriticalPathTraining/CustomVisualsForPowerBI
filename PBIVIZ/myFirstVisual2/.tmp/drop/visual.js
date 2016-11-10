var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA;
            (function (PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA) {
                var Visual = (function () {
                    function Visual(options) {
                        this.target = options.element;
                        this.jqTarget = $(this.target);
                        this.jqTarget.css({ "background-color": "green" });
                    }
                    Visual.prototype.update = function (options) {
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
                        }
                        this.jqTarget.empty().append(table);
                    };
                    Visual.prototype.destroy = function () {
                        //TODO: Perform any cleanup tasks here
                    };
                    return Visual;
                }());
                PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA.Visual = Visual;
            })(PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA = visual.PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA || (visual.PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA_DEBUG = {
                name: 'PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA_DEBUG',
                displayName: 'MyFirstVisual',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.1.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_9E1E30E2_0235_4FD8_885B_CFE7A1D7BDBA.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map