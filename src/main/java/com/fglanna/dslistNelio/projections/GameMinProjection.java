package com.fglanna.dslistNelio.projections;

public interface GameMinProjection {
	
	Long getId();
	String getTitle();
	Integer getYear();		// foi trocada as aspas (crase) por aspas duplas
	String getImgUrl();
	String getShortDescription();
	Integer getPosition();	

}
