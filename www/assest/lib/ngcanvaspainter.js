"use strict";
! function(e) {
    angular.module("pw.canvas-painter", []),
        function(e) {
            try {
                e = angular.module("pw.canvas-painter")
            } catch (t) {
                e = angular.module("pw.canvas-painter", [])
            }
            e.run(["$templateCache", function(e) {
                e.put("../templates/canvas.html", '<div class="pwCanvasPaint" style="position:relative"></div>')
            }])
        }(),
        function(e) {
            try {
                e = angular.module("pw.canvas-painter")
            } catch (t) {
                e = angular.module("pw.canvas-painter", [])
            }
            e.run(["$templateCache", function(e) {
                e.put("../templates/color-selector.html", '<ul class="pwColorSelector"><li ng-repeat="color in colorList track by $index" class="pwColor" ng-class="{\'active\': (selectedColor === color)}" ng-style="{\'background-color\':color}" ng-click="setColor(color)"></li></ul>')
            }])
        }(), angular.module("pw.canvas-painter").directive("pwCanvas", function() {
            return {
                restrict: "AE",
                scope: {
                    options: "=",
                    version: "="
                },
                templateUrl: "../templates/canvas.html",
                link: function(t, n) {
                    var o = !!("ontouchstart" in e),
                        a = o ? "touchstart" : "mousedown",
                        i = o ? "touchmove" : "mousemove",
                        r = o ? "touchend" : "mouseup",
                        c = t.options;
                    if (c.canvasId = c.customCanvasId || "pwCanvasMain", c.tmpCanvasId = c.customCanvasId ? c.canvasId + "Tmp" : "pwCanvasTmp", c.width = c.width || 400, c.height = c.height || 300, c.backgroundColor = c.backgroundColor || "transparent", c.color = c.color || "#000", c.undoEnabled = c.undoEnabled || !1, c.opacity = c.opacity || .9, c.lineWidth = c.lineWidth || 1, c.undo = c.undo || !1, c.imageSrc = c.imageSrc || !1, c.imageSrc) {
                        var l = new Image;
                        l.onload = function() {
                            console.log(this)
                            var background = new Image();
                            background.src = "http://i.imgur.com/yf6d9SX.jpg";

                            background.onload = function() {
                                console.log('jjjj')
                                p.drawImage(background, 0, 0);
                            }




                            // p.drawImage(this, 0, 0)
                        }, l.src = c.imageSrc
                    }
                    if (c.undo) {
                        var s = [];
                        t.$watch(function() {
                            return s.length
                        }, function(e) {
                            t.version = e
                        }), t.$watch("version", function(e) {
                            return 0 > e ? (t.version = 0, void 0) : e >= s.length ? (t.version = s.length, void 0) : (b(e), void 0)
                        })
                    }
                    var u = document.createElement("canvas");
                    u.id = c.canvasId;
                    var d = document.createElement("canvas");
                    d.id = c.tmpCanvasId, angular.element(d).css({
                        position: "absolute",
                        top: 0,
                        left: 0
                    }), n.find("div").append(u), n.find("div").append(d);
                    var BgImage = new Image();
                    BgImage.src = "assest/img/bg.png";
                    var p = u.getContext("2d"),
                        h = d.getContext("2d"),


                        image = new Image();
                        image.src = 'assest/img/bg.png'; 
   
                    console.log(image)
                    p.drawImage(image, 0, 0);









                   var v = {
                            x: 0,
                            y: 0
                        },
                        f = [];
                    u.width = d.width = c.width,
                        u.height = d.height = c.height,
                        p.fillStyle = c.backgroundColor,
                        p.fillRect(0, 0, u.width, u.height),
                        h.globalAlpha = c.opacity,
                        h.lineJoin = h.lineCap = "round",
                        h.lineWidth = 10,
                        h.strokeStyle = c.color,

                        t.$watch("options.lineWidth", function(e) {
                            "string" == typeof e && (e = parseInt(e, 10)), e && "number" == typeof e && (h.lineWidth = c.lineWidth = e)
                        }), t.$watch("options.color", function(e) {
                            e && (h.strokeStyle = h.fillStyle = e)
                        }), t.$watch("options.opacity", function(e) {
                            e && (h.globalAlpha = e)
                        });
                    var m = function(e) {
                            var t = 0,
                                n = 0;
                            do isNaN(e.offsetLeft) || (t += e.offsetTop, n += e.offsetLeft), e = e.offsetParent; while (e);
                            return {
                                left: n,
                                top: t
                            }
                        },
                        g = function(e, t) {
                            o ? (e.x = t.changedTouches[0].pageX - m(t.target).left, e.y = t.changedTouches[0].pageY - m(t.target).top) : (e.x = void 0 !== t.offsetX ? t.offsetX : t.layerX, e.y = void 0 !== t.offsetY ? t.offsetY : t.layerY)
                        },
                        y = function(e) {
                            if (e && (e.preventDefault(), g(v, e)), f.push({
                                    x: v.x,
                                    y: v.y
                                }), 3 === f.length) {
                                var t = f[0];
                                return h.beginPath(), h.arc(t.x, t.y, h.lineWidth / 2, 0, 2 * Math.PI, !0), h.fill(), h.closePath(), void 0
                            }
                            h.clearRect(0, 0, d.width, d.height), h.beginPath(), h.moveTo(f[0].x, f[0].y);
                            for (var n = 1; n < f.length - 2; n++) {
                                var o = (f[n].x + f[n + 1].x) / 2,
                                    a = (f[n].y + f[n + 1].y) / 2;
                                h.quadraticCurveTo(f[n].x, f[n].y, o, a)
                            }
                            h.quadraticCurveTo(f[n].x, f[n].y, f[n + 1].x, f[n + 1].y), h.stroke()
                        },
                        w = function() {
                            c.undo && t.$apply(function() {
                                s.push(p.getImageData(0, 0, d.width, d.height)), angular.isNumber(c.undo) && c.undo > 0 && (s = s.slice(-1 * c.undo))
                            }), d.removeEventListener(i, y, !1), p.drawImage(d, 0, 0), h.clearRect(0, 0, d.width, d.height), f = []
                        },
                        C = function(e) {
                            e.preventDefault(), d.addEventListener(i, y, !1), g(v, e), f.push({
                                x: v.x,
                                y: v.y
                            }), f.push({
                                x: v.x,
                                y: v.y
                            }), y()
                        },
                        x = function() {
                            function e() {
                                s = !0
                            }

                            function n() {
                                s = !1
                            }

                            function i() {
                                document.body.removeEventListener("mousedown", e), document.body.removeEventListener("mouseup", n)
                            }

                            function c(e) {
                                s && C(e)
                            }

                            function l(e) {
                                s && w(e)
                            }
                            if (d.addEventListener(a, C, !1), d.addEventListener(r, w, !1), !o) {
                                var s;
                                document.body.addEventListener("mousedown", e), document.body.addEventListener("mouseup", n), t.$on("$destroy", i), d.addEventListener("mouseenter", c), d.addEventListener("mouseleave", l)
                            }
                        },
                        b = function(e) {
                            s.length > 0 && (p.putImageData(s[e], 0, 0), s = s.slice(0, e))
                        };
                    x()
                }
            }
        }), angular.module("pw.canvas-painter").directive("pwColorSelector", function() {
            return {
                restrict: "AE",
                scope: {
                    colorList: "=pwColorSelector",
                    selectedColor: "=color"
                },
                templateUrl: "../templates/color-selector.html",
                link: function(e) {
                    e.setColor = function(t) {
                        e.selectedColor = t
                    }
                }
            }
        })
}(this);
