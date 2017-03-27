module myApp {

  var leftNavCollapsed: boolean = true;
 
  var visuals: ICustomVisual[] = [
    new Viz01(), new Viz02(), new Viz03, new Viz04(), new Viz05(), new Viz06, 
    new Viz07(), new Viz08(), new Viz09, new Viz10(), new Viz11(), new Viz12 
  ];

  var loadedVisual: ICustomVisual;


  $(() => {

    var visualPickerMenu: JQuery = $("#visualPickerMenu");
    visuals.forEach((visual: ICustomVisual, index: number, visuals: ICustomVisual[]) => {
      var li: JQuery = $("<li>").append($("<a>", { id: index }).text(visual.name));
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
    var targetId: string = evt.currentTarget.id;
    var index: number = parseInt(targetId);
    var visual: ICustomVisual = visuals[index];
    LoadVisual(visuals[index]);
  }

  function LoadVisual(visual: ICustomVisual) {
    $("#visualName").html("&nbsp;-&nbsp;" + visual.name);
    var vizContainer: HTMLElement = document.getElementById("viz");
    $(vizContainer).empty();
    visual.load(vizContainer);
    loadedVisual = visual;
    updateUI();
  }

  export function updateUI() {

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
      var viewport: IViewPort = {
        width: $(window).width() - $("#left-nav").width(),
        height: $(window).height() - $("#banner").height()
      };

      loadedVisual.update(viewport);
    }
  }

}