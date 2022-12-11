package com.mvc.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class BagicMakeDao {
	
@Qualifier("sqlSession")
@Autowired(required=true)
SqlSessionTemplate sqlSession;

String name_space = "com.mvc.dao.BagicMakeDao";

	public Integer selStair6MaxChapter(){
		return sqlSession.selectOne(name_space+".selStair6MaxChapter");
	}
	public Map<String,Object> selStair6Info(int chapter){
		return sqlSession.selectOne(name_space+".selStair6Info" , chapter);
	}
	public Integer insertStair6(Map<String,Object> params) {
		return sqlSession.insert(name_space+".insertStair6" , params);
	}
	
	public Integer selStair7MaxChapter(){
		return sqlSession.selectOne(name_space+".selStair7MaxChapter");
	}
	public Map<String,Object> selStair7Info(int chapter){
		return sqlSession.selectOne(name_space+".selStair7Info" , chapter);
	}
	public Integer insertStair7(Map<String,Object> params) {
		return sqlSession.insert(name_space+".insertStair7" , params);
	}
	
	public Integer selOrderStair6MaxChapter(){
		return sqlSession.selectOne(name_space+".selOrderStair6MaxChapter");
	}
	public Map<String,Object>  selOrderStair6Info(int chapter){
		return sqlSession.selectOne(name_space+".selOrderStair6Info" , chapter);
	}
	public Integer insertOrderStair6(Map<String,Object> params) {
		return sqlSession.insert(name_space+".insertOrderStair6" , params);
	}
	
	public Integer selOrderStair7MaxChapter(){
		return sqlSession.selectOne(name_space+".selOrderStair7MaxChapter");
	}
	public Map<String,Object>  selOrderStair7Info(int chapter){
		
		return sqlSession.selectOne(name_space+".selOrderStair7Info" , chapter);
	}
	public Integer insertOrderStair7(Map<String,Object> params) {
		return sqlSession.insert(name_space+".insertOrderStair7" , params);
	}
	
	//vr1_tabl sql 
	public  List<Map<String,Object>> selVr1StairByBagicIdxList(int bagic_idx) {
		return sqlSession.selectList(name_space+".selVr1StairByBagicIdxList" , bagic_idx);
	}
	
	public int insVr1Stair(Map<String,Object> params) {
		return sqlSession.insert(name_space+".insVr1Stair",params);
	}
	
	public int delVr1Stair() {
		return sqlSession.delete(name_space+".delVr1Stair");
	}
	
	
	public Map<String,Object> selVr1StairOfBagicTbl(Map<String,Object> params) {
		return sqlSession.selectOne(name_space+".selVr1StairOfBagicSource" , params);
	}
	
	//vr2_tabl sql 
	public List<Map<String,Object>> selVr1StairOfVrstairCdByBagicIdx(int bagic_idx) {
		return sqlSession.selectList(name_space+".selVr1StairOfVrstairCdByBagicIdx", bagic_idx);
	}
	
	public Map<String,Object> selVr2StairMaxChapter(String vr1stair_cd) {
		return sqlSession.selectOne(name_space+".selVr2StairMaxChapter", vr1stair_cd);
	}
	
}
