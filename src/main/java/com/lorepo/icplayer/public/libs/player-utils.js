/**
 * @module PlayerUtils
 */
(function (window) {
    /**
     Player utils
     @class PlayerUtils
     */

        // Expose utils to the global object
    window.PlayerUtils = function (playerObject) {

        if (playerObject.hasOwnProperty("getPlayerServices")) {
            this.player = playerObject;
            this.playerServices = playerObject.getPlayerServices();
            this.scoreService = this.playerServices.getScore();
        }
    };

    /**
     Returns Presentation object
     @method getPresentation

     @return {Object} current presentation
     */
    window.PlayerUtils.prototype.getPresentation = function getPresentation() {
        if (this.hasOwnProperty("playerServices")) {
            return this.playerServices.getPresentation();
        }
        else {
            return undefined;
        }
    };

    /**
     Returns Presentation object

     @param {Object} presentation current presentation object

     @method getPresentation

     @return {Object} returns current presentation score (min, max, raw and scaled), errors count and checks count
     */
    window.PlayerUtils.prototype.getPresentationScore = function (presentation) {
        if (this.hasOwnProperty("scoreService")) {
            var sumOfScore = 0.0, sumOfErrors = 0, sumOfChecks = 0,
                sumOfMaxScore = 0.0,
                sumOfScaledScore = 0.0,
                count = 0, i, page, score;

            for (i = 0; i < presentation.getPageCount(); i++) {
                page = presentation.getPage(i);

                if (page.isReportable()) {
                    score = this.scoreService.getPageScore(page.getName());

                    if (score.maxScore > 0) {
                        sumOfScaledScore += score.score / score.maxScore;
                    } else {
                        sumOfScaledScore += 1;
                    }
                    sumOfScore += score.score;
                    sumOfErrors += score.mistakeCount;
                    sumOfChecks += score.checkCount;
                    sumOfMaxScore += score.maxScore;

                    count += 1;
                }
            }

            return {
                minScore: 0,
                maxScore: sumOfMaxScore,
                rawScore: sumOfScore,
                scaledScore: count ? sumOfScaledScore / count : 0,
                errorsCount: sumOfErrors,
                checksCount: sumOfChecks
            }
        }
        else {
            return undefined;
        }
    };
})(window);