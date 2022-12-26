package com.mvc.controller;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cont.CmmCont;
import com.cont.VerifyCont;
import com.mvc.service.MainService;
import com.mvc.service.VerifyService;



@Controller
public class VerifyController extends Thread{
	
	private Logger logger = Logger.getLogger(VerifyController.class.getName());
	
	@Autowired
	VerifyService verifyService;
	@Autowired
	MainService mainService;

	@RequestMapping(value = "/verifyStart")
	public ResponseEntity verifyStart(HttpServletRequest request) throws Exception {
			logger.info("verifyStart");
			
			HttpHeaders header = new HttpHeaders();
	        header.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
	        Map<String,Object> rtnMap = new HashMap<String,Object>();
	        
			if(!VerifyCont.VERIFY_ACTIVE) {
				
				VerifyCont.VERIFY_ACTIVE = true;
				
				//max chapter 구하기
		        Map<String,Object> paramMap =  mainService.selectSetSat();
		        //모든 번호 
		        List<Map<String,Object>> selAllWinList= mainService.selAllWinList();
		        //fmt 검증식 전체
		        List<Map<String,Object>> verifyList =  verifyService.selectVerifyList(paramMap);
		        
		        VerifyCont.VERIFY_CHECK_LIST = verifyList;
		        
		        Map<String,Object> fmlInfoMap = null;
		        
		        if(verifyList != null && verifyList.size() > 0) {

					String fml_cd = null;
					String state = null;
			        String use_yn = null;

		        	for(int i = 0 ; i < VerifyCont.VERIFY_CHECK_LIST.size() ; i++ ) {
		        		
		        		fmlInfoMap = VerifyCont.VERIFY_CHECK_LIST.get(i);
		        		
		        		fml_cd = String.valueOf(fmlInfoMap.get("fml_cd"));
		        		state = String.valueOf(fmlInfoMap.get("state"));
		        		use_yn = String.valueOf(fmlInfoMap.get("use_yn"));
		        		
		        		if(!"com".equals(state) && !"err".equals(state) && "Y".equals(use_yn)){
		        		
		        		//VERIFY_ACTIVE_THREAD_MAP 에 넣은거 보다
		        		//CmmCont.VERIFY_THREAD_TOTAL_COUNT 설정이 낮아야함
		        		if(VerifyCont.VERIFY_ACTIVE_THREAD_MAP.size() <= CmmCont.VERIFY_THREAD_TOTAL_COUNT) {
			        		
		        			
			        		VerifyCont.VERIFY_ACTIVE_THREAD_MAP.put(fml_cd,System.currentTimeMillis());
			        		logger.info("==============================> Thread Strart : "+fml_cd +" // params : "+fmlInfoMap.toString());
			        		
			        		verifyService.startVerify(fmlInfoMap, selAllWinList);
			        		
			        		
		        		}else {
		        			//300000 3분
		        			Thread.sleep(300000);
		        			//다시 돌기
		        			i=i-1;
		        		}
		        	}
		        }
		        VerifyCont.VERIFY_ACTIVE = false;
			}
		}else {
			rtnMap.put("msg", "검증 실행중 ");
		}
		return new ResponseEntity<>(rtnMap, header, HttpStatus.OK);
	}
	
	
}

