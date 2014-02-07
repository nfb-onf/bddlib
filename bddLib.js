/*global casper */

/**
* This is the description for EducationInformation factory.
*
* @namespace stepBuilder
* @return {object}
*/

var bddConfig = {
    timeout: 5000
}

/**
 * Create oh the step should be handle with casper
 *
 * return list of function that return a callable that will be called later on by casperjs
 */
var stepBuilder = {
    /**
    * return a function that will create a casper.waitForSelector
    *
    * @func capture
    * @memberof stepBuilder
    * @param {string} scenarioName
    * @param {int} seq - step number in scenario
    * @param {string} message
    */
    capture: function (scenarioName, seq, message) {
      var cleanMessage = message.replace(/'/g, '')
                                .replace(/\[/g, '')
                                .replace(/\]/g, '')
                                .replace(/"/g, '')
                                .replace(/\//g, '');
      casper.capture("./capture/" + scenarioName + "/" + seq + "-" + cleanMessage + ".png");
    },
    /**
    * return a function that will create a casper.waitForSelector
    *
    * @func waitForSelector
    * @memberof stepBuilder
    * @param {string} message
    * @param {string} givenSelector - selector in css or xpath
    * @param {function} thenFun - execute when selector is founded
    * @param {string} optionalMessage - an optional message to print to the console
    */
    waitForSelector: function (message, givenSelector, thenFun, optionalMessage) {
      return function (scenarioName, seq) {
        casper.waitForSelector(
          givenSelector,
          function () {
            if (thenFun) {
              try {
                thenFun();
                casper.test.pass(message);
              } catch (err) {
                casper.test.fail(message);
                casper.echo("Error: " + err, "ERROR");
              }
            } else {
              casper.test.pass(message);
            }
            if (optionalMessage){
              casper.echo(optionalMessage);
            }
          },
          function () {
            casper.test.fail(message);
            casper.echo("Timeout", 'WARNING');
          },
          bddConfig.timeout
         );
        casper.then(function () {
          stepBuilder.capture(scenarioName, seq, message);
        });
      };
    },
    /**
     * Return a function that will create a casper.waitForUrl.
     * Requires CasperJS version 1.1
     *
     * @func waitForUrl
     * @memberof stepBuilder
     * @param {string} message
     * @param {string} url - string or regex
     * @param {function} thenFun - execute when url is founded
     */
    waitForUrl: function (message, url, thenFun) {
       return function (scenarioName, seq) {
         casper.waitForUrl(
             url,
           function () {
             if (thenFun) {
               try {
                 thenFun();
                 casper.test.pass(message);
               } catch (err) {
                 casper.test.fail(message);
                 casper.echo("Error: " + err, "ERROR");
               }
             } else {
               casper.test.pass(message);
             }
           },
           function () {
             casper.test.fail(message);
             casper.echo("Timeout", 'WARNING');
           },
           5000
          );
         casper.then(function () {
           stepBuilder.capture(scenarioName, seq, message);
         });
       };
     },
    /**
    * return a function that will create a casper.waitForText
    *
    * @func waitForText
    * @memberof stepBuilder
    * @param {string} message
    * @param {string} givenText - plain text to find in html
    * @param {function} thenFun - execute when selector is founded
    */
    waitForText: function (message, givenText, thenFun) {
      return function (scenarioName, seq) {
        casper.waitForText(
          givenText,
          function () {
            if (thenFun) {
              try {
                thenFun();
                casper.test.pass(message);
              } catch (err) {
                casper.test.fail(message);
                casper.echo("Error: " + err, "ERROR");
              }
            } else {
              casper.test.pass(message);
            }
          },
          function () {
            casper.test.fail(message);
            casper.echo("Timeout", 'WARNING');
          },
          bddConfig.timeout
        );
        casper.then(function () {
          stepBuilder.capture(scenarioName, seq, message);
        });
      };
    },
    /**
    * waitUnitlVisible make sure the elements even if present in  the
    * DOM, is made visible with ngShow or other css flag
    * return a function that will create a casper.waitUntilVisible
    *
    * @func waitForText
    * @memberof stepBuilder
    * @param {string} message
    * @param {string} givenText - plain text to find in html
    * @param {function} thenFun - execute when selector is founded
    */
    waitUntilVisible: function (message, givenText, thenFun) {
      return function (scenarioName, seq) {
        casper.waitUntilVisible(
          givenText,
          function () {
            if (thenFun) {
              try {
                thenFun();
                casper.test.pass(message);
              } catch (err) {
                casper.test.fail(message);
                casper.echo("Error: " + err, "ERROR");
              }
            } else {
              casper.test.pass(message);
            }
          },
          function () {
            casper.test.fail(message);
            casper.echo("Timeout", 'WARNING');
          },
          bddConfig.timeout
        );
        casper.then(function () {
          stepBuilder.capture(scenarioName, seq, message);
        });
      };
    },
    /**
    * return a function that will create a casper.then
    *
    * @func noWait
    * @memberof stepBuilder
    * @param {string} message
    * @param {function} func - casper function to run
    */
    noWait: function (message, func) {
      return function (scenarioName, seq) {
        casper.then(function () {
          func();
          stepBuilder.capture(scenarioName, seq, message);
        });
      };
    }
  }

/**
* This contain all action than can be pass to bdd steps
*
* @namespace stepActions
* @return {object}
*/
var stepActions = {
    /**
    * Validate if a selector is found on a page
    *
    * @func am
    * @memberof stepActions
    * @param {string} message
    * @param {string} selector - selector in css or xpath
    */
    am: function (message, selector) {
      var combinedMessage = "I am " + message;
      return function (prepend) {
        return stepBuilder.waitForSelector(prepend + " " + combinedMessage, selector);
      };
    },
    /**
     * Validate if a certain page is reached.
     * The selector is the url and can be a string or regex.
     *
     * @func reached
     * @memberof stepActions
     * @param {string} message
     * @param {string} selector - url as a string or regex
     */
     reached: function (message, selector) {
       var combinedMessage = "I reached " + message;
       return function (prepend) {
         return stepBuilder.waitForUrl(prepend + " " + combinedMessage, selector);
       };
     },
    /**
    * Validate if a form is present and then fill it out
    *
    * @func fill
    * @memberof stepActions
    * @param {string} message
    * @param {string} selector - selector in css or xpath
    * @param {object} formDate - object containing form information
    * @param {bool} autoPost - if the post should be automaticaly submit
    */
    fill: function (message, selector, formData, autoPost) {
      var optMsg = "";
      if (Object.keys(formData).length > 0) {
        for (var field in formData) {
          optMsg += optMsg.length > 0 ? "\n" : "";
          optMsg += "\t" + field + ": " + formData[field];
        }
      }
      var combinedMessage = "I fill " + message;
      var willAutoPost = (autoPost === true || autoPost === undefined) ? true : false;
      return function (prepend) {
        return stepBuilder.waitForSelector(prepend + " " + combinedMessage, selector, function () {
          casper.fill(selector, formData, willAutoPost);
        },
        optMsg);
      };
    },
    /**
    * click on a dom elements
    *
    * @method click
    * @memberof stepActions
    * @param {string} message
    * @param {string} selector - selector in css or xpath
    */
    click: function (message, selector) {
      var combinedMessage = "I click " + message;
      return function (prepend) {
        return stepBuilder.waitForSelector(prepend + " " + combinedMessage, selector, function () {
          casper.click(selector);
        });
      };
    },
    /**
    * clickTheLabel on text label inside an <a> elements
    *
    * @method clickTheLabel
    * @memberof stepActions
    * @param {string} label - text to click on
    */
    clickTheLabel: function (label) {
      var message = "I click on label name " + label;
      return function (prepend) {
        return stepBuilder.waitForText(prepend + " " + message, label, function () {
          casper.clickLabel(label, "a");
        });
      };
    },
    /**
    * Find a dom element
    *
    * @method find
    * @memberof stepActions
    * @param {string} message
    * @param {string} selector - selector in css or xpath
    */
    findTheVisible: function (message, selector) {
      var combinedMessage = "I find " + message;
      return function (prepend) {
        return stepBuilder.waitUntilVisible(prepend + " " + combinedMessage, selector);
      };
    },
    find: function (message, selector) {
      var combinedMessage = "I find " + message;
      return function (prepend) {
        return stepBuilder.waitForSelector(prepend + " " + combinedMessage, selector);
      };
    },
    /**
    * Go to a web page
    *
    * @method goTo
    * @memberof stepActions
    * @param {string} message
    * @param {string} url - url of the web page
    */
    goTo: function (message, url) {
      var combinedMessage = "I go to " + message;
      return function (prepend) {
        return stepBuilder.noWait(prepend + " " + combinedMessage, function () {
          casper.open(url);
        });
      };
    },
    /**
    * Look if text is visible
    *
    * @method see
    * @memberof stepActions
    * @param {string} message
    * @param {string} text - text the user should see on the page
    */
    see: function (message, text) {
      var combinedMessage = "I see " + message;
      return function (prepend) {
        return stepBuilder.waitForText(prepend + " " + combinedMessage, text);
      };
    },
    canSee: function (message, text) {
      var combinedMessage = "I see " + message;
      return function (prepend) {
        return stepBuilder.waitUntilVisible(prepend + " " + combinedMessage, text);
      };
    },
    /**
    * Look if text isn't present
    *
    * @method shouldNotSee
    * @memberof stepActions
    * @param {string} message
    * @param {string} text - text the user should NOT see on the page
    */
    shouldNotSee: function (message, text) {
      var combinedMessage = "I should not see " + message;
      return function (prepend) {
        var fullMessage = prepend + " " + combinedMessage;
        return stepBuilder.noWait(fullMessage, function () {
          casper.test.assertTextDoesntExist(text, fullMessage);
        });
      };
    },
    /**
    * Look if selector isn't visible
    *
    * @method cannotFindThe
    * @memberof stepActions
    * @param {string} message
    * @param {string} selector - selector the user should NOT see on the page
    */
    cannotFindThe: function (message, selector) {
      var combinedMessage = "I cannot find the selector " + message;
      return function (prepend) {
        var fullMessage = prepend + " " + combinedMessage;
        return stepBuilder.noWait(fullMessage, function () {
          casper.test.assertNotVisible(selector, fullMessage);
        });
      };
    },
    /**
    * test equality when selector is found
    *
    * @method seeTheValueOf
    * @memberof stepActions
    * @param {string} message
    * @param {string} selector - selector in css or xpath
    */
    seeTheValueOf: function (message, selector) {
      var combinedMessage = "I see the value of " + message;
      return {
        is: function (expectedValue) {
          return function (prepend) {
            return stepBuilder.waitForSelector(prepend + " " + combinedMessage + " is '" + expectedValue + "'",
                                         selector, function () {
              if (typeof(expectedValue) !== 'string') {
                casper.warn("Warning: The value specified is not a string, the following assertion may not work");
              }
              var found = casper.fetchText(selector);
              if (found !== expectedValue) {
                throw "Expected " + expectedValue + " but got " + found;
              }
            });
          };
        }
      };
    },
    noteDown: function (message, selector, attribute, storeVariable) {
      var combinedMessage = "I note down " + message;
      return function (prepend) {
        var fullMessage = prepend + " " + combinedMessage;
        return stepBuilder.noWait(fullMessage, function () {
          //casper.test.assertTextDoesntExist(text, fullMessage);
          var value = null;
          if(casper.exists(selector)){
            value = casper.getElementAttribute(selector, attribute);
            casper.test.pass(combinedMessage)
            casper.echo("I noted: " + value);
            storeVariable[message] = value;
          } else {
            casper.test.fail(combinedMessage)
            casper.echo("Did not find '" + message + "', using selector: " + selector);
          }
        });
      };
    }
  };

/**
* Return an object containing the scenario builder function
*
* @namespace bddLib
* @return {object}
*/
var bddLib = {
  /**
  * Keeps all scenarios for playback
  *
  * @member ScenarioList
  * @memberof bddLib
  */
  ScenarioList: {},
  /**
  * look up the scenario list and register the steps to be executed by casper
  *
  * @method dependsOn
  * @memberof bddLib
  * @param {string} scenarioName
  */
  dependsOn: function (scenarioName) {
    "use strict";

    var scenario = bddLib.ScenarioList[scenarioName];
    for (var i = 0, arglength = scenario.steps.length; i < arglength; i++) {
      scenario.steps[i](scenarioName, i);
    }
  },
  /**
  * Create a scenario
  *
  * @method scenario
  * @memberof bddLib
  * @param {string} scenarioName
  */
  scenario: function (scenarioName) {
    bddLib.ScenarioList[scenarioName] = {
      name: scenarioName,
      steps: [function () {
        casper.then(function () {
          casper.echo("");
          casper.echo("Scenario: " + scenarioName, "INFO_BAR");
        });
      }]
    };

    for (var i = 1, arglength = arguments.length; i < arglength; i++) {
      bddLib.ScenarioList[scenarioName].steps.push(arguments[i]);
    }
    bddLib.dependsOn(scenarioName);
  },
  /**
  * To create one or many scenario, automaticaly scedule the launch
  *
  * @method scenarios
  * @memberof bddLib
  * @return {joy}
  */
  scenarios: function (testSite, func) {
    "use strict";

    var given = function (action) {
      return action("Given");
    };

    var when = function (action) {
      return action("When");
    };

    var and = function (action) {
      return action("And");
    };

    var then = function (action) {
      return action("Then");
    };

    casper.start(testSite);
    func(stepActions, given, when, and, then);
    casper.run(function () {
      this.test.done();
    });
  }
}
