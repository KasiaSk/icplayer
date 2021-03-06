package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.api.IPresenter;


/**
 * This interface is accessible by modules and outside of the player
 */
public interface IPlayerServices {

	public IContent getModel();
	public EventBus	getEventBus();
	public int getCurrentPageIndex();
	public IPlayerCommands	getCommands();
	public IScoreService	getScoreService();
	public IStateService 	getStateService();
	public IJsonServices	getJsonServices();
	public JavaScriptObject getAsJSObject();
	public IPresenter getModule(String moduleName);
	public boolean isBookMode();
	public boolean hasCover();
	public void sendAnalytics(String event, HashMap<String,String> params);
}
