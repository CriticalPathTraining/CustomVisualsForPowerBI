/// <reference path="visuals.ts" />
$(function () {
    var CreateVisual = function (visual) {
        // clear container
        $(window).off("resize");
        $("#viz").empty();
        visual.create("#viz");
    };
    $("#cmdCreateViz01").click(function () { CreateVisual(new visuals.Viz01()); });
    $("#cmdCreateViz02").click(function () { CreateVisual(new visuals.Viz02()); });
    $("#cmdCreateViz03").click(function () { CreateVisual(new visuals.Viz03()); });
    $("#cmdCreateViz04").click(function () { CreateVisual(new visuals.Viz04()); });
    $("#cmdCreateViz05").click(function () { CreateVisual(new visuals.Viz05()); });
    $("#cmdCreateViz06").click(function () { CreateVisual(new visuals.Viz06()); });
    $("#cmdCreateViz07").click(function () { CreateVisual(new visuals.Viz07()); });
    $("#cmdCreateViz08").click(function () { CreateVisual(new visuals.Viz08()); });
    $("#cmdCreateViz09").click(function () { CreateVisual(new visuals.Viz09()); });
    $("#cmdCreateViz10").click(function () { CreateVisual(new visuals.Viz10()); });
});
//# sourceMappingURL=app.js.map