package com.lorepo.icplayer.client.page.mockup;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;

public class ModuleModelMockup implements IModuleModel {
	
	private String buttonType = "";
	private String moduleTypeName = "";

	@Override
	public void addStyleListener(IStyleListener listener) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getInlineStyle() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getStyleClass() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setInlineStyle(String inlineStyle) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setStyleClass(String styleClass) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getClassNamePrefix() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ILayoutDefinition getLayout() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getLeft() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getRight() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getTop() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getBottom() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getWidth() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getHeight() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void setLeft(int left) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setRight(int left) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setTop(int top) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setBottom(int top) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setWidth(int width) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setHeight(int height) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void disableChangeEvent(boolean disable) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getProviderName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addPropertyListener(IPropertyListener listener) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void removePropertyListener(IPropertyListener listener) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public int getPropertyCount() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public IProperty getProperty(int index) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getModuleTypeName() {
		return moduleTypeName;
	}
	
	public void setModuleTypeName(String moduleTypeName) {
		this.moduleTypeName = moduleTypeName;
	}

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setId(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void release() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void load(Element node, String baseUrl) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String toXML() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addNameValidator(INameValidator validator) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean isLocked() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void lock(boolean state) {
		// TODO Auto-generated method stub
		
	}
	
	public void setButtonType (String buttonType) {
		this.buttonType = buttonType;
	}

	@Override
	public String getButtonType() {
		return buttonType;
	}

}