package com.mvc.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class OneSetDao {
	
	@Qualifier("sqlSession")
	@Autowired(required=true)
	SqlSessionTemplate sqlSession;
	
	String name_space = "com.mvc.dao.OneSetDao";

	
	public int insertTblFullList(List<Object> params) {
		
		return sqlSession.insert(name_space+".insertTblFullList", params);
	}
	
	public int insertTblFullPoint(List<Object> params) {
		
		return sqlSession.insert(name_space+".insertTblFullPoint", params);
	}
	
	
	
	
}
