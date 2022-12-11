package com.util;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mvc.service.BagicMakeService;
import com.mvc.service.MainService;


public class FormulaUtil {
	
	private static Logger logger = Logger.getLogger(FormulaUtil.class.getName());
	
	public static  Map<String,Object> winNumToMakeStair(Map<String,Object> stairMap,Map<String,Object> winMap,int limit_idx) throws Exception {
		
		Map<String,Object> rtnInfo = new HashMap<String,Object>();
	 	
	 	
	 	int stairArrNum = 0;
	 	int winNum = 0;
	 	Integer winBonus = 0;
	 	boolean loop = true;
	 	int newIdx = limit_idx+1;
	 	
	 	winBonus = Integer.parseInt(String.valueOf(winMap.get("bonus")));
	 	if(limit_idx == 7) {
	 		if(winBonus != null) {
	 			winMap.put("num7", winBonus);
	 		}
	 	}
	 	
		for(int i = 1 ; i <= limit_idx ; i++) {
			rtnInfo.put("num"+i,Integer.parseInt(String.valueOf(winMap.get("num"+i))));
 		}
	 	
	 	for(int i = 1 ; i < 46  ;i++) {
	 		stairArrNum = Integer.parseInt(String.valueOf(stairMap.get("num"+i)));
	 		for(int j = 1 ; j <= limit_idx ; j++) {
	 			winNum = Integer.parseInt(String.valueOf(winMap.get("num"+j)));
	 			if(winNum == stairArrNum) {
	 				loop = false;
	 			}
	 		}
	 		
	 		if(loop) {
	 			rtnInfo.put("num"+newIdx,stairArrNum);
	 			newIdx++;
	 		}
	 		loop = true;
	 	}
	 	
        return rtnInfo;
	}
	
}
