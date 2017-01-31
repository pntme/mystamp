! function() {
    "use strict";
    var counter = 8;

    function n(n, e, i) {
        function o(n) {
            var o = parseInt(n.ionGalleryRowSize),
                t = function() {
                    n.ionGalleryRowSize = e.getRowSize(o || i.row_size, n.ionGalleryItems.length), n.actionLabel = i.action_label, n.items = e.buildGallery(n.ionGalleryItems, n.ionGalleryRowSize), n.responsiveGrid = parseInt(1 / n.ionGalleryRowSize * 100)
                };
            t(),
                function() {
                    n.$watch(function() {
                        return n.ionGalleryItems.length
                    }, function(n, e) {
                        n !== e && t()
                    })
                }()
        }

        function t(n, e, o) {
            n.customCallback = angular.isFunction(n.ionItemCallback) && o.hasOwnProperty("ionItemCallback"), n.ionSliderToggle = "false" === o.ionGalleryToggle ? !1 : i.toggle
        }
        return o.$inject = ["$scope", "$state"], {
            restrict: "AE",
            scope: {
                ionGalleryItems: "=ionGalleryItems",
                ionGalleryRowSize: "=?ionGalleryRow",
                ionItemCallback: "&?ionItemCallback"
            },
            controller: o,
            link: t,
            replace: !0,
            templateUrl: "gallery.html"
        }
    }
    angular.module("ion-gallery", ["templates"]).directive("ionGallery", n), n.$inject = ["$ionicPlatform", "ionGalleryHelper", "ionGalleryConfig", "$state"]
}(),
function() {
    "use strict";

    function n() {
        this.config = {
            action_label: "Done",
            toggle: !0,
            row_size: 3,
            fixed_row_size: !0
        }, this.$get = function() {
            return this.config
        }, this.setGalleryConfig = function(n) {
            angular.extend(this.config, this.config, n)
        }
    }
    angular.module("ion-gallery").provider("ionGalleryConfig", n), n.$inject = []
}(),
function() {
    "use strict";

    function n(n) {
        this.getRowSize = function(e, i) {
            var o;
            return o = isNaN(e) === !0 || 0 >= e ? n.row_size : e > i && !n.fixed_row_size ? i : e
        }, this.buildGallery = function(n, e) {
            for (var i = [], o = -1, t = 0, l = 0; l < n.length; l++) l % e === 0 && (o++, i[o] = [], t = 0), n[l].hasOwnProperty("sub") || (n[l].sub = ""), n[l].hasOwnProperty("thumb") || (n[l].thumb = n[l].src), n[l].position = l, i[o][t] = n[l], t++;
            return i
        }
    }
    angular.module("ion-gallery").service("ionGalleryHelper", n), n.$inject = ["ionGalleryConfig", "$state"]
}(),
function() {
    "use strict";

    function n() {
        function n(n, e, i) {
            var o = function(n, i) {
                i > 0 && (n.naturalHeight >= n.naturalWidth ? e.attr("width", "100%") : e.attr("height", e.parent()[0].offsetHeight + "px"))
            };
            e.bind("load", function(i) {
                var t = this;
                e.parent()[0].offsetHeight > 0 && o(this, e.parent()[0].offsetHeight), n.$watch(function() {
                    return e.parent()[0].offsetHeight
                }, function(n) {
                    o(t, n)
                })
            })
        }
        return {
            restrict: "A",
            link: n
        }
    }
    angular.module("ion-gallery").directive("ionImageScale", n), n.$inject = ["$state"]
}(),
function() {
    "use strict";

    function n(n) {
        function e(n, e, i) {
            n.$watch(function() {
                return n.ionGalleryRowSize
            }, function(i, o) {
                i > 0 && e.css("height", e[0].offsetWidth * parseInt(n.responsiveGrid) / 100 + "px")
            })
        }
        return {
            restrict: "A",
            link: e
        }
    }
    angular.module("ion-gallery").directive("ionRowHeight", n), n.$inject = ["ionGalleryConfig", "$state"]
}(),
function() {
    "use strict";

    function n(n, e) {
        function i(i, o, t) {
            var l = !1,
                a = function() {
                    i.$emit("ZoomStarted")
                },
                r = function(n) {
                    l = !0, e(function() {
                        l = !1, i.$emit("DoubleTapEvent", {
                            x: n.gesture.touches[0].pageX,
                            y: n.gesture.touches[0].pageY
                        })
                    }, 200)
                },
                s = function(n) {
                    l !== !0 && e(function() {
                        l !== !0 && i.$emit("TapEvent")
                    }, 200)
                },
                c = n.on("pinch", a, o),
                u = n.on("doubletap", function(n) {
                    r(n)
                }, o),
                d = n.on("tap", s, o);
            i.$on("$destroy", function() {
                n.off(u, "doubletap", r), n.off(d, "tap", s), n.off(c, "pinch", a)
            })
        }
        return {
            restrict: "A",
            link: i
        }
    }
    angular.module("ion-gallery").directive("ionSlideAction", n), n.$inject = ["$ionicGesture", "$timeout", "$state"]
}(),
function() {
    "use strict";

    function n(n, e, i, o, t) {
        function l(n) {
            function e() {
                a = !1, r()
            }
            var i, l, a = (n.ionGalleryRowSize, !1);
            n.selectedSlide = 1, n.hideAll = !1, n.showImage = function(e) {
                n.slides = [], l = e;
                var o = n.ionGalleryItems.length,
                    t = 0 > e - 1 ? o - 1 : e - 1,
                    a = e + 1 >= o ? 0 : e + 1;
                n.slides[0] = n.ionGalleryItems[t], n.slides[1] = n.ionGalleryItems[e], n.slides[2] = n.ionGalleryItems[a], i = 1, n.loadModal()
            }, n.slideChanged = function(e) {
                if (e !== i) {
                    var o, a = n.slides.length - i - e,
                        r = n.ionGalleryItems.length,
                        s = i + ">" + e;
                    "0>1" === s || "1>2" === s || "2>0" === s ? (l++, l >= r && (l = 0), o = l + 1, o >= r && (o = 0)) : ("0>2" === s || "1>0" === s || "2>1" === s) && (l--, 0 > l && (l = r - 1), o = l - 1, 0 > o && (o = r - 1)), t.$getByHandle("slide-" + a).zoomTo(1), n.slides[a] = n.ionGalleryItems[o], i = e
                }
            }, n.$on("ZoomStarted", function(e) {
                o(function() {
                    a = !0, n.hideAll = !0
                })
            }), n.$on("TapEvent", function(n) {
                o(function() {
                    r()
                })
            }), n.$on("DoubleTapEvent", function(n, e) {
                o(function() {
                    s(e)
                })
            });
            var r = function() {
                    return a === !0 ? (t.$getByHandle("slide-" + i).zoomTo(1, !0), void o(function() {
                        e()
                    }, 300)) : void(n.hasOwnProperty("ionSliderToggle") && n.ionSliderToggle === !1 && n.hideAll === !1 || a === !0 || (n.hideAll = !n.hideAll))
                },
                s = function(e) {
                    a === !1 ? (t.$getByHandle("slide-" + i).zoomTo(3, !0, e.x, e.y), a = !0, n.hideAll = !0) : r()
                }
        }

        function a(e, i, o) {
            var t;
            var SelectedData;
            e.loadModal = function() {
                    n.fromTemplateUrl("slider.html", {
                        scope: e,
                        animation: "fade-in"
                    }).then(function(n) {
                        t = n, e.openModal()
                    })
                }, e.openModal = function() {
                    t.show()
                }, e.share = function(data) {
                    e.$emit('SelectedData',{id: SelectedData.date});
                    t.hide();
                    t.remove();
                }, e.OpenOption = function(data) {
                    SelectedData = data;
                    console.log(SelectedData)
                    e.ImageClicked = true;
                }, e.SlidingStarted = function() {
                    e.ImageClicked = false;
                }, e.remove = function() {
                    
                   e.$emit('SelectedDataRemove',{date: SelectedData.date, src: SelectedData.src});
                },


                e.$on("$destroy", function() {
                    try {
                        t.remove()
                    } catch (n) {}
                })
        }
        return l.$inject = ["$scope", "$state"], {
            restrict: "A",
            controller: l,
            link: a
        }
    }
    angular.module("ion-gallery").directive("ionSlider", n), n.$inject = ["$ionicModal", "ionGalleryHelper", "$ionicPlatform", "$timeout", "$ionicScrollDelegate", "$state"]
}(), angular.module("templates", []).run(["$templateCache", function(n) {
    var temp = `<ion-modal-view class="imageView">
    <div class="bar bar-header bar-dark" ng-if="ImageClicked">
        <div class="buttons buttons-left header-item">
            <span class="left-buttons">
         <a class="button button-icon button-clear ion-android-share-alt" ng-click="share(slides)">
         </a> 
         </span>
        </div>
        <div class="h1 title title-left light"></div>
        <div class="buttons buttons-right header-item">
            <span class="right-buttons">
         <button class="button button-icon button-clear ion-trash-b" ng-click="remove(selectedSlide);"> 
         </button>
          </span>
        </div>
    </div>
    <ion-content class="has-no-header" scroll="false">
        <ion-slide-box does-continue="true" active-slide="selectedSlide" show-pager="false" class="listContainer" on-slide-changed="slideChanged($index); SlidingStarted(selectedSlide);">
            <ion-slide ng-repeat="single in slides track by $index">
                <ion-scroll direction="xy" locking="false" zooming="true" min-zoom="1" scrollbar-x="false" scrollbar-y="false" ion-slide-action delegate-handle="slide-{{$index}}" overflow-scroll="false">
                    <div class="item item-image gallery-slide-view"> <img ng-src="{{single.src}}" ng-click="OpenOption(single)"> </div>
                    <div  class="image-subtitle" > <span>{{single.title}} <br/> {{single.sub}} </span>
                    </div>
                </ion-scroll>
            </ion-slide>
        </ion-slide-box>
    </ion-content>
</ion-modal-view>`;


    var temp2 = `<div class="gallery-view">
    <div class="row" ng-repeat="item in items track by $index" ion-row-height>
        <div ng-repeat="photo in item track by $index" class="col col-{{responsiveGrid}} image-container">
            <img ion-image-scale ng-src="{{photo.thumb}}" ng-click="customCallback ? ionItemCallback({item:photo}) : showImage(photo.position)">
        </div>
    </div>
    <div ion-slider></div>
</div>`;
    n.put("gallery.html", temp2), n.put("slider.html", temp)
}]);
