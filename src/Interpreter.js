/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.actionHandler", {
        gradeNames: "fluid.component",
        invokers: {
            handleAction: "fluid.notImplemented"
            // Params: interpreter
        }
    });

    fluid.defaults("c2lc.interpreter", {
        gradeNames: "fluid.modelComponent",
        actions: {},
        model: {
            program: [],
            programCounter: 0
        },
        invokers: {
            reset: {
                funcName: "c2lc.interpreter.reset",
                args: "{that}"
            },
            step: {
                funcName: "c2lc.interpreter.step",
                args: "{that}"
            }
        },
        events: {
            onStart: null
        },
        modelListeners: {
            program: {
                func: "{that}.reset"
            }
        }
    });

    c2lc.interpreter.reset = function (interpreter) {
        interpreter.applier.change("programCounter", 0);
    };

    c2lc.interpreter.step = function (interpreter) {
        if (interpreter.model.programCounter < interpreter.model.program.length) {
            if (interpreter.model.programCounter === 0) {
                interpreter.events.onStart.fire();
            }
            var action = interpreter.model.program[interpreter.model.programCounter];
            var actionHandler = interpreter.options.actions[action];
            if (actionHandler) {
                actionHandler.handleAction(interpreter);
                interpreter.applier.change("programCounter", interpreter.model.programCounter + 1);
            } else {
                throw new Error("Unknown action: " + action);
            }
        }
    };

})();
