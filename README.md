## AoC attempt in Javascript 

Hosted via github pages: [HERE](https://sonnenhut.github.io/aoc2018/index.html)
(Only tested in Chrome 70)

Uses a bunch of interesting stuff:
 - [dynamic import](https://developers.google.com/web/updates/2017/11/dynamic-import)
 - [static import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
 - [code element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code)
 - [noscript element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript)
 - [bind (scope, this)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)
 - [regexp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
 - [svg](https://developer.mozilla.org/de/docs/Web/SVG/Element/svg)
 - [rect](https://developer.mozilla.org/de/docs/Web/SVG/Element/rect)
 - [createElementNS](https://developer.mozilla.org/de/docs/Web/API/Document/createElementNS)
 - [setAttributeNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS)
 - [viewBox](https://www.sarasoueidan.com/blog/svg-coordinate-systems/)
 - [Dijkstra (for pathfinding)](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
 
 built with: [vanilla-js](http://vanilla-js.com/)
 
 


My thoughts on JavaScript / what did I learn:
 - using the correct datastructure can make a huge difference (i.e Marbles/Recipe from Day09/Day14 or using a Map rather than an array)
 - lacking proper equality check (i.e. Java .equals() check in a Set - how does that properly work out with JS objects)
 - reduce, filter, split, map are very nice "out of the box" to use
 - A proper unit-testing suite that integrates into the IDE is really worth it
 - Infinite loops will hang the browser, cumbersome to debug stuff in the browser