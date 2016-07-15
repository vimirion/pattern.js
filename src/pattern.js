(function(){
    var VALIDATION_CLASS = 'input';

    document.addEventListener('input', function(e) {
        var tagName = e.target.tagName;

        if(['INPUT', 'TEXTAREA'].indexOf(tagName) !== -1 && e.target.classList.contains(VALIDATION_CLASS)) {
            // console.dir(e.target);
            // debugger;

            var pattern = getPattern(e.target),
                type =  e.target.type;

            var errorSelector = getAttributeVal(e.target, 'data-pattern-error-selector'),
                targetSelector = getAttributeVal(e.target, 'data-pattern-target');

            if (pattern) {
                if (e.target.value.match(prepareRegex(pattern))) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                    if (errorSelector) {
                        document.querySelector('.' + errorSelector).style.display = 'none';
                    }
                    if (targetSelector) {
                        document.querySelector('.' + targetSelector).disabled = false;
                    }
                } else {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                    if (errorSelector) {
                        document.querySelector('.' + errorSelector).style.display = 'block';
                    }
                    if (targetSelector) {
                        document.querySelector('.' + targetSelector).disabled = true;
                    }
                }
            }
        }
    });

    document.querySelector('.submit').addEventListener('click', function(e) {
        e.preventDefault();
        var newDiv = document.createElement("div");
        document.querySelector('.pv-form').insertBefore(newDiv, this);
    });

    //https://addyosmani.com/blog/mutation-observers/

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation);
      });
    });

    // configuration of the observer:
    var config = { childList: true };

    // pass in the target node, as well as the observer options
    observer.observe(document.body, config);

    function toCamelCase(attrName) {
        var wordsArr = attrName.split('-'),
            result = "";

        for(var i = 0; i < wordsArr.length; i ++) {
            if (i === 0) continue;
            result += wordsArr[i].charAt(0).toUpperCase() + wordsArr.slice(1);
        }
        return result;
    }

    function toDatasetName(attrName) {
        var camelCased = toCamelCase(attrName);
        if (camelCased.indexOf('data-') === 0) {
            return camelCased.slice(4);
        }
    }

    function getAttributeVal(node, attrName) {
        if (node) {
            var pattern,
                dataSetName = toDatasetName(attrName);
            if (node.dataset && dataSetName && node.dataset[dataSetName]) {
                pattern = node.dataset[dataSetName]
            } else {
                for(var i = 0; i < node.attributes.length; i++) {
                    var item = node.attributes[i];
                    if (item.name === attrName ||
                        item.nodeName === attrName &&
                        item.nodeValue) {
                        pattern = item.nodeValue;
                        break;
                    }
                }
            }

            return pattern;
        }
    }

    function getPattern(node) {
        if (node) {
            var pattern = getAttributeVal(node, 'data-pattern');
            // Last chance - Html5 attribute for some tags
            if (!pattern) {
                if (node.pattern) {
                    pattern = node.pattern;
                }
            }
            return pattern;
        }
    }

    function prepareRegex(pattern) {
        var newPattern = pattern;
        if (pattern) {
            if ([0, 1].indexOf(pattern.indexOf('^')) === -1) {
                newPattern = '^' + pattern;
            }
            if ([newPattern.length - 1, newPattern.length - 2].indexOf(newPattern.indexOf('$')) === -1) {
                newPattern = newPattern + '$';
            }
        }
        // console.dir(newPattern);
        return newPattern;
    }
})();
