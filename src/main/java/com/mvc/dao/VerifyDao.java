package com.mvc.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class VerifyDao {
	
	@Qualifier("sqlSession")
	@Autowired(required=true)
	SqlSessionTemplate sqlSession;
	
	String name_space = "com.mvc.dao.VerifyDao";

	public List<Map<String,Object>> selectVerifyList(Map<String,Object> params){
			
		return sqlSession.selectList(name_space+".selectVerifyList", params);
	}
	
	public Map<String,Object> selectVerifyInfo(Map<String,Object> params){
		
		return sqlSession.selectOne(name_space+".selectVerifyInfo", params);
	}
	
	
	
}
