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


public class CmmUtil {
	
	public static String mapGetString(Map<String,Object> params , String key) throws Exception {
		return String.valueOf(params.get(key));
	}
	
	public static Integer mapGetInteger(Map<String,Object> params , String key) throws Exception {
		return Integer.parseInt(String.valueOf(params.get(key)));
	}
	
	public static String mapSortToString(Map<String,Object> param) throws Exception {
		StringBuffer sb = new StringBuffer();
		Object chapter =  null;
		Object num = null;
		chapter = param.get("chapter");
		if(chapter != null) {
			sb.append("chapter=").append(chapter);
		}
		for(int i = 1 ; i < 46 ; i++) {
			num = param.get("num"+i);
			if(num !=  null) {
				sb.append(" num").append(i).append("=").append(num);
			}
		}
		
		return sb.toString();
	}
	
	public static int[] map6ToIntArray(Map<String,Object> param) throws Exception {
		int rtn_arr[] = new int[6];
		Object num = null;
		for(int i = 1 ; i <= 6 ; i++) {
			num = param.get("num"+i);
			if(num !=  null) {
				rtn_arr[i-1]= Integer.parseInt(String.valueOf(num));
			}
		}
		return rtn_arr;
	}
	
	public static int[] map7ToIntArray(Map<String,Object> param) throws Exception {
		int rtn_arr[] = new int[7];
		Object num = null;
		for(int i = 1 ; i <=7 ; i++) {
			num = param.get("num"+i);
			if(num !=  null) {
				rtn_arr[i-1]= Integer.parseInt(String.valueOf(num));
			}
		}
		return rtn_arr;
	}
	
	public static int[] map45ToIntArray(Map<String,Object> param) throws Exception {
		int rtn_arr[] = new int[46]; 
		Object num = null;
		for(int i = 1 ; i <= 45 ; i++) {
			num = param.get("num"+i);
			if(num !=  null) {
				rtn_arr[i-1]= Integer.parseInt(String.valueOf(num));
			}
		}
		
		return rtn_arr;
	}
	
	public static Map<String,Object> converterTwoDigits(Map<String,Object> params) throws Exception {
		
		Map<String,Object> rtnMap = new HashMap<String,Object>();
		rtnMap.putAll(params);
		int tmpNum = 0;
		for( Map.Entry<String, Object> elem : rtnMap.entrySet()){
			if(elem.getKey().indexOf("num") > -1) {
				tmpNum = Integer.parseInt(String.valueOf(elem.getValue()));
				if(tmpNum<10) {					
					rtnMap.put(elem.getKey(),"0"+tmpNum);
				}
			}	
		}
		
		return rtnMap;
	}
	
	public static int idxOf8145060(Map<String,Object> params) throws Exception {
		
		int[] r = new int[6];
		for(int i=1 ; i <= 6; i++) {
			r[i-1] = Integer.parseInt(String.valueOf(params.get("num"+i)));
		}
			
		int sum=0,nn=0,a=0,b=0,c=0,d=0,e=0,f=0;
	
		for(a=1; a<r[0]; a++) {
			nn = ((45-a)*(45-a-1)*(45-a-2)*(45-a-3)*(45-a-4)) / (5*4*3*2*1);
			sum += nn;
		}
	
		for(b=a+1; b<r[1]; b++) {
			nn = ((45-b)*(45-b-1)*(45-b-2)*(45-b-3)) / (4*3*2*1);
			sum += nn;
		}
	
		for(c=b+1; c<r[2]; c++) {
			nn = ((45-c)*(45-c-1)*(45-c-2)) / (3*2*1);
			sum += nn;
		}
	
		for(d=c+1; d<r[3]; d++) {
			nn = ((45-d)*(45-d-1)) / (2*1);
			sum += nn;
		}
	
		for(e=d+1; e<r[4]; e++) {
			nn = ((45-e)) / (1);
			sum += nn;
		}
	
		for(f=e+1; f<r[5]; f++) {
			nn = 1;
			sum += nn;
		}
		
		sum++;
		
		return sum;
	}
	
}
