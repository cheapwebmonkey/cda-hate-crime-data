/* jshint node: true */

'use strict';
process.env.UV_THREADPOOL_SIZE = 128;
var Alexa = require('alexa-sdk');
var Request = require("request");
var APP_ID = 'addappidhere';
var HATECRIMES = 0;
var CRIMETYPE = 0;
var jsonContent = {};

var languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Louisvlle Hate Crime Data',
            HELP_MESSAGE: 'You can ask for the hate crimes in Louisville and for the crime type of hate crime in Louisville.',
            HELP_REPROMPT: 'You can ask for the hate crimes in Louisville and for the crime type of hate crime in Louisville.',
            STOP_MESSAGE: 'Thank you for using Louisville Hate Crime data . Be good to each other.',
            ERROR_MESSAGE: 'I am sorry, I cannot access the Louisville Hate Crime data right now.'
        },
    }
};

exports.handler = function(event, context, callback) {
    var alexa = new Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute(event, context);

};

var handlers = {
    'LaunchRequest': function() {
        var self = this;

        Request('http://csvjsonapi.azurewebsites.net/api/static/hatecrimecsv', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                jsonContent = JSON.parse(body);
                HATECRIMES = jsonContent.HATECRIMES;
                CRIMETYPE = jsonContent.CRIMETYPE;

          }
            else {
                self.emit('ErrorIntent');
            }
        });
        this.emit('AMAZON.HelpIntent');
    },

    'GethateCrimeIntent': function() {
        var self = this;

                if (HATECRIMES >= 0)

                    self.emit( ':ask', 'The hate crimes are ' + HATECRIMES + '.',this.t('HELP_MESSAGE'));

             else {
                self.emit('ErrorIntent');
            }

    },


    'GetActualMoveOutIntent': function() {
        var self = this;
                if (MOVEOUTS >= 0)
                    self.emit(':ask', 'The move outs, month to date, are ' + MOVEOUTS + '.',this.t('HELP_MESSAGE'));

                else if  (MOVEOUTS <= 0)

                    self.emit( ':ask', 'The move outs, month to date, are ' + Math.abs(MOVEOUTS) + '.',this.t('HELP_MESSAGE'));

             else {
                self.emit('ErrorIntent');
            }
    },

    'Unhandled': function() {
            this.emit('AMAZON.HelpIntent');
    },

    'ErrorIntent': function() {
        this.emit(':ask', this.t('ERROR_MESSAGE'));
    },

    'AMAZON.HelpIntent': function() {
        var speechOutput = this.t('HELP_MESSAGE');
        var reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },

    'AMAZON.StopIntent': function() {
        var speechOutput = this.t('STOP_MESSAGE');
        this.emit(':tell', speechOutput);
    },

    'AMAZON.CancelIntent': function() {
        var speechOutput = this.t('STOP_MESSAGE');
        this.emit(':tell', speechOutput);
    }

};
