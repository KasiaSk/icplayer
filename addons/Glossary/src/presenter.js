function AddonGlossary_create(){
    var presenter = function() {};
    presenter.$ICPage = null;
    presenter.lastReceivedEvent = null;
    presenter.isPinchZoom = false;

    var playerController;
    var eventBus;

    presenter.ERROR_MESSAGES = {
        UNIQUE_ID: "Id of each word must be unique."
    };

    presenter.addTitle = function(element, title) {
        $(element).attr('title', title);
    };

    presenter.addDescription = function(element, description) {
        $(element).html(description);
    };

    presenter.updateLaTeX = function(text) {
        var div = MathJax.HTML.Element("div", {id: "MathDiv"}, [text] );
        var math = MathJax.Hub.getAllJax(div)[0];
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);
    };

    presenter.validateModel = function(model) {
        var validated = true;
        var idList = [];
        for(var i = 0; i < model["List of words"].length; i++) {
            var id = model["List of words"][i]["ID"];
            if(idList.indexOf(id) >= 0) { // check if id already exist in model
                validated = false;
                break;
            }
            idList[i] = id;
        }
        return validated;
    };

    presenter.setDisplay = function(element, display) {
        var currentDisplay = $(element).css('display') === 'block';
        if (currentDisplay != display) {
            $(element).css({
                "display":"block",
                "width":"95%",
                "height":"90%"
            });
        }
    };

    presenter.getDialogDataById = function(words, wordID) {
        for(var i = 0; i < words.length; i++) {
            if(words[i].ID == wordID) {
                return {
                    title: words[i].Text,
                    description: words[i].Description
                };
            }
        }

        return undefined;
    };

    presenter.findICPage = function () {
        presenter.$ICPage = $(presenter.$view.parent('.ic_page:first')[0]);
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_popup_page:first')[0]);
        }
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_header:first')[0]);
        }
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_footer:first')[0]);
        }
    };

    presenter.openDialogEventHandler = function(event, ui) {
        var $dialog  = $(event.target).closest('.ui-dialog');
        var presentationPosition = $(presenter.$ICPage).offset();
        var presentationWidth = $(presenter.$ICPage).outerWidth();
        var presentationHeight = $(presenter.$ICPage).outerHeight();
        var dialogWidth = $dialog.outerWidth();
        var dialogHeight = $dialog.outerHeight();

        var windowHeight = $(top.window).height();
        var scrollTop = $(top.window).scrollTop();
        var previewFrame = 0;
        var popupTop = 0;
        var popupLeft = 0;
        var topPosition = 0;
        var dialogTop = 0;

        var isPreview = $(".gwt-DialogBox").is('.gwt-DialogBox');
        var isPopup =  $(presenter.$ICPage).is('.ic_popup_page');

        if (isPreview) {
            scrollTop = $(presenter.$ICPage).scrollTop();
            if (scrollTop > 0)
                previewFrame = $(presenter.$ICPage).parent().parent().parent().offset().top - $(".gwt-DialogBox").offset().top;
            windowHeight = ($(presenter.$ICPage).parent().parent().parent().height());
            presentationPosition.top = 0;
        }

        if (isPopup) {
            scrollTop = $(presenter.$ICPage).scrollTop();
            popupTop =  presentationPosition.top;
            if ($(top.window).scrollTop() > 0) presentationPosition.top = 0;
        }

        var visibleArea = presenter.estimateVisibleArea(presentationPosition.top, presentationHeight, scrollTop, windowHeight);
        var availableHeight = visibleArea.bottom - visibleArea.top;

        if (dialogHeight >= availableHeight) {
            dialogHeight = presenter.calculateReducedDialogHeight($dialog, availableHeight);
            $dialog.css({
                height: dialogHeight + 'px'
            });
        }

        if (isPopup || isPreview) {
            popupLeft = presentationPosition.left;
            topPosition = parseInt((availableHeight - dialogHeight) / 2, 10);
        }
        else {
            topPosition = parseInt((windowHeight - dialogHeight) / 2, 10) ;
        }

        var presentationHorizontalOffset = parseInt((presentationWidth - dialogWidth) / 2, 10);
        var leftPosition = presentationPosition.left + presentationHorizontalOffset;

        // adjust top position if Player was embedded in iframe (i.e. EverTeach)
        if (window !== top.window) {
            var iframe = window.parent.document.getElementsByTagName('iframe');
            var offset = parseInt($(iframe).offset().top, 10);
            var iframeDialogHeight = parseInt($dialog.height(), 10);
            iframeDialogHeight += DOMOperationsUtils.calculateOuterDistances(DOMOperationsUtils.getOuterDimensions($dialog)).vertical;

            topPosition -= offset - scrollTop;

            if (topPosition < 0) {
                topPosition = 0;
            } else if (topPosition > $(window).height() - iframeDialogHeight) {
                topPosition = $(window).height() - iframeDialogHeight;
            }
        }
        if ($(window).scrollTop() > popupTop && isPopup) {
            topPosition += ($(window).scrollTop() - popupTop);
        }
        dialogTop = (topPosition + scrollTop + previewFrame);

        $dialog.css({
            left: (leftPosition - popupLeft) + 'px',
            top: (dialogTop) + 'px',
            'font-size': '18px',
            'font-family': 'Trebuchet MS, Tahoma, Verdana, Arial, sans-serif'
        });
        $dialog.find('.ui-dialog-content').css({
            color: 'black'
        });

        if(isPopup || isPreview) {
            // For Preview and Popup dialog is moved to appropriate page
            var $overlay = $(".ui-widget-overlay");
            $(presenter.$view.closest(".ui-widget-overlay")).remove();
            if (isPreview) {
                $(".ic_page_panel").children(".ic_page").children().last().after($overlay);
            }
            else {
                $dialog.before($overlay);
            }
        }

        // due to the inability to close the dialog, when any video is under close button
        var videos = presenter.$ICPage.find('video');
        $.each(videos, function(){
            $(this).removeAttr('controls');
        });

    };

    presenter.closeDialogEventHandler = function() {
        // due to the inability to close the dialog, when any video is under close button
        var videos = presenter.$ICPage.find('video');
        $.each(videos, function(){
            $(this).attr('controls', 'controls');
        });
        presenter.dialog.css("maxHeight", "none");
    };

    presenter.show = function(id) {
        // due to event propagation player issue, it's necessary to make sure page with glossary still exist.
        var pageClass = "." + $(presenter.$ICPage).attr('class').split(' ').join('.');
        if (!$(pageClass).length > 0) {
            return
        }

        var dialog = presenter.dialog;
        var dialogData = presenter.getDialogDataById(presenter.model["List of words"], id);
        // don't display dialog if glossary hasn't needed ID
        if (!dialogData) return;

        dialog.dialog("option", "title", dialogData.title);
        presenter.addDescription(dialog, dialogData.description);
        dialog.dialog("open");
        presenter.updateLaTeX(dialogData.description);
    };

    presenter.initializeView = function(view, model) {
        presenter.model = model;
        presenter.$view = $(view);
        presenter.findICPage();
        presenter.title = "";
        presenter.description = "";


        var dialog = presenter.$view.find(".modal-dialog");
        dialog.dialog({
            modal: true,
            autoOpen: false,
            draggable: false,
            width: model.Width,
            minHeight: 'auto',
            resizable: false,
            open: presenter.openDialogEventHandler,
            close: presenter.closeDialogEventHandler
        });

        var $popup = $('#icplayer').parent().find('.ic_popup');
        var dialogWidget = dialog.dialog("widget");
        outsideView = presenter.$view;
        outsideView.css({'display': 'block',
                        'width': 0,
                        'height': 0,
                        'position': 'static'
                        });
        outsideView.append(dialogWidget);
        if ($popup.is('.ic_popup') && presenter.$view.parent().is('.ic_popup_page')) {
            // Dialog must be placed in popup page
            $popup.children().last().after(outsideView);
        }
        else if ($(".gwt-DialogBox").is('.gwt-DialogBox') ) {
            // Dialog must be placed in preview page
            $(".ic_page_panel").children(".ic_page").children().last().after(outsideView);
        }
        else {
            // Dialog must be placed outside Player so that position:absolute wouldn't be suppressed by Player's overflow:hidden
            $('#icplayer').after(outsideView);
        }
        presenter.dialog = dialog;
        presenter.$view = outsideView;
    };

    presenter.calculateReducedDialogHeight = function($dialog, pageHeight) {
        var titleHeight = $dialog.find(".ui-dialog-titlebar").outerHeight();
        var padding = parseInt($dialog.css("padding-top")) + parseInt($dialog.css("padding-bottom"));

        var $content = $dialog.find('.ui-dialog-content');
        var contentPadding = parseInt($content.css('paddingTop'), 10) + parseInt($content.css('paddingBottom'), 10);
        var contentBorder = parseInt($content.css('borderTopWidth'), 10) + parseInt($content.css('borderBottomWidth'), 10);
        var contentMargin = parseInt($content.css('marginTop'), 10) + parseInt($content.css('marginBottom'), 10);

        return pageHeight - padding - titleHeight - contentPadding - contentBorder - contentMargin;
    };

    presenter.estimateVisibleArea = function(presentationTop, presentationHeight, scrollTop, windowHeight) {
        var borders = {
            top: presentationTop,
            bottom: presentationTop + presentationHeight
        };

        if (presentationTop < scrollTop) {
            borders.top = scrollTop;
        }

        if (presentationTop + presentationHeight > scrollTop + windowHeight) {
            borders.bottom = scrollTop + windowHeight;
        }

        return borders;
    };

    presenter.createPreview = function(view, model) {
        var validated = presenter.validateModel(model);
        if(validated) {
            var dialog = $(view).find(".modal-dialog");
            var visible = ModelValidationUtils.validateBoolean(model["Visible"]);
            var title = model["List of words"][0]["Text"];
            var description = model["List of words"][0]["Description"];

            presenter.addTitle(dialog, title);
            presenter.addDescription(dialog, description);

            dialog.dialog({
                modal: false,
                autoOpen: false,
                zIndex : 0,
                stack: false,
                draggable: false,
                width: model.Width,
                resizable: false
            });

            var preview = dialog.dialog("widget");
            presenter.setDisplay(preview, visible);

            $(view).append(preview);
        } else {
            $(view).html(presenter.ERROR_MESSAGES["UNIQUE_ID"]);
        }
    };

    presenter.showCommand = function (params) {
        presenter.show(params[0]);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.showCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.onEventReceived = function(eventName, eventData) {
        presenter.show(eventData.word);
    };

    function areTwoFingersOnTheScreen(event) {
        return !!(event.originalEvent.touches.length >= 2);
    }

    function isTap(event) {
        return presenter.lastReceivedEvent == "touchstart"
            && event.type == "touchend"
            && !presenter.isPinchZoom;
    }

    presenter.shouldCloseDialog = function(event) {
        if(event.type == "click" || isTap(event)) return true;

        if(areTwoFingersOnTheScreen(event)) {
            this.isPinchZoom = true;
            return false;
        }

        this.isPinchZoom = false;
        this.lastReceivedEvent = event.type;
        return false;
    };

    function bindEvents() {
        $(".ui-widget-overlay").live("click touchstart touchend touchmove", function(event){
            if(presenter.shouldCloseDialog(event)){
                presenter.dialog.dialog("close");
            }
        });
    }

    presenter.run = function(view, model){
        presenter.initializeView(view, model);
        eventBus = playerController.getEventBus();
        eventBus.addEventListener('Definition', this);
        bindEvents();
    };

    return presenter;
}