TestCase("Reset logic", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'redrawValueContainers');
        sinon.stub(this.presenter, 'setWorkMode');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.redrawValueContainers.restore();
        this.presenter.setWorkMode.restore();
    },

    'test reset to visible': function () {
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.redrawValueContainers.calledOnce);
        assertTrue(this.presenter.setWorkMode.calledOnce);
    },

    'test reset to invisible': function () {
        this.presenter.configuration.isVisibleByDefault = false;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.redrawValueContainers.calledOnce);
        assertTrue(this.presenter.setWorkMode.calledOnce);
    }
});