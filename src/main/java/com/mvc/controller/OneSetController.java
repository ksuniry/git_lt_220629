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

import com.mvc.service.BagicMakeService;
import com.mvc.service.MainService;
import com.mvc.service.OneSetService;



@Controller
public class OneSetController {
	
	private Logger logger = Logger.getLogger(OneSetController.class.getName());
	
	@Autowired
	OneSetService oneSetService;
	
	@RequestMapping(value = "/init8145060")
	public ResponseEntity make8145060(HttpServletRequest request) throws Exception {
			logger.info("make8145060 Call");
		 	HttpHeaders header = new HttpHeaders();
	        header.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
	        Map<String,Object> rtnMap = new HashMap<String,Object>(); 
	        oneSetService.make8145060();
	        return new ResponseEntity<>(rtnMap, header, HttpStatus.OK);
	}
	
}
