package com.mvc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.cont.VerifyCont;
import com.mvc.dao.MainDao;
import com.mvc.dao.VerifyDao;
import com.mvc.fml.FmlNotOver;



@Service
public class VerifyService {
	
	@Autowired
	VerifyDao verifyDao;
	@Autowired
	MainDao mainDao;
	@Autowired
	FmlNotOver fmlNotOver;
	
	private Logger logger  = Logger.getLogger(VerifyService.class.getName());
	
	public List<Map<String,Object>> selectVerifyList(Map<String,Object> params) {
		
		return verifyDao.selectVerifyList(params);
	}
	

	@Async("threadExcutor")
	public Map<String,Object> startVerify(Map<String,Object> fmlInfoMap,List<Map<String, Object>> selAllWinList) {
		
		Map<String,Object> rtn  = new HashMap<String,Object>();
		String fml_cd = String.valueOf(fmlInfoMap.get("fml_cd"));
		String fml_judg = String.valueOf(fmlInfoMap.get("fml_judg"));
		String state = String.valueOf(fmlInfoMap.get("state"));
		String use_yn = String.valueOf(fmlInfoMap.get("use_yn"));
		
		
		try{ //no -> not over 넘지 않는다..
			
			if("no".equals(fml_judg) ) {
				fmlNotOver.notOver(fmlInfoMap, selAllWinList);
			}
			
		}catch(Exception ex) {
			logger.info("Error startVerify "+fml_cd+" : "+ex.toString());
		}finally {
			logger.info("==============================> Thread End :"+fml_cd+"("+String.valueOf((System.currentTimeMillis() -VerifyCont.VERIFY_ACTIVE_THREAD_MAP.get(fml_cd))/1000)+") / state : "+state+" / use_yn "+ use_yn);
			VerifyCont.VERIFY_ACTIVE_THREAD_MAP.remove(fml_cd);
		}
		
		return rtn ;
	}
	
}
