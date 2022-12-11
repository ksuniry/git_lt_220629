package com.cont;

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


public class VerifyCont {
	
	public static Map<String,Long> VERIFY_ACTIVE_THREAD_MAP = new HashMap<String,Long>();
	public static List<Map<String,Object>> VERIFY_CHECK_LIST = new ArrayList<Map<String,Object>>();
	public static boolean VERIFY_ACTIVE = false;
	public static long STAIR6_START_TIME = 0;  
	public static long STAIR7_START_TIME = 0;
	public static long ORDER_STAIR6_START_TIME = 0;
	public static long ORDER_STAIR7_START_TIME = 0;
	
}
