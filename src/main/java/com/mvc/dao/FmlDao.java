package com.mvc.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class FmlDao {
	
	@Qualifier("sqlSession")
	@Autowired(required=true)
	SqlSessionTemplate sqlSession;
	
	String name_space = "com.mvc.dao.FmlDao";

	public List<Map<String,Object>> selFmlInfoList(Map<String,Object> params){
			
		return sqlSession.selectList(name_space+".selFmlInfoList", params);
	}
	
	public Map<String,Object> selNewFml(Map<String,Object> params){
		
		return sqlSession.selectOne(name_space+".selNewFml", params);
	}
	
	public int insNewFml(Map<String,Object> params){
		
		return sqlSession.insert(name_space+".insNewFml", params);
	}
	
	public int udpFmlErrLastChapter(Map<String,Object> params){
		
		return sqlSession.update(name_space+".udpFmlErrLastChapter", params);
	}
	
	
	
	
	
	
}
