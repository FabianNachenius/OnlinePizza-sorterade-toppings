/*********************************************************************************
* MIT License
* 
* Copyright (c) 2018 Fabian Nachenius
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
*     The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
*    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
**********************************************************************************/
// ==UserScript==
// @name         Onlinepizza sorterade tillval
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sorterar tillvalen på onlinepizza efter namn istället för total jävla randomness
// @author       Fabiono den kulturelle
// @match        https://onlinepizza.se/restaurant/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Topping lists can appear through different triggers that may change over time, so instead of bothering with those we just run this script once every second.
    var runInterval = setInterval(sortToppings, 1000);

    function sortToppings() {
        // Look for a toppings container. If it's not there, we just bail out.
        try {
            var toppingsContainer = document.getElementsByClassName("toppings");
        }
        catch(err) {
            return;
        }
        if(typeof toppingsContainer != 'undefined') {
            // Same with the list of toppings. This had to be selected as a sub-item of the toppings container, otherwise we would get unwanted elements such as the pizza size selection.
            try {
                var toppingsListContainer = toppingsContainer[0].getElementsByClassName("topping__options js-topping-options");
            }
            catch(err) {
                return;
            }

            // There may be more than one list of toppings, so we loop over them
            for(var x = 0; x < toppingsListContainer.length; x++) {
                var children = toppingsListContainer[x].children;
                var childArr = [];

                for (var i in children) {
                    if (children[i].nodeType == 1) { // get rid of the whitespace text nodes
                        childArr.push(children[i]);
                    }
                }

                var unsortedChildArr = childArr.slice(); // for later comparison

                childArr.sort(function(a, b) {
                    if(typeof a == 'undefined'){
                        return -1;
                    }
                    if(typeof b == 'undefined'){
                        return 1;
                    }
                    try {
                        var aText = a.textContent;
                        aText = aText.trim();
                    }
                    catch(err){
                        return -1;
                    }
                    try {
                        var bText = b.textContent;
                        bText = bText.trim();
                    }
                    catch(err) {
                        return 1;
                    }

                    if(aText > bText) {
                        return 1;
                    }
                    if(aText < bText) {
                        return -1;
                    }
                    return 0;

                });

                // Compare the sorted array with the unsorted to see if the elements are already in order
                var sorted = true;
                for (i = 0; i < childArr.length; ++i) {
                    if(childArr[i] != unsortedChildArr[i]) {
                       sorted = false;
                    }
                }

                // Place all toppings in new order
                if(!sorted) {
                    for (i = 0; i < childArr.length; ++i) {
                        toppingsListContainer[x].appendChild(childArr[i]);
                    }
                }
            }
        }
    }
})();
