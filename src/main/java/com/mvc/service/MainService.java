package com.mvc.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.mvc.dao.MainDao;


@Service
public class MainService {
	
	@Autowired
	MainDao mainDao;
	
	public Map<String,Object> selectSetSat() {
		
		return mainDao.selectSetSat();
	}
	
	public Map<String,Object> selectLastInfo(Map<String,Object> params) {
		
		return mainDao.selectLastInfo(params);
	}
	
	public int insWiN(Map<String,Object> params) {
		
		return mainDao.insWiN(params);
	}
	
	public Map<String,Object> selectOrderSetSat() {
		
		return mainDao.selectOrderSetSat();
	}
	
	public Map<String,Object> selectOrderLastInfo(Map<String,Object> params) {
		
		return mainDao.selectOrderLastInfo(params);
	}
	
	public int insOrderWiN(Map<String,Object> params) {
		
		return mainDao.insOrderWiN(params);
	}
	
	public int selMaxChapter() {
		
		return mainDao.selMaxChapter();
	}
	
	public List<Map<String,Object>> selAllWinList() {
		
		return mainDao.selAllWinList();
	}

}
