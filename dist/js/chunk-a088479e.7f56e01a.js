(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a088479e"],{"00c3":function(t,s,n){},"9dab":function(t,s,n){"use strict";var e=n("00c3"),o=n.n(e);o.a},ec42:function(t,s,n){"use strict";n.r(s);var e=function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"questions-list"},[n("b-row",[n("b-col",{staticClass:"mx-auto",attrs:{cols:"11",xl:"8"}},t._l(t.questions,(function(s,e){return n("b-row",{key:e,staticClass:"mt-2"},[n("b-col",[n("p",{staticClass:"p-2 m-0 question"},[t._v(t._s(e+1)+". "+t._s(s.question))])])],1)})),1)],1)],1)},o=[],i=n("bc3a"),a=n.n(i),c="https://testing-gomza-back.herokuapp.com",u={name:"QuestionsList",data:function(){return{questions:[]}},methods:{setConfig:function(){var t=this.$cookies.get("jwt_token"),s={headers:{"X-CSRFToken":this.$cookies.get("csrftoken"),Authorization:"Bearer ".concat(t)}};return s},getQuestions:function(){var t=this,s=this.setConfig();a.a.get("".concat(c,"/questions/"),s).then((function(s){t.questions=s.data}))}},mounted:function(){this.getQuestions()}},r=u,l=(n("9dab"),n("2877")),f=Object(l["a"])(r,e,o,!1,null,null,null);s["default"]=f.exports}}]);
//# sourceMappingURL=chunk-a088479e.7f56e01a.js.map