package com.mvc.controller;

import java.nio.charset.Charset;
import java.util.ArrayList;
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

import com.mvc.service.MainService;



@Controller
public class MainController {
	
	private Logger logger = Logger.getLogger(MainController.class.getName());
	
	@Autowired
	MainService mainService;
	
	@RequestMapping(value = "/thymeleafView/index")
	public String goThymeleafIndex(HttpServletRequest request) throws Exception {	
		return "thymeleafView/index";
	}
	@RequestMapping(value = "/index")
	public String goThymeleafIndex1(HttpServletRequest request) throws Exception {
		return "hello";
	}
	
	@RequestMapping(value = "/thymeleafView/main/hello")
	public String hello(HttpServletRequest request) throws Exception {
		return "thymeleafView/main/hello";
	}
	
	@RequestMapping(value = "/selectSetSat")
	public ResponseEntity selectSetSat(HttpServletRequest request) throws Exception {
	
		 	HttpHeaders header = new HttpHeaders();
	        header.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
	
	        Map<String,Object> insMapInfo = mainService.selectSetSat();
	       
	        System.out.println("max_chater : "+String.valueOf(insMapInfo.get("max_chapter")));
	        Map<String,Object> paramMap = new HashMap<String,Object>();
	        paramMap.put("max_chapter", insMapInfo.get("max_chapter"));
	        
	        Map<String,Object> rtnMap = mainService.selectLastInfo(paramMap);
	       
	        
	        rtnMap.put("ins_chapter", String.valueOf((Integer)insMapInfo.get("max_chapter")+1));
	        rtnMap.put("ins_saturday", String.valueOf(insMapInfo.get("ins_saturday")));
	        rtnMap.put("update_yn", String.valueOf(insMapInfo.get("update_yn")));
	        
	        System.out.println("rtnMap : "+rtnMap.toString()); 
	        return new ResponseEntity<>(rtnMap, header, HttpStatus.OK);
	}
	/*
	@RequestMapping(value = "/")
	public String goThymeleafIndex(HttpServletRequest request) throws Exception {
		//ModelAndView mav = new ModelAndView("thymeleafView/index");	
		//return mav;
		return "winIndex";
	}
	*/
	
	@RequestMapping(value = "/crawlingChapter")
	public ResponseEntity crawlingChapter(HttpServletRequest request) throws Exception {
		
		HttpHeaders header = new HttpHeaders();
        header.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        Map<String,Object> resultMap = new HashMap<String,Object>();
        resultMap.put("continue", false);
        
        int ins_chapter = 0;
        String ins_dt ="2002-12-07";
        
        Map<String,Object> insMapInfo = mainService.selectSetSat();
        
        int max_chapter = ins_chapter;
        String dt = ins_dt;
       
        if(insMapInfo != null) {
        	max_chapter = Integer.parseInt(String.valueOf(insMapInfo.get("max_chapter")));
        	dt = String.valueOf(insMapInfo.get("ins_saturday"));
        }
        
        Map<String,Object> insOrderMapInfo = mainService.selectOrderSetSat();
        int max_Order_chapter = ins_chapter;
        String order_dt  = ins_dt;
        if(insOrderMapInfo!=null) {
        	max_Order_chapter  = Integer.parseInt(String.valueOf(insOrderMapInfo.get("max_chapter"))); 
        	order_dt = String.valueOf(insMapInfo.get("ins_saturday"));
        }
        
        ins_chapter = (max_chapter > max_Order_chapter ? max_Order_chapter : max_chapter)+1 ;
        ins_dt = max_chapter > max_Order_chapter ? order_dt : dt ;
        
		String url = "https://lottohell.com/statistics/round-ball-order/?round="+ins_chapter;
		
		Document doc = Jsoup.connect(url).get();
		Elements elem = doc.select("div[class^='d-inline-block numberCircle']");
		
		List<Integer> numList = new ArrayList<Integer>();
		for(Element e : elem.select("strong")) {
			numList.add(Integer.parseInt(e.text()));
			logger.info(e.text());
		}
		logger.info(String.valueOf(numList.size()));
		if(numList.size() > 0) {
			if(ins_chapter > max_Order_chapter) {
				Map<String,Object> insOrderMap = new HashMap<String,Object>();
				insOrderMap.put("chapter", ins_chapter);
				for(int i = 0 ; i <numList.size(); i ++) {
					if(numList.size()-1 == i) {
						insOrderMap.put("bonus",numList.get(i));
					}else {
						insOrderMap.put("num"+(i+1),numList.get(i));
					}
				}
				insOrderMap.put("dt", ins_dt);
				logger.info(insOrderMap.toString());
				mainService.insOrderWiN(insOrderMap);
				resultMap.put("continue", true);
			}
			
			if(ins_chapter > max_chapter) {
				Map<String,Object> insMap = new HashMap<String,Object>();
				insMap.put("chapter", ins_chapter);
				List<Integer> copyNumList = new ArrayList<Integer>();
				copyNumList.addAll(numList);
				copyNumList.remove(copyNumList.size()-1);
				Collections.sort(copyNumList);
				for(int i = 0 ; i <numList.size(); i ++) {
					if(numList.size()-1 == i) {
						insMap.put("bonus",numList.get(i));
					}else {
						insMap.put("num"+(i+1),copyNumList.get(i));
					}
				}
				insMap.put("dt", ins_dt);
				logger.info(insMap.toString());
				mainService.insWiN(insMap);
				resultMap.put("continue", true);
			}
			resultMap.put("ins_chapter", ins_chapter);
		}
		
		return new ResponseEntity<>(resultMap, header, HttpStatus.OK);	
	}
}
