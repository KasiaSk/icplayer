TestCase("[Video] Model validation", {
    setUp: function () {
        this.presenter = Addonvideo_create();

        this.model = {
            Width: "20",
            Height: "22",
            ID: "someAddon",
            "Is Visible": "True",
            "Hide subtitles": "False",
            'Hide default controls': "True",
            Files: [{
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": "True",
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "and another path"
            }, {
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": "False",
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "that should be something different"
            }]
        }
    },

    'test model return value should be the same as input value': function () {
        var expected = {
            isValid: true,
            addonSize: {
                width: 20,
                height: 22
            },
            addonID: "someAddon",
            isVisibleByDefault: true,
            shouldHideSubtitles: false,
            defaultControls: false,
            files: [{
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": true,
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "and another path"
            }, {
                Poster: "ok",
                Subtitles: "okdaokdoa",
                ID: "some id",
                "Loop video": false,
                "WebM video": "some path",
                "MP4 video": "else path",
                "Ogg video": "that should be something different"
            }],
            height: 22
        };

        var result = this.presenter.validateModel(this.model);

        assertEquals(expected, result);
    }
});