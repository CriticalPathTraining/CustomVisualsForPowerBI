var myApp;
(function (myApp) {
    var leftNavCollapsed = true;
    var visuals = [
        new myApp.Viz01(), new myApp.Viz02(), new myApp.Viz03, new myApp.Viz04(), new myApp.Viz05(), new myApp.Viz06,
        new myApp.Viz07(), new myApp.Viz08(), new myApp.Viz09, new myApp.Viz10(), new myApp.Viz11(), new myApp.Viz12
    ];
    var loadedVisual;
    $(function () {
        var visualPickerMenu = $("#visualPickerMenu");
        visuals.forEach(function (visual, index, visuals) {
            var li = $("<li>").append($("<a>", { id: index }).text(visual.name));
            visualPickerMenu.append(li);
        });
        $("#visualPickerMenu a").click(onVisualPickerSelect);
        $("#left-nav-toggle").click(onNavigationToggle);
        $(window).resize(updateUI);
        onNavigationToggle();
        LoadVisual(visuals[0]);
    });
    function onNavigationToggle() {
        leftNavCollapsed = !leftNavCollapsed;
        updateUI();
    }
    function onVisualPickerSelect(evt) {
        var targetId = evt.currentTarget.id;
        var index = parseInt(targetId);
        var visual = visuals[index];
        LoadVisual(visuals[index]);
    }
    function LoadVisual(visual) {
        $("#visualName").html("&nbsp;-&nbsp;" + visual.name);
        var vizContainer = document.getElementById("viz");
        $(vizContainer).empty();
        visual.load(vizContainer);
        loadedVisual = visual;
        updateUI();
    }
    function updateUI() {
        if (leftNavCollapsed) {
            $("#left-nav").addClass("navigationPaneCollapsed");
            $("#content-body").addClass("contentBodyNavigationCollapsed");
            $(".leftNavItem").addClass("leftNavHide").hide();
        }
        else {
            $("#left-nav").removeClass("navigationPaneCollapsed");
            $("#content-body").removeClass("contentBodyNavigationCollapsed");
            $(".leftNavItem").removeClass("leftNavHide").show();
        }
        var windowHeight = $(window).height();
        var bannerHeight = $("#banner").height();
        $("#left-nav").height(windowHeight - bannerHeight);
        //console.log($(window).width() - $("#left-nav").width());
        if (loadedVisual !== undefined) {
            var viewport = {
                width: $(window).width() - $("#left-nav").width(),
                height: $(window).height() - $("#banner").height()
            };
            loadedVisual.update(viewport);
        }
    }
    myApp.updateUI = updateUI;
})(myApp || (myApp = {}));
