package com.mvc.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class MainDao {
	
	@Qualifier("sqlSession")
	@Autowired(required=true)
	SqlSessionTemplate sqlSession;
	
	String name_space = "com.mvc.dao.MainDao";
	
	public List<Map<String,Object>> selAllWinList(){
		
		return sqlSession.selectList(name_space+".selAllWinList");
	}
	
	public Integer selMaxChapter(){
			
		return sqlSession.selectOne(name_space+".selMaxChapter");
	}
	public Map<String,Object> selectSetSat(){
		
		return sqlSession.selectOne(name_space+".selectSetSat");
	}
	public Map<String,Object> selectLastInfo(Map<String,Object> params){
		
		return sqlSession.selectOne(name_space+".selectLastInfo", params);
	}
	public Map<String,Object> selWinInfo(int chapter){
		
		return sqlSession.selectOne(name_space+".selWinInfo", chapter);
	}
	public int insWiN(Map<String,Object> params) {
		
		return sqlSession.insert(name_space+".insWiN", params);
	}
	
	
	public Integer selMaxOrderChapter(){
		
		return sqlSession.selectOne(name_space+".selMaxOrderChapter");
	}
	public Map<String,Object> selectOrderSetSat(){
		
		return sqlSession.selectOne(name_space+".selectOrderSetSat");
	}
	public Map<String,Object> selectOrderLastInfo(Map<String,Object> params){
		
		return sqlSession.selectOne(name_space+".selectOrderLastInfo", params);
	}
	public Map<String,Object> selOrderWinInfo(int chapter){
		
		return sqlSession.selectOne(name_space+".selOrderWinInfo", chapter);
	}
	public int insOrderWiN(Map<String,Object> params) {
		
		return sqlSession.insert(name_space+".insOrderWiN", params);
	}
	
}
